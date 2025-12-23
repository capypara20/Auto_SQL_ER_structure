import React, { useState, useRef } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';

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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

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
  const stroke = (style as any)?.stroke;
  const strokeWidth = (style as any)?.strokeWidth;
  const strokeDasharray = (style as any)?.strokeDasharray;

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
      />
      <EdgeLabelRenderer>
        {label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX + offsetX}px, ${labelY + offsetY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
          >
            <div
              style={{
                background: 'white',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid #ccc',
              }}
            >
              {label}
            </div>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default DraggableEdge;
