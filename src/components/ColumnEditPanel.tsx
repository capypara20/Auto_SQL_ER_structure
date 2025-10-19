import React, { useState } from 'react';
import { Table, Column } from '../types';
import { X, Save, Edit2 } from 'lucide-react';

interface ColumnEditPanelProps {
  table: Table | null;
  onClose: () => void;
  onUpdateColumn: (tableName: string, columnName: string, updates: Partial<Column>) => void;
}

const ColumnEditPanel: React.FC<ColumnEditPanelProps> = ({
  table,
  onClose,
  onUpdateColumn,
}) => {
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [editingDisplayName, setEditingDisplayName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  if (!table) return null;

  const handleSelectColumn = (column: Column) => {
    setSelectedColumn(column);
    setEditingDisplayName(column.displayName || '');
    setEditingDescription(column.description || '');
  };

  const handleSave = () => {
    if (!selectedColumn) return;

    onUpdateColumn(table.name, selectedColumn.name, {
      displayName: editingDisplayName.trim() || undefined,
      description: editingDescription.trim() || undefined,
    });

    setSelectedColumn(null);
    setEditingDisplayName('');
    setEditingDescription('');
  };

  const handleCancel = () => {
    setSelectedColumn(null);
    setEditingDisplayName('');
    setEditingDescription('');
  };

  return (
    <div className="absolute top-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg w-96 z-10 max-h-[80vh] flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{table.name}</h3>
          <p className="text-sm text-gray-600">カラム編集</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* カラムリスト */}
      {!selectedColumn ? (
        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-2">
            {table.columns.map((column) => (
              <button
                key={column.name}
                onClick={() => handleSelectColumn(column)}
                className="w-full text-left p-3 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{column.name}</span>
                      {column.isPrimaryKey && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">PK</span>
                      )}
                      {column.isForeignKey && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">FK</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{column.type}</div>
                    {column.displayName && (
                      <div className="text-sm text-blue-600 mt-1">
                        {column.displayName}
                      </div>
                    )}
                    {column.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {column.description}
                      </div>
                    )}
                  </div>
                  <Edit2 size={16} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // カラム編集フォーム
        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
            {/* カラム情報 */}
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600">カラム名</div>
              <div className="font-medium text-gray-800">{selectedColumn.name}</div>
              <div className="text-sm text-gray-600 mt-2">データ型</div>
              <div className="font-medium text-gray-800">{selectedColumn.type}</div>
            </div>

            {/* 日本語表示名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日本語表示名
              </label>
              <input
                type="text"
                value={editingDisplayName}
                onChange={(e) => setEditingDisplayName(e.target.value)}
                placeholder="例: ユーザーID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
                placeholder="このカラムの説明を入力してください"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* アクションボタン */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Save size={16} />
                保存
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnEditPanel;
