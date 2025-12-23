import React, { useState } from 'react';
import { X, Copy, Check, Key, KeyRound, Edit2, Save } from 'lucide-react';
import { Table, Column } from '../types';

interface TableSQLSidebarProps {
  table: Table | null;
  onClose: () => void;
  onUpdateColumn?: (tableName: string, columnName: string, updates: Partial<Column>) => void;
}

const TableSQLSidebar: React.FC<TableSQLSidebarProps> = ({ table, onClose, onUpdateColumn }) => {
  const [copied, setCopied] = useState(false);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (!table) return null;

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

  // SQL文のシンタックスハイライト
  const highlightSQL = (sql: string) => {
    const keywords = [
      'CREATE TABLE', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES',
      'NOT NULL', 'INT', 'VARCHAR', 'TEXT', 'TIMESTAMP', 'DATE', 'BOOLEAN',
      'BIGINT', 'SMALLINT', 'DECIMAL', 'NUMERIC', 'REAL', 'DOUBLE PRECISION',
      'SERIAL', 'BIGSERIAL', 'CHAR', 'TIME', 'INTERVAL', 'ENUM'
    ];

    let highlighted = sql;

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="sql-keyword">$1</span>`);
    });

    // カラム名をハイライト（行頭の空白+識別子）
    highlighted = highlighted.replace(/^(\s+)([a-zA-Z_][a-zA-Z0-9_]*)/gm, '$1<span class="sql-column">$2</span>');

    return highlighted;
  };

  // カラム編集開始
  const handleEditColumn = (column: Column) => {
    setEditingColumn(column.name);
    setEditDisplayName(column.displayName || '');
    setEditDescription(column.description || '');
  };

  // カラム編集保存
  const handleSaveColumn = () => {
    if (editingColumn && onUpdateColumn) {
      onUpdateColumn(table.name, editingColumn, {
        displayName: editDisplayName.trim() || undefined,
        description: editDescription.trim() || undefined,
      });
    }
    setEditingColumn(null);
    setEditDisplayName('');
    setEditDescription('');
  };

  // カラム編集キャンセル
  const handleCancelEdit = () => {
    setEditingColumn(null);
    setEditDisplayName('');
    setEditDescription('');
  };

  return (
    <div className="w-96 bg-white border-r border-gray-300 shadow-lg flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800">{table.name}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="閉じる"
        >
          <X size={20} />
        </button>
      </div>

      {/* SQL表示エリア */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">SQL定義</h4>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>コピー済み</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>コピー</span>
              </>
            )}
          </button>
        </div>

        <style>{`
          .sql-keyword {
            color: #60a5fa;
            font-weight: 600;
          }
          .sql-column {
            color: #a78bfa;
          }
        `}</style>
        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
          <code
            className="font-mono leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightSQL(sqlText) }}
          />
        </pre>

        {/* カラム一覧 */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">カラム一覧</h4>
          <div className="space-y-2">
            {table.columns.map((col, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {col.isPrimaryKey && col.isForeignKey && (
                        <div className="flex-shrink-0" title="主キー・外部キー">
                          <Key size={14} className="text-green-600" />
                        </div>
                      )}
                      {col.isPrimaryKey && !col.isForeignKey && (
                        <div className="flex-shrink-0" title="主キー">
                          <Key size={14} className="text-yellow-600" />
                        </div>
                      )}
                      {col.isForeignKey && !col.isPrimaryKey && (
                        <div className="flex-shrink-0" title="外部キー">
                          <KeyRound size={14} className="text-purple-600" />
                        </div>
                      )}
                      <span className="font-semibold text-gray-800 text-sm">{col.name}</span>
                      {col.displayName && (
                        <span className="text-xs text-blue-600">({col.displayName})</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 ml-6">
                      {col.type}
                      {!col.isNullable && <span className="text-red-600 ml-1">NOT NULL</span>}
                    </div>
                    {col.isForeignKey && col.foreignKeyRef && (
                      <div className="text-xs text-purple-600 mt-1 ml-6">
                        → {col.foreignKeyRef.table}.{col.foreignKeyRef.column}
                      </div>
                    )}
                    {col.description && editingColumn !== col.name && (
                      <div className="text-xs text-gray-500 mt-1 ml-6 italic">{col.description}</div>
                    )}
                  </div>
                  {onUpdateColumn && editingColumn !== col.name && (
                    <button
                      onClick={() => handleEditColumn(col)}
                      className="text-blue-600 hover:text-blue-800 p-1 flex-shrink-0"
                      title="編集"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>

                {/* 編集フォーム */}
                {editingColumn === col.name && (
                  <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        日本語表示名
                      </label>
                      <input
                        type="text"
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        placeholder="例: ユーザーID"
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        説明
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="カラムの説明を入力"
                        rows={2}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveColumn}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Save size={12} />
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSQLSidebar;
