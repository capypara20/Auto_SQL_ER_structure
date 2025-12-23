import React, { useState, useRef } from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath, getSimpleBezierPath } from 'reactflow';

const DraggableEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
}) => {
  // エッジタイプをdataから取得（デフォルトはsimplebezier）
  const edgeType = data?.edgeType || 'simplebezier';

  // エッジタイプに応じて適切なパス計算関数を使用
  let edgePath: string;
  let labelX: number;
  let labelY: number;

  switch (edgeType) {
    case 'straight':
      [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
      break;
    case 'step':
    case 'smoothstep':
      [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
      break;
    case 'simplebezier':
      [edgePath, labelX, labelY] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
      break;
    default:
      // デフォルトはベジェ曲線
      [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
  }

  // ラベルのオフセット（ピクセル単位）
  const offsetX = data?.labelOffsetX || 0;
  const offsetY = data?.labelOffsetY || 0;

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // カスタムイベントを発火してオフセットを更新
    const event = new CustomEvent('edgeLabelDrag', {
      detail: {
        edgeId: id,
        offsetX: offsetX + deltaX,
        offsetY: offsetY + deltaY,
      },
    });
    window.dispatchEvent(event);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, offsetX, offsetY]);

  // スタイルから個別のプロパティを抽出（エクスポート時の互換性のため）
  const stroke = (style as any)?.stroke || '#999';
  const strokeWidth = (style as any)?.strokeWidth || 2;
  const strokeDasharray = (style as any)?.strokeDasharray || '0';

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd as string}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        fill="none"
      />
      {label && (
        <g>
          {/* ラベル背景（白い矩形） */}
          <rect
            x={labelX + offsetX - 30}
            y={labelY + offsetY - 10}
            width={60}
            height={20}
            fill="white"
            stroke="#ccc"
            strokeWidth={1}
            rx={3}
            style={{
              pointerEvents: 'all',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
          />
          {/* ラベルテキスト */}
          <text
            x={labelX + offsetX}
            y={labelY + offsetY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="#333"
            style={{
              pointerEvents: 'all',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
};

export default DraggableEdge;
