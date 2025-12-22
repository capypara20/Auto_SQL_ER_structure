import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Table } from '../types';

interface TableSQLModalProps {
  table: Table;
  onClose: () => void;
}

const TableSQLModal: React.FC<TableSQLModalProps> = ({ table, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  // テーブルからSQL CREATE文を生成
  const generateSQL = (table: Table): string => {
    const lines: string[] = [];
    lines.push(`CREATE TABLE ${table.name} (`);

    // カラム定義
    const columnDefs = table.columns.map((col) => {
      let def = `  ${col.name} ${col.type}`;
      if (!col.isNullable) def += ' NOT NULL';
      return def;
    });

    // 主キーの追加
    const primaryKeys = table.columns.filter((col) => col.isPrimaryKey).map((col) => col.name);
    if (primaryKeys.length > 0) {
      columnDefs.push(`  PRIMARY KEY (${primaryKeys.join(', ')})`);
    }

    // 外部キーの追加
    table.columns.forEach((col) => {
      if (col.isForeignKey && col.foreignKeyRef) {
        const { table: refTable, column: refColumn } = col.foreignKeyRef;
        columnDefs.push(
          `  FOREIGN KEY (${col.name}) REFERENCES ${refTable}(${refColumn})`
        );
      }
    });

    lines.push(columnDefs.join(',\n'));
    lines.push(');');

    return lines.join('\n');
  };

  const sqlText = generateSQL(table);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-2xl w-[95vw] max-w-[1400px] max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {table.name} - SQL定義
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-base font-medium"
            >
              {copied ? (
                <>
                  <Check size={20} />
                  <span>コピーしました</span>
                </>
              ) : (
                <>
                  <Copy size={20} />
                  <span>コピー</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="閉じる"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* SQL表示エリア */}
        <div className="flex-1 overflow-auto p-6">
          <pre className="bg-gray-900 text-gray-100 p-5 rounded-lg overflow-x-auto">
            <code className="text-base font-mono leading-relaxed">{sqlText}</code>
          </pre>

          {/* テーブル詳細情報 */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">カラム一覧</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-base font-semibold text-gray-700 border-b">
                      カラム名
                    </th>
                    <th className="px-5 py-3 text-left text-base font-semibold text-gray-700 border-b">
                      データ型
                    </th>
                    <th className="px-5 py-3 text-left text-base font-semibold text-gray-700 border-b">
                      NULL許可
                    </th>
                    <th className="px-5 py-3 text-left text-base font-semibold text-gray-700 border-b">
                      主キー
                    </th>
                    <th className="px-5 py-3 text-left text-base font-semibold text-gray-700 border-b">
                      外部キー
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-5 py-3 text-base text-gray-800 border-b font-medium">
                        {col.name}
                      </td>
                      <td className="px-5 py-3 text-base text-gray-600 border-b">
                        {col.type}
                      </td>
                      <td className="px-5 py-3 text-base text-gray-600 border-b text-center">
                        {col.isNullable ? '○' : '×'}
                      </td>
                      <td className="px-5 py-3 text-base text-gray-600 border-b text-center">
                        {col.isPrimaryKey ? '●' : ''}
                      </td>
                      <td className="px-5 py-3 text-base text-gray-600 border-b">
                        {col.isForeignKey && col.foreignKeyRef
                          ? `${col.foreignKeyRef.table}.${col.foreignKeyRef.column}`
                          : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSQLModal;
