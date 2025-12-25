import { Table, Column, Relationship } from '../types';

export function parseSQLToTables(sql: string): { tables: Table[]; relationships: Relationship[] } {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];

  // SQLを正規化（改行を統一、余分な空白を削除）
  const normalizedSQL = sql
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '\n')
    .trim();

  // ALTER TABLE制約を一時保存
  const alterTableConstraints: {
    tableName: string;
    type: 'PRIMARY_KEY' | 'FOREIGN_KEY' | 'UNIQUE';
    columns?: string[];
    refTable?: string;
    refColumns?: string[];
  }[] = [];

  // ALTER TABLE文を個別に抽出して処理
  // IF EXISTSにも対応、SQL Serverのブラケット記法 [table] にも対応
  const alterTableStatements = normalizedSQL.match(/ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:(?:`?\w+`?|\[\w+\])\.)?(?:`?\w+`?|\[\w+\])[\s\S]*?;/gi) || [];

  alterTableStatements.forEach(statement => {
    // テーブル名を抽出（バッククォートとブラケットの両方に対応）
    const tableNameMatch = statement.match(/ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:(?:`?(\w+)`?|\[(\w+)\])\.)?(?:`?(\w+)`?|\[(\w+)\])/i);
    if (!tableNameMatch) return;

    const tableName = tableNameMatch[3] || tableNameMatch[4]; // バッククォートまたはブラケット

    // 各ADD句を個別に処理（カンマ区切りの複数ADD対応）
    // ADD CONSTRAINT または ADD PRIMARY KEY/FOREIGN KEY/UNIQUE を検索
    // SQL Serverのブラケット記法にも対応
    const addClauses = statement.matchAll(/ADD\s+(?:CONSTRAINT\s+(?:\w+|\[\w+\])\s+)?(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE)\s*\(([^)]+)\)(?:\s+REFERENCES\s+(?:(?:`?\w+`?|\[\w+\])\.)?(?:`?(\w+)`?|\[(\w+)\])\s*\(([^)]+)\))?(?:\s+ON\s+(?:DELETE|UPDATE)\s+(?:CASCADE|SET\s+NULL|NO\s+ACTION|RESTRICT))*/gi);

    for (const addMatch of addClauses) {
      const constraintType = addMatch[1].toUpperCase().replace(/\s+/g, '_');
      const columns = addMatch[2].split(',').map(col => col.trim().replace(/[\[\]`]/g, '')); // ブラケットとバッククォート除去
      const refTable = addMatch[3] || addMatch[4]; // バッククォートまたはブラケット
      const refColumns = addMatch[5]?.split(',').map(col => col.trim().replace(/[\[\]`]/g, '')); // ブラケットとバッククォート除去

      if (constraintType === 'PRIMARY_KEY') {
        alterTableConstraints.push({
          tableName,
          type: 'PRIMARY_KEY',
          columns,
        });
      } else if (constraintType === 'FOREIGN_KEY' && refTable) {
        alterTableConstraints.push({
          tableName,
          type: 'FOREIGN_KEY',
          columns,
          refTable,
          refColumns,
        });
      } else if (constraintType === 'UNIQUE') {
        alterTableConstraints.push({
          tableName,
          type: 'UNIQUE',
          columns,
        });
      }
    }
  });

  // CREATE TABLEステートメントを抽出（スキーマ名対応、SQL Serverブラケット記法対応）
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:(?:`?(\w+)`?|\[(\w+)\])\.)?(?:`?([\w.]+)`?|\[([\w.]+)\])\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = createTableRegex.exec(normalizedSQL)) !== null) {
    // const schemaName = match[1] || match[2]; // スキーマ名（あれば）- 将来の機能拡張用
    const tableName = match[3] || match[4];  // テーブル名（バッククォートまたはブラケット）
    const tableContent = match[5]; // テーブル定義内容

    const columns: Column[] = [];
    const lines = tableContent.split('\n').map(line => line.trim()).filter(line => line);

    let primaryKeys: string[] = [];
    const foreignKeys: Map<string, { table: string; column: string }> = new Map();

    for (const line of lines) {
      // デバッグ: PRIMARY KEYを含む行をすべて表示
      if (line.match(/PRIMARY/i)) {
        console.log(`Line with PRIMARY: "${line}"`);
      }

      // CONSTRAINT ... PRIMARY KEY の形式をスキップ（SQL Serverブラケット記法対応）
      if (line.match(/^CONSTRAINT\s+(?:\w+|\[\w+\])\s+PRIMARY\s+KEY/i)) {
        const pkMatch = line.match(/PRIMARY\s+KEY\s*(?:CLUSTERED\s*)?\(\s*([^)]+)\s*\)/i);
        if (pkMatch) {
          // カンマ区切りで複数のカラム名を取得（複合主キー対応、ブラケット除去）
          const columns = pkMatch[1].split(',').map(col => col.trim().replace(/[\[\]`]/g, ''));
          primaryKeys.push(...columns);
        }
        continue;
      }

      // PRIMARY KEY制約（行頭がPRIMARY KEYで始まる）
      if (line.match(/^PRIMARY\s+KEY\s*\(/i)) {
        console.log(`PRIMARY KEY line: "${line}"`);
        const pkMatch = line.match(/PRIMARY\s+KEY\s*(?:CLUSTERED\s*)?\(\s*([^)]+)\s*\)/i);
        if (pkMatch) {
          console.log(`  → Captured: "${pkMatch[1]}"`);
          // カンマ区切りで複数のカラム名を取得（複合主キー対応、ブラケット除去）
          const columns = pkMatch[1].split(',').map(col => col.trim().replace(/[\[\]`]/g, ''));
          primaryKeys.push(...columns);
        }
        continue;
      }

      // CONSTRAINT ... FOREIGN KEY の形式（SQL Serverブラケット記法対応）
      if (line.match(/^CONSTRAINT\s+(?:\w+|\[\w+\])\s+FOREIGN\s+KEY/i)) {
        // 複合外部キーの場合: FOREIGN KEY (col1, col2) REFERENCES table(col1, col2)
        const compositeFkMatch = line.match(/FOREIGN\s+KEY\s*\(\s*([^)]+)\s*\)\s*REFERENCES\s+(?:(?:`?\w+`?|\[\w+\])\.)?(?:`?(\w+)`?|\[(\w+)\])\s*\(\s*([^)]+)\s*\)/i);
        if (compositeFkMatch) {
          const sourceColumns = compositeFkMatch[1].split(',').map(col => col.trim().replace(/[\[\]`]/g, ''));
          const refTable = compositeFkMatch[2] || compositeFkMatch[3]; // バッククォートまたはブラケット
          const refColumns = compositeFkMatch[4].split(',').map(col => col.trim().replace(/[\[\]`]/g, ''));

          // 各カラムを外部キーとして登録
          sourceColumns.forEach((sourceCol, index) => {
            const refCol = refColumns[index] || refColumns[0];
            foreignKeys.set(sourceCol, { table: refTable, column: refCol });

            // リレーションシップを追加
            relationships.push({
              id: `${tableName}_${sourceCol}_${refTable}_${refCol}`,
              source: tableName,
              target: refTable,
              sourceColumn: sourceCol,
              targetColumn: refCol,
              type: 'one-to-many',
            });
          });
        }
        continue;
      }

      // FOREIGN KEY制約（SQL Serverブラケット記法対応）
      if (line.match(/FOREIGN\s+KEY/i)) {
        // 複合外部キーの場合: FOREIGN KEY (col1, col2) REFERENCES table(col1, col2)
        const compositeFkMatch = line.match(/FOREIGN\s+KEY\s*\(\s*([^)]+)\s*\)\s*REFERENCES\s+(?:(?:`?\w+`?|\[\w+\])\.)?(?:`?(\w+)`?|\[(\w+)\])\s*\(\s*([^)]+)\s*\)/i);
        if (compositeFkMatch) {
          const sourceColumns = compositeFkMatch[1].split(',').map(col => col.trim().replace(/[\[\]`]/g, ''));
          const refTable = compositeFkMatch[2] || compositeFkMatch[3]; // バッククォートまたはブラケット
          const refColumns = compositeFkMatch[4].split(',').map(col => col.trim().replace(/[\[\]`]/g, ''));

          // 各カラムを外部キーとして登録
          sourceColumns.forEach((sourceCol, index) => {
            const refCol = refColumns[index] || refColumns[0];
            foreignKeys.set(sourceCol, { table: refTable, column: refCol });

            // リレーションシップを追加
            relationships.push({
              id: `${tableName}_${sourceCol}_${refTable}_${refCol}`,
              source: tableName,
              target: refTable,
              sourceColumn: sourceCol,
              targetColumn: refCol,
              type: 'one-to-many',
            });
          });
        }
        continue;
      }

      // CHECK制約をスキップ
      if (line.match(/^CONSTRAINT\s+\w+\s+CHECK/i)) {
        continue;
      }

      // カラム定義（SERIAL, BIGSERIAL, SQL Server型に対応、ブラケット記法対応）
      const columnMatch = line.match(/^(?:`?(\w+)`?|\[(\w+)\])\s+(SERIAL|BIGSERIAL|INTEGER|INT|BIGINT|TEXT|VARCHAR|NVARCHAR|CHAR|NCHAR|TIMESTAMP|DATETIME|DATE|REAL|NUMERIC|DECIMAL|BOOLEAN|BIT|VARBINARY|BINARY|\w+(?:\s+WITH\s+TIME\s+ZONE)?(?:\([\d,\s]+\))?(?:\s+IDENTITY)?)/i);
      if (columnMatch) {
        const columnName = columnMatch[1] || columnMatch[2]; // バッククォートまたはブラケット
        let columnType = columnMatch[3];

        // SERIAL/BIGSERIALは自動的に主キーとして扱うことが多いが、明示的なPKチェックも行う
        // const isSerialType = columnType.match(/^(BIG)?SERIAL$/i); // 将来の機能拡張用

        // カラムレベルのPRIMARY KEY
        const isInlinePK = line.match(/PRIMARY\s+KEY/i) !== null;
        if (isInlinePK) {
          primaryKeys.push(columnName);
        }

        // カラムレベルのREFERENCES（スキーマ名対応、SQL Serverブラケット記法対応）
        const inlineFKMatch = line.match(/REFERENCES\s+(?:(?:`?\w+`?|\[\w+\])\.)?(?:`?(\w+)`?|\[(\w+)\])(?:\s*\(\s*(?:`?(\w+)`?|\[(\w+)\])\s*\))?/i);
        if (inlineFKMatch) {
          const refTable = inlineFKMatch[1] || inlineFKMatch[2];
          const refColumn = inlineFKMatch[3] || inlineFKMatch[4] || columnName; // 参照先カラムが省略されている場合は同名と仮定
          foreignKeys.set(columnName, { table: refTable, column: refColumn });

          relationships.push({
            id: `${tableName}_${columnName}_${refTable}_${refColumn}`,
            source: tableName,
            target: refTable,
            sourceColumn: columnName,
            targetColumn: refColumn,
            type: 'one-to-many',
          });
        }

        const isNullable = !line.match(/NOT\s+NULL/i);

        // TIMESTAMP WITH TIME ZONE などの複合型に対応
        const typeMatch = line.match(/^\w+\s+((?:TIMESTAMP|TIME)\s+WITH\s+TIME\s+ZONE)/i);
        if (typeMatch) {
          columnType = typeMatch[1];
        }

        columns.push({
          name: columnName,
          type: columnType,
          isPrimaryKey: primaryKeys.includes(columnName) || isInlinePK,
          isForeignKey: foreignKeys.has(columnName),
          isNullable,
          foreignKeyRef: foreignKeys.get(columnName),
        });
      }
    }

    // PRIMARY KEYフラグを更新
    console.log(`${tableName}: PK=[${primaryKeys.join(', ')}] FK=[${Array.from(foreignKeys.keys()).join(', ')}]`);
    columns.forEach(col => {
      if (primaryKeys.includes(col.name)) {
        col.isPrimaryKey = true;
      }
    });

    // FOREIGN KEYフラグを更新
    columns.forEach(col => {
      if (foreignKeys.has(col.name)) {
        col.isForeignKey = true;
        col.foreignKeyRef = foreignKeys.get(col.name);
      }
    });

    tables.push({
      name: tableName,
      columns,
    });
  }

  // ALTER TABLE制約を適用
  alterTableConstraints.forEach(constraint => {
    const table = tables.find(t => t.name === constraint.tableName);
    if (!table) return;

    if (constraint.type === 'PRIMARY_KEY' && constraint.columns) {
      // 主キー制約を適用
      constraint.columns.forEach(colName => {
        const column = table.columns.find(c => c.name === colName);
        if (column) {
          column.isPrimaryKey = true;
        }
      });
    } else if (constraint.type === 'FOREIGN_KEY' && constraint.columns && constraint.refTable && constraint.refColumns) {
      // 外部キー制約を適用
      constraint.columns.forEach((colName, index) => {
        const column = table.columns.find(c => c.name === colName);
        const refColumn = constraint.refColumns![index] || constraint.refColumns![0];

        if (column) {
          column.isForeignKey = true;
          column.foreignKeyRef = {
            table: constraint.refTable!,
            column: refColumn,
          };

          // リレーションシップを追加
          relationships.push({
            id: `${table.name}_${colName}_${constraint.refTable}_${refColumn}`,
            source: table.name,
            target: constraint.refTable!,
            sourceColumn: colName,
            targetColumn: refColumn,
            type: 'one-to-many',
          });
        }
      });
    }
  });

  return { tables, relationships };
}
