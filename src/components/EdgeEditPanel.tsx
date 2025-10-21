import React from 'react';
import { Edge } from 'reactflow';
import { EdgeType } from '../types';
import { Trash2, ArrowLeftRight } from 'lucide-react';

interface EdgeEditPanelProps {
  selectedEdge: Edge | null;
  onUpdateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  onDeleteEdge: (edgeId: string) => void;
  onReverseEdge: (edgeId: string) => void;
  onClose: () => void;
}

const EdgeEditPanel: React.FC<EdgeEditPanelProps> = ({
  selectedEdge,
  onUpdateEdge,
  onDeleteEdge,
  onReverseEdge,
  onClose,
}) => {
  if (!selectedEdge) return null;

  const edgeColor = (selectedEdge.style as any)?.stroke || '#64748b';
  const edgeWidth = (selectedEdge.style as any)?.strokeWidth || 2;
  const strokeDasharray = (selectedEdge.style as any)?.strokeDasharray || '0';
  const edgeType = selectedEdge.type || 'default';
  const isAnimated = selectedEdge.animated || false;
  // ラベルのオフセット（ピクセル単位）
  const labelOffsetX = (selectedEdge.data as any)?.labelOffsetX ?? 0;
  const labelOffsetY = (selectedEdge.data as any)?.labelOffsetY ?? 0;

  return (
    <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 z-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">線の編集</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* ラベル編集 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">ラベル</label>
          <input
            type="text"
            value={(selectedEdge.label as string) || ''}
            onChange={(e) => {
              onUpdateEdge(selectedEdge.id, {
                label: e.target.value,
              });
            }}
            placeholder="接続のラベル"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* 色の変更 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">線の色</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={edgeColor}
              onChange={(e) => {
                onUpdateEdge(selectedEdge.id, {
                  style: { ...selectedEdge.style, stroke: e.target.value },
                  markerEnd: {
                    ...(selectedEdge.markerEnd as any),
                    color: e.target.value,
                  },
                });
              }}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={edgeColor}
              onChange={(e) => {
                onUpdateEdge(selectedEdge.id, {
                  style: { ...selectedEdge.style, stroke: e.target.value },
                  markerEnd: {
                    ...(selectedEdge.markerEnd as any),
                    color: e.target.value,
                  },
                });
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* 線の太さ */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            線の太さ: {edgeWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={edgeWidth}
            onChange={(e) => {
              onUpdateEdge(selectedEdge.id, {
                style: { ...selectedEdge.style, strokeWidth: Number(e.target.value) },
              });
            }}
            className="w-full"
          />
        </div>

        {/* 線のタイプ */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">線の形式</label>
          <select
            value={edgeType}
            onChange={(e) => {
              onUpdateEdge(selectedEdge.id, {
                type: e.target.value as EdgeType,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="default">デフォルト</option>
            <option value="straight">直線</option>
            <option value="step">階段</option>
            <option value="smoothstep">滑らかな階段</option>
            <option value="simplebezier">ベジェ曲線</option>
          </select>
        </div>

        {/* 線のスタイル（実線/破線/点線） */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">線のスタイル</label>
          <select
            value={strokeDasharray}
            onChange={(e) => {
              onUpdateEdge(selectedEdge.id, {
                style: { ...selectedEdge.style, strokeDasharray: e.target.value },
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="0">実線</option>
            <option value="5 5">破線</option>
            <option value="2 2">点線</option>
            <option value="10 5">長い破線</option>
            <option value="5 2 2 2">一点鎖線</option>
          </select>
        </div>

        {/* アニメーション */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="edge-animated"
            checked={isAnimated}
            onChange={(e) => {
              onUpdateEdge(selectedEdge.id, {
                animated: e.target.checked,
              });
            }}
            className="w-4 h-4"
          />
          <label htmlFor="edge-animated" className="text-sm font-medium text-gray-700">
            アニメーション
          </label>
        </div>

        {/* ラベル位置調整 */}
        <div className="space-y-2 border-t pt-3">
          <label className="block text-sm font-medium text-gray-700">
            ラベル位置調整
          </label>

          {/* 水平オフセット */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>水平オフセット: {labelOffsetX}px</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="5"
              value={labelOffsetX}
              onChange={(e) => {
                const newData = { ...(selectedEdge.data || {}), labelOffsetX: Number(e.target.value) };
                const transformValue = `translate(${Number(e.target.value)}px, ${labelOffsetY}px)`;
                onUpdateEdge(selectedEdge.id, {
                  data: newData,
                  labelStyle: {
                    ...selectedEdge.labelStyle,
                    transform: transformValue,
                  },
                  labelBgStyle: {
                    ...selectedEdge.labelBgStyle,
                    transform: transformValue,
                  },
                } as any);
              }}
              className="w-full"
            />
          </div>

          {/* 垂直オフセット */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>垂直オフセット: {labelOffsetY}px</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="5"
              value={labelOffsetY}
              onChange={(e) => {
                const newData = { ...(selectedEdge.data || {}), labelOffsetY: Number(e.target.value) };
                const transformValue = `translate(${labelOffsetX}px, ${Number(e.target.value)}px)`;
                onUpdateEdge(selectedEdge.id, {
                  data: newData,
                  labelStyle: {
                    ...selectedEdge.labelStyle,
                    transform: transformValue,
                  },
                  labelBgStyle: {
                    ...selectedEdge.labelBgStyle,
                    transform: transformValue,
                  },
                } as any);
              }}
              className="w-full"
            />
          </div>

          {/* リセットボタン */}
          <button
            onClick={() => {
              const newData = { ...(selectedEdge.data || {}), labelOffsetX: 0, labelOffsetY: 0 };
              onUpdateEdge(selectedEdge.id, {
                data: newData,
                labelStyle: {
                  ...selectedEdge.labelStyle,
                  transform: 'translate(0px, 0px)',
                },
                labelBgStyle: {
                  ...selectedEdge.labelBgStyle,
                  transform: 'translate(0px, 0px)',
                },
              } as any);
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            位置をリセット
          </button>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2 pt-2 border-t">
          <button
            onClick={() => onReverseEdge(selectedEdge.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <ArrowLeftRight size={16} />
            矢印反転
          </button>
          <button
            onClick={() => {
              onDeleteEdge(selectedEdge.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash2 size={16} />
            削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default EdgeEditPanel;
