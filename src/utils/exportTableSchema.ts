import { Table } from '../types';

/**
 * テーブルスキーマをCSV形式でエクスポート
 * タブ区切りで各テーブルのカラム情報を出力
 */
export function exportTableSchemaAsCSV(
  tables: Table[],
  filename: string = 'table-schema.csv'
) {
  try {
    let csv = '';

    tables.forEach((table, index) => {
      // テーブルごとにセクションを分ける
      if (index > 0) {
        csv += '\n\n'; // テーブル間に空行を追加
      }

      // テーブル名のヘッダー
      csv += `テーブル名,${table.name}\n`;
      csv += '\n';

      // カラム情報のヘッダー行
      csv += 'カラム名,データ型,日本語名,説明,主キー,外部キー,NULL許可,参照先\n';

      // 各カラムの情報
      table.columns.forEach((column) => {
        const columnName = column.name;
        const dataType = column.type;
        const displayName = column.displayName || '';
        const description = (column.description || '').replace(/"/g, '""'); // CSVエスケープ
        const isPK = column.isPrimaryKey ? '✓' : '';
        const isFK = column.isForeignKey ? '✓' : '';
        const isNullable = column.isNullable ? '✓' : '';
        const foreignKeyRef = column.foreignKeyRef
          ? `${column.foreignKeyRef.table}(${column.foreignKeyRef.column})`
          : '';

        csv += `"${columnName}","${dataType}","${displayName}","${description}",${isPK},${isFK},${isNullable},"${foreignKeyRef}"\n`;
      });
    });

    // ダウンロード
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export CSV:', error);
    throw error;
  }
}

/**
 * テーブルスキーマをTSV（タブ区切り）形式でエクスポート
 * Excelで開きやすい形式
 */
export function exportTableSchemaAsTSV(
  tables: Table[],
  filename: string = 'table-schema.tsv'
) {
  try {
    let tsv = '';

    tables.forEach((table, index) => {
      // テーブルごとにセクションを分ける
      if (index > 0) {
        tsv += '\n\n'; // テーブル間に空行を追加
      }

      // テーブル名のヘッダー
      tsv += `テーブル名\t${table.name}\n`;
      tsv += '\n';

      // カラム情報のヘッダー行
      tsv += 'カラム名\tデータ型\t日本語名\t説明\t主キー\t外部キー\tNULL許可\t参照先\n';

      // 各カラムの情報
      table.columns.forEach((column) => {
        const columnName = column.name;
        const dataType = column.type;
        const displayName = column.displayName || '';
        const description = (column.description || '').replace(/\t/g, ' '); // タブをスペースに置換
        const isPK = column.isPrimaryKey ? '✓' : '';
        const isFK = column.isForeignKey ? '✓' : '';
        const isNullable = column.isNullable ? '✓' : '';
        const foreignKeyRef = column.foreignKeyRef
          ? `${column.foreignKeyRef.table}(${column.foreignKeyRef.column})`
          : '';

        tsv += `${columnName}\t${dataType}\t${displayName}\t${description}\t${isPK}\t${isFK}\t${isNullable}\t${foreignKeyRef}\n`;
      });
    });

    // ダウンロード
    const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export TSV:', error);
    throw error;
  }
}
