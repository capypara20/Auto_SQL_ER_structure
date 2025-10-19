import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge
} from 'reactflow';

/**
 * カスタムエッジコンポーネント
 * カーディナリティ（1、N、M）を線の両端に表示
 * data.pathTypeに応じて線の形式を変更
 */
const RelationshipEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  label,
  labelStyle,
  labelBgStyle,
}) => {
  // data.pathTypeに基づいてパス計算関数を選択
  const pathType = data?.pathType || 'default';
  let edgePath: string;
  let labelX: number;
  let labelY: number;

  if (pathType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else if (pathType === 'step' || pathType === 'smoothstep') {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  } else {
    // default または simplebezier
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  // カーディナリティの取得（デフォルトは1対多）
  const sourceCardinality = data?.sourceCardinality || '1';
  const targetCardinality = data?.targetCardinality || 'N';

  // ソース側のラベル位置（線の始点近く）
  const sourceLabelX = sourceX + (targetX - sourceX) * 0.15;
  const sourceLabelY = sourceY + (targetY - sourceY) * 0.15;

  // ターゲット側のラベル位置（線の終点近く）
  const targetLabelX = sourceX + (targetX - sourceX) * 0.85;
  const targetLabelY = sourceY + (targetY - sourceY) * 0.85;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        {/* 中央のラベル（カラム名） */}
        {label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              ...(labelStyle as any),
              background: (labelBgStyle as any)?.fill || '#ffffff',
              opacity: (labelBgStyle as any)?.fillOpacity || 0.9,
              padding: '4px 8px',
              borderRadius: '4px',
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        )}

        {/* ソース側のカーディナリティ */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${sourceLabelX}px,${sourceLabelY}px)`,
            fontSize: 14,
            fontWeight: 'bold',
            pointerEvents: 'all',
            backgroundColor: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #94a3b8',
            color: '#475569',
          }}
          className="nodrag nopan"
        >
          {sourceCardinality}
        </div>

        {/* ターゲット側のカーディナリティ */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetLabelX}px,${targetLabelY}px)`,
            fontSize: 14,
            fontWeight: 'bold',
            pointerEvents: 'all',
            backgroundColor: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #94a3b8',
            color: '#475569',
          }}
          className="nodrag nopan"
        >
          {targetCardinality}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default RelationshipEdge;
