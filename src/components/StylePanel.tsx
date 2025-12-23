import React from 'react';
import { DiagramStyle, EdgeType } from '../types';
import { Palette, Type, GitBranch } from 'lucide-react';

interface StylePanelProps {
  style: DiagramStyle;
  onChange: (style: DiagramStyle) => void;
}

const StylePanel: React.FC<StylePanelProps> = ({ style, onChange }) => {
  const handleChange = (key: keyof DiagramStyle, value: string | number | boolean) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="bg-white w-96 overflow-y-auto p-3 space-y-3 flex-1">
      <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
        <Palette size={16} />
        スタイル設定
      </h2>

      {/* 背景色 */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">背景色</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={style.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="h-8 w-16 rounded cursor-pointer"
          />
          <input
            type="text"
            value={style.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* テーブルヘッダー */}
      <div className="space-y-3 border-t pt-3">
        <h3 className="font-semibold text-xs text-gray-700">テーブルヘッダー</h3>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">背景色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableHeaderBg}
              onChange={(e) => handleChange('tableHeaderBg', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableHeaderBg}
              onChange={(e) => handleChange('tableHeaderBg', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">文字色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableHeaderText}
              onChange={(e) => handleChange('tableHeaderText', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableHeaderText}
              onChange={(e) => handleChange('tableHeaderText', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* テーブルボディ */}
      <div className="space-y-3 border-t pt-3">
        <h3 className="font-semibold text-xs text-gray-700">テーブル本体</h3>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">背景色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableBodyBg}
              onChange={(e) => handleChange('tableBodyBg', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableBodyBg}
              onChange={(e) => handleChange('tableBodyBg', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">文字色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableBodyText}
              onChange={(e) => handleChange('tableBodyText', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableBodyText}
              onChange={(e) => handleChange('tableBodyText', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">枠線色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableBorderColor}
              onChange={(e) => handleChange('tableBorderColor', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableBorderColor}
              onChange={(e) => handleChange('tableBorderColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* キー色 */}
      <div className="space-y-3 border-t pt-3">
        <h3 className="font-semibold text-xs text-gray-700">キーの色</h3>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">主キー</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.primaryKeyColor}
              onChange={(e) => handleChange('primaryKeyColor', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.primaryKeyColor}
              onChange={(e) => handleChange('primaryKeyColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">外部キー</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.foreignKeyColor}
              onChange={(e) => handleChange('foreignKeyColor', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.foreignKeyColor}
              onChange={(e) => handleChange('foreignKeyColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">主キー+外部キー</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.primaryForeignKeyColor}
              onChange={(e) => handleChange('primaryForeignKeyColor', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.primaryForeignKeyColor}
              onChange={(e) => handleChange('primaryForeignKeyColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">リレーション線の色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.relationshipColor}
              onChange={(e) => handleChange('relationshipColor', e.target.value)}
              className="h-8 w-16 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.relationshipColor}
              onChange={(e) => handleChange('relationshipColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* リレーション線の設定 */}
      <div className="space-y-3 border-t pt-3">
        <h3 className="font-semibold text-xs text-gray-700 flex items-center gap-2">
          <GitBranch size={14} />
          リレーション線
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">線のタイプ</label>
          <select
            value={style.edgeType}
            onChange={(e) => handleChange('edgeType', e.target.value as EdgeType)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="smoothstep">スムーズステップ（滑らか）</option>
            <option value="straight">直線</option>
            <option value="step">ステップ（階段状）</option>
            <option value="simplebezier">シンプルベジェ曲線</option>
            <option value="default">デフォルト</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            線の太さ: {style.relationshipWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={style.relationshipWidth}
            onChange={(e) => handleChange('relationshipWidth', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="edgeAnimated"
            checked={style.edgeAnimated}
            onChange={(e) => handleChange('edgeAnimated', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded cursor-pointer"
          />
          <label htmlFor="edgeAnimated" className="text-xs font-medium text-gray-700 cursor-pointer">
            アニメーション効果
          </label>
        </div>
      </div>

      {/* フォント設定 */}
      <div className="space-y-3 border-t pt-3">
        <h3 className="font-semibold text-xs text-gray-700 flex items-center gap-2">
          <Type size={14} />
          フォント
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            フォントサイズ: {style.fontSize}px
          </label>
          <input
            type="range"
            min="10"
            max="20"
            value={style.fontSize}
            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">フォントファミリー</label>
          <select
            value={style.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ui-monospace, monospace">Monospace</option>
            <option value="ui-sans-serif, sans-serif">Sans-serif</option>
            <option value="ui-serif, serif">Serif</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="'Arial', sans-serif">Arial</option>
            <option value="'Helvetica', sans-serif">Helvetica</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Georgia', serif">Georgia</option>
            <option value="'Verdana', sans-serif">Verdana</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
            <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
            <option value="'Impact', sans-serif">Impact</option>
            <option value="'Consolas', monospace">Consolas</option>
            <option value="'Monaco', monospace">Monaco</option>
            <option value="'Lucida Console', monospace">Lucida Console</option>
            <option value="system-ui, sans-serif">System UI</option>
          </select>
        </div>
      </div>

      {/* 形状設定 */}
      <div className="space-y-3 border-t pt-3">
        <h3 className="font-semibold text-xs text-gray-700">形状</h3>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            角の丸み: {style.borderRadius}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={style.borderRadius}
            onChange={(e) => handleChange('borderRadius', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            枠線の太さ: {style.borderWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={style.borderWidth}
            onChange={(e) => handleChange('borderWidth', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default StylePanel;
