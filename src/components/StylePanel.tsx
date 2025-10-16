import React from 'react';
import { DiagramStyle, EdgeType } from '../types';
import { Palette, Type, GitBranch } from 'lucide-react';

interface StylePanelProps {
  style: DiagramStyle;
  onChange: (style: DiagramStyle) => void;
}

const StylePanel: React.FC<StylePanelProps> = ({ style, onChange }) => {
  const handleChange = (key: keyof DiagramStyle, value: string | number) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="bg-white border-l border-gray-200 w-80 overflow-y-auto p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Palette size={24} />
        スタイル設定
      </h2>

      {/* 背景色 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">背景色</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={style.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="h-10 w-20 rounded cursor-pointer"
          />
          <input
            type="text"
            value={style.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* テーブルヘッダー */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-gray-700">テーブルヘッダー</h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">背景色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableHeaderBg}
              onChange={(e) => handleChange('tableHeaderBg', e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableHeaderBg}
              onChange={(e) => handleChange('tableHeaderBg', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">文字色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableHeaderText}
              onChange={(e) => handleChange('tableHeaderText', e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableHeaderText}
              onChange={(e) => handleChange('tableHeaderText', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* テーブルボディ */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-gray-700">テーブル本体</h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">背景色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableBodyBg}
              onChange={(e) => handleChange('tableBodyBg', e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableBodyBg}
              onChange={(e) => handleChange('tableBodyBg', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">文字色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableBodyText}
              onChange={(e) => handleChange('tableBodyText', e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableBodyText}
              onChange={(e) => handleChange('tableBodyText', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">枠線色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.tableBorderColor}
              onChange={(e) => handleChange('tableBorderColor', e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.tableBorderColor}
              onChange={(e) => handleChange('tableBorderColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* キー色 */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-gray-700">キーの色</h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">主キー</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.primaryKeyColor}
              onChange={(e) => handleChange('primaryKeyColor', e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.primaryKeyColor}
              onChange={(e) => handleChange('primaryKeyColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">外部キー</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.foreignKeyColor}
              onChange={(e) => handleChange('foreignKeyColor', e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.foreignKeyColor}
              onChange={(e) => handleChange('foreignKeyColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">リレーション線の色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={style.relationshipColor}
              onChange={(e) => handleChange('relationshipColor', e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.relationshipColor}
              onChange={(e) => handleChange('relationshipColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* リレーション線の設定 */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <GitBranch size={18} />
          リレーション線
        </h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">線のタイプ</label>
          <select
            value={style.edgeType}
            onChange={(e) => handleChange('edgeType', e.target.value as EdgeType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="smoothstep">スムーズステップ（滑らか）</option>
            <option value="straight">直線</option>
            <option value="step">ステップ（階段状）</option>
            <option value="simplebezier">ベジェ曲線</option>
            <option value="default">デフォルト</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="edgeAnimated" className="text-sm font-medium text-gray-700 cursor-pointer">
            アニメーション効果
          </label>
        </div>
      </div>

      {/* フォント設定 */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Type size={18} />
          フォント
        </h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">フォントファミリー</label>
          <select
            value={style.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="ui-monospace, monospace">Monospace</option>
            <option value="ui-sans-serif, sans-serif">Sans-serif</option>
            <option value="ui-serif, serif">Serif</option>
            <option value="'Courier New', monospace">Courier New</option>
          </select>
        </div>
      </div>

      {/* 形状設定 */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-gray-700">形状</h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
