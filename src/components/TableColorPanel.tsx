import React, { useState } from 'react';
import { Table, TableCustomStyle } from '../types';
import { X, Save, Palette, RotateCcw } from 'lucide-react';

interface TableColorPanelProps {
  table: Table | null;
  onClose: () => void;
  onUpdateTable: (tableName: string, updates: Partial<Table>) => void;
}

const TableColorPanel: React.FC<TableColorPanelProps> = ({
  table,
  onClose,
  onUpdateTable,
}) => {
  const [headerBg, setHeaderBg] = useState(table?.customStyle?.headerBg || '');
  const [headerText, setHeaderText] = useState(table?.customStyle?.headerText || '');
  const [bodyBg, setBodyBg] = useState(table?.customStyle?.bodyBg || '');
  const [bodyText, setBodyText] = useState(table?.customStyle?.bodyText || '');
  const [borderColor, setBorderColor] = useState(table?.customStyle?.borderColor || '');

  if (!table) return null;

  // テーブルが変更されたら状態をリセット
  React.useEffect(() => {
    setHeaderBg(table?.customStyle?.headerBg || '');
    setHeaderText(table?.customStyle?.headerText || '');
    setBodyBg(table?.customStyle?.bodyBg || '');
    setBodyText(table?.customStyle?.bodyText || '');
    setBorderColor(table?.customStyle?.borderColor || '');
  }, [table]);

  const handleSave = () => {
    const customStyle: TableCustomStyle = {};

    if (headerBg) customStyle.headerBg = headerBg;
    if (headerText) customStyle.headerText = headerText;
    if (bodyBg) customStyle.bodyBg = bodyBg;
    if (bodyText) customStyle.bodyText = bodyText;
    if (borderColor) customStyle.borderColor = borderColor;

    onUpdateTable(table.name, {
      customStyle: Object.keys(customStyle).length > 0 ? customStyle : undefined,
    });

    onClose();
  };

  const handleReset = () => {
    setHeaderBg('');
    setHeaderText('');
    setBodyBg('');
    setBodyText('');
    setBorderColor('');
  };

  return (
    <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg w-96 z-10 max-h-[80vh] flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Palette size={20} className="text-blue-500" />
          <div>
            <h3 className="font-bold text-lg text-gray-800">{table.name}</h3>
            <p className="text-sm text-gray-600">テーブル色設定</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* カラー設定 */}
      <div className="overflow-y-auto flex-1 p-4">
        <div className="space-y-4">
          {/* ヘッダー背景色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ヘッダー背景色
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={headerBg || '#3b82f6'}
                onChange={(e) => setHeaderBg(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={headerBg}
                onChange={(e) => setHeaderBg(e.target.value)}
                placeholder="グローバル設定を使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ヘッダーテキスト色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ヘッダーテキスト色
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={headerText || '#ffffff'}
                onChange={(e) => setHeaderText(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="グローバル設定を使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 本体背景色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              本体背景色
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bodyBg || '#ffffff'}
                onChange={(e) => setBodyBg(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={bodyBg}
                onChange={(e) => setBodyBg(e.target.value)}
                placeholder="グローバル設定を使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 本体テキスト色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              本体テキスト色
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bodyText || '#1e293b'}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="グローバル設定を使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 枠線色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              枠線色
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={borderColor || '#cbd5e1'}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                placeholder="グローバル設定を使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* リセットボタン */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={16} />
            全てリセット（グローバル設定を使用）
          </button>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2 p-4 border-t bg-gray-50">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Save size={16} />
          保存
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default TableColorPanel;
