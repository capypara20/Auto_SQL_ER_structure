import React, { useState, useEffect } from 'react';
import { Table } from '../types';
import { X, Palette, RotateCcw } from 'lucide-react';

interface TableStylePanelProps {
  table: Table | null;
  onClose: () => void;
  onUpdateTableStyle: (tableName: string, customStyle: Table['customStyle']) => void;
}

const TableStylePanel: React.FC<TableStylePanelProps> = ({
  table,
  onClose,
  onUpdateTableStyle,
}) => {
  const [headerBg, setHeaderBg] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [bodyBg, setBodyBg] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [borderColor, setBorderColor] = useState('');

  useEffect(() => {
    if (table?.customStyle) {
      setHeaderBg(table.customStyle.headerBg || '');
      setHeaderText(table.customStyle.headerText || '');
      setBodyBg(table.customStyle.bodyBg || '');
      setBodyText(table.customStyle.bodyText || '');
      setBorderColor(table.customStyle.borderColor || '');
    } else {
      setHeaderBg('');
      setHeaderText('');
      setBodyBg('');
      setBodyText('');
      setBorderColor('');
    }
  }, [table]);

  if (!table) return null;

  // 色が変更されたらリアルタイムで反映
  const updateStyle = (updates: Partial<{ headerBg: string; headerText: string; bodyBg: string; bodyText: string; borderColor: string }>) => {
    const newHeaderBg = updates.headerBg !== undefined ? updates.headerBg : headerBg;
    const newHeaderText = updates.headerText !== undefined ? updates.headerText : headerText;
    const newBodyBg = updates.bodyBg !== undefined ? updates.bodyBg : bodyBg;
    const newBodyText = updates.bodyText !== undefined ? updates.bodyText : bodyText;
    const newBorderColor = updates.borderColor !== undefined ? updates.borderColor : borderColor;

    const customStyle: Table['customStyle'] = {};
    if (newHeaderBg) customStyle.headerBg = newHeaderBg;
    if (newHeaderText) customStyle.headerText = newHeaderText;
    if (newBodyBg) customStyle.bodyBg = newBodyBg;
    if (newBodyText) customStyle.bodyText = newBodyText;
    if (newBorderColor) customStyle.borderColor = newBorderColor;

    onUpdateTableStyle(
      table.name,
      Object.keys(customStyle).length > 0 ? customStyle : undefined
    );
  };

  const handleReset = () => {
    setHeaderBg('');
    setHeaderText('');
    setBodyBg('');
    setBodyText('');
    setBorderColor('');
    onUpdateTableStyle(table.name, undefined);
  };

  return (
    <div className="absolute top-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg w-96 z-10 max-h-[80vh] flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Palette size={20} className="text-blue-500" />
          <div>
            <h3 className="font-bold text-lg text-gray-800">{table.name}</h3>
            <p className="text-sm text-gray-600">テーブルの色設定</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* 色設定フォーム */}
      <div className="overflow-y-auto flex-1 p-4">
        <div className="space-y-4">
          {/* ヘッダー背景色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ヘッダー背景色
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={headerBg || '#3b82f6'}
                onChange={(e) => {
                  setHeaderBg(e.target.value);
                  updateStyle({ headerBg: e.target.value });
                }}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={headerBg}
                onChange={(e) => {
                  setHeaderBg(e.target.value);
                  updateStyle({ headerBg: e.target.value });
                }}
                placeholder="デフォルトを使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ヘッダー文字色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ヘッダー文字色
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={headerText || '#ffffff'}
                onChange={(e) => {
                  setHeaderText(e.target.value);
                  updateStyle({ headerText: e.target.value });
                }}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={headerText}
                onChange={(e) => {
                  setHeaderText(e.target.value);
                  updateStyle({ headerText: e.target.value });
                }}
                placeholder="デフォルトを使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ボディ背景色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ボディ背景色
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={bodyBg || '#ffffff'}
                onChange={(e) => {
                  setBodyBg(e.target.value);
                  updateStyle({ bodyBg: e.target.value });
                }}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={bodyBg}
                onChange={(e) => {
                  setBodyBg(e.target.value);
                  updateStyle({ bodyBg: e.target.value });
                }}
                placeholder="デフォルトを使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ボディ文字色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ボディ文字色
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={bodyText || '#1e293b'}
                onChange={(e) => {
                  setBodyText(e.target.value);
                  updateStyle({ bodyText: e.target.value });
                }}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={bodyText}
                onChange={(e) => {
                  setBodyText(e.target.value);
                  updateStyle({ bodyText: e.target.value });
                }}
                placeholder="デフォルトを使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 枠線色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              枠線色
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={borderColor || '#cbd5e1'}
                onChange={(e) => {
                  setBorderColor(e.target.value);
                  updateStyle({ borderColor: e.target.value });
                }}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => {
                  setBorderColor(e.target.value);
                  updateStyle({ borderColor: e.target.value });
                }}
                placeholder="デフォルトを使用"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* リセットボタン */}
          <div className="pt-4 border-t">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={16} />
              デフォルトに戻す
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableStylePanel;
