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
  const labelX = (selectedEdge as any).labelX ?? 0.5; // デフォルトは中央
  const labelY = (selectedEdge as any).labelY ?? 0.5;

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

        {/* ラベル位置調整（X軸） */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            ラベル位置（線に沿った位置）: {Math.round(labelX * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={labelX}
            onChange={(e) => {
              onUpdateEdge(selectedEdge.id, {
                labelX: Number(e.target.value),
              } as any);
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>始点</span>
            <span>中央</span>
            <span>終点</span>
          </div>
        </div>

        {/* ラベル位置調整（Y軸） */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            ラベルオフセット（線からの距離）: {Math.round((labelY - 0.5) * 100)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={labelY}
            onChange={(e) => {
              onUpdateEdge(selectedEdge.id, {
                labelY: Number(e.target.value),
              } as any);
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>上</span>
            <span>線上</span>
            <span>下</span>
          </div>
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
