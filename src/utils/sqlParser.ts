import { Table, Column, Relationship } from '../types';

export function parseSQLToTables(sql: string): { tables: Table[]; relationships: Relationship[] } {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];

  // SQLを正規化（改行を統一、余分な空白を削除）
  const normalizedSQL = sql
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '\n')
    .trim();

  // CREATE TABLEステートメントを抽出（スキーマ名対応）
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`?(\w+)`?\.)?`?(\w+)`?\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = createTableRegex.exec(normalizedSQL)) !== null) {
    const schemaName = match[1]; // スキーマ名（あれば）
    const tableName = match[2];  // テーブル名
    const tableContent = match[3]; // テーブル定義内容

    const columns: Column[] = [];
    const lines = tableContent.split('\n').map(line => line.trim()).filter(line => line);

    let primaryKeys: string[] = [];
    const foreignKeys: Map<string, { table: string; column: string }> = new Map();

    for (const line of lines) {
      // CONSTRAINT ... PRIMARY KEY の形式をスキップ
      if (line.match(/^CONSTRAINT\s+\w+\s+PRIMARY\s+KEY/i)) {
        const pkMatch = line.match(/PRIMARY\s+KEY\s*\(\s*`?(\w+)`?\s*\)/i);
        if (pkMatch) {
          primaryKeys.push(pkMatch[1]);
        }
        continue;
      }

      // PRIMARY KEY制約
      if (line.match(/PRIMARY\s+KEY/i) && !line.match(/^`?\w+`?\s+/)) {
        const pkMatch = line.match(/PRIMARY\s+KEY\s*\(\s*`?(\w+)`?\s*\)/i);
        if (pkMatch) {
          primaryKeys.push(pkMatch[1]);
        }
        continue;
      }

      // CONSTRAINT ... FOREIGN KEY の形式
      if (line.match(/^CONSTRAINT\s+\w+\s+FOREIGN\s+KEY/i)) {
        const fkMatch = line.match(/FOREIGN\s+KEY\s*\(\s*`?(\w+)`?\s*\)\s*REFERENCES\s+(?:`?\w+`?\.)?`?(\w+)`?\s*\(\s*`?(\w+)`?\s*\)/i);
        if (fkMatch) {
          const [, columnName, refTable, refColumn] = fkMatch;
          foreignKeys.set(columnName, { table: refTable, column: refColumn });

          // リレーションシップを追加
          relationships.push({
            id: `${tableName}_${columnName}_${refTable}_${refColumn}`,
            source: tableName,
            target: refTable,
            sourceColumn: columnName,
            targetColumn: refColumn,
            type: 'one-to-many',
          });
        }
        continue;
      }

      // FOREIGN KEY制約
      if (line.match(/FOREIGN\s+KEY/i)) {
        const fkMatch = line.match(/FOREIGN\s+KEY\s*\(\s*`?(\w+)`?\s*\)\s*REFERENCES\s+(?:`?\w+`?\.)?`?(\w+)`?\s*\(\s*`?(\w+)`?\s*\)/i);
        if (fkMatch) {
          const [, columnName, refTable, refColumn] = fkMatch;
          foreignKeys.set(columnName, { table: refTable, column: refColumn });

          // リレーションシップを追加
          relationships.push({
            id: `${tableName}_${columnName}_${refTable}_${refColumn}`,
            source: tableName,
            target: refTable,
            sourceColumn: columnName,
            targetColumn: refColumn,
            type: 'one-to-many',
          });
        }
        continue;
      }

      // CHECK制約をスキップ
      if (line.match(/^CONSTRAINT\s+\w+\s+CHECK/i)) {
        continue;
      }

      // カラム定義（SERIAL, BIGSERIAL, その他の型に対応）
      const columnMatch = line.match(/^`?(\w+)`?\s+(SERIAL|BIGSERIAL|INTEGER|INT|TEXT|VARCHAR|TIMESTAMP|DATE|REAL|NUMERIC|BOOLEAN|\w+(?:\s+WITH\s+TIME\s+ZONE)?(?:\([\d,\s]+\))?)/i);
      if (columnMatch) {
        const columnName = columnMatch[1];
        let columnType = columnMatch[2];

        // SERIAL/BIGSERIALは自動的に主キーとして扱うことが多いが、明示的なPKチェックも行う
        const isSerialType = columnType.match(/^(BIG)?SERIAL$/i);

        // カラムレベルのPRIMARY KEY
        const isInlinePK = line.match(/PRIMARY\s+KEY/i) !== null;
        if (isInlinePK) {
          primaryKeys.push(columnName);
        }

        // カラムレベルのREFERENCES（スキーマ名対応）
        const inlineFKMatch = line.match(/REFERENCES\s+(?:`?\w+`?\.)?`?(\w+)`?\s*\(\s*`?(\w+)`?\s*\)/i);
        if (inlineFKMatch) {
          const [, refTable, refColumn] = inlineFKMatch;
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
    columns.forEach(col => {
      if (primaryKeys.includes(col.name)) {
        col.isPrimaryKey = true;
      }
    });

    tables.push({
      name: tableName,
      columns,
    });
  }

  return { tables, relationships };
}
