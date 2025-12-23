import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  MarkerType,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TableNode from './TableNode';
import EdgeEditPanel from './EdgeEditPanel';
import DraggableEdge from './DraggableEdge';
import { Table, Relationship, DiagramStyle, Column } from '../types';

interface ERDiagramProps {
  tables: Table[];
  relationships: Relationship[];
  style: DiagramStyle;
  onUpdateColumn?: (tableName: string, columnName: string, updates: Partial<Column>) => void;
  onUpdateTableStyle?: (tableName: string, customStyle: Table['customStyle']) => void;
  onTableClick?: (table: Table) => void;
  onTableDoubleClick?: (table: Table) => void;
}

const nodeTypes = {
  tableNode: TableNode,
};

const edgeTypes = {
  draggable: DraggableEdge,
};

const ERDiagram: React.FC<ERDiagramProps> = ({ tables, relationships, style, onTableClick, onTableDoubleClick }) => {
  // テーブルをノードに変換
  const initialNodes: Node[] = useMemo(() => {
    return tables.map((table, index) => ({
      id: table.name,
      type: 'tableNode',
      position: {
        x: (index % 3) * 350 + 50,
        y: Math.floor(index / 3) * 300 + 50,
      },
      data: { table, style },
    }));
  }, [tables, style]);

  // リレーションシップをエッジに変換
  const initialEdges: Edge[] = useMemo(() => {
    return relationships.map((rel) => ({
      id: rel.id,
      source: rel.source,
      target: rel.target,
      sourceHandle: `${rel.source}-${rel.sourceColumn}-right`,
      targetHandle: `${rel.target}-${rel.targetColumn}-left`,
      type: 'draggable',
      animated: style.edgeAnimated,
      style: { stroke: style.relationshipColor, strokeWidth: style.relationshipWidth },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: style.relationshipColor,
      },
      label: `${rel.sourceColumn} → ${rel.targetColumn}`,
      data: {
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
    }));
  }, [relationships, style]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  // エッジラベルのドラッグイベントを処理
  React.useEffect(() => {
    const handleEdgeLabelDrag = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { edgeId, offsetX, offsetY } = customEvent.detail;

      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            return {
              ...edge,
              data: {
                ...edge.data,
                labelOffsetX: offsetX,
                labelOffsetY: offsetY,
              },
            };
          }
          return edge;
        })
      );
    };

    window.addEventListener('edgeLabelDrag', handleEdgeLabelDrag);
    return () => {
      window.removeEventListener('edgeLabelDrag', handleEdgeLabelDrag);
    };
  }, [setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}-${Date.now()}`,
        type: 'draggable',
        animated: style.edgeAnimated,
        style: { stroke: style.relationshipColor, strokeWidth: style.relationshipWidth },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.relationshipColor,
        },
        label: 'カスタム接続',
        data: {
          labelOffsetX: 0,
          labelOffsetY: 0,
        },
      };
      setEdges((eds) => addEdge(newEdge as any, eds));
    },
    [setEdges, style]
  );

  // エッジをクリックしたときの処理
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
  }, []);

  // ノード（テーブル）をダブルクリックしたときの処理（カラム編集 - 左サイドバー）
  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const table = tables.find((t) => t.name === node.id);
    if (table && onTableDoubleClick) {
      onTableDoubleClick(table);
      setSelectedEdge(null);
    }
  }, [tables, onTableDoubleClick]);

  // ノード（テーブル）をクリックしたときの処理（スタイル編集 - 右サイドバー）
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const table = tables.find((t) => t.name === node.id);
    if (table && onTableClick) {
      onTableClick(table);
      setSelectedEdge(null);
    }
  }, [tables, onTableClick]);

  // エッジの再接続（付け替え）処理
  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === oldEdge.id) {
          return {
            ...edge,
            source: newConnection.source || edge.source,
            target: newConnection.target || edge.target,
            sourceHandle: newConnection.sourceHandle || edge.sourceHandle,
            targetHandle: newConnection.targetHandle || edge.targetHandle,
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  // エッジの更新
  const handleUpdateEdge = useCallback((edgeId: string, updates: Partial<Edge>) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, ...updates };
        }
        return edge;
      })
    );
    // 選択中のエッジも更新
    setSelectedEdge((current) => {
      if (current?.id === edgeId) {
        return { ...current, ...updates };
      }
      return current;
    });
  }, [setEdges]);

  // エッジの削除
  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    setSelectedEdge(null);
  }, [setEdges]);

  // エッジの矢印反転
  const handleReverseEdge = useCallback((edgeId: string) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            source: edge.target,
            target: edge.source,
            sourceHandle: edge.targetHandle,
            targetHandle: edge.sourceHandle,
          };
        }
        return edge;
      })
    );
    // 選択中のエッジも更新
    setSelectedEdge((current) => {
      if (current?.id === edgeId) {
        return {
          ...current,
          source: current.target,
          target: current.source,
          sourceHandle: current.targetHandle,
          targetHandle: current.sourceHandle,
        };
      }
      return current;
    });
  }, [setEdges]);

  // tablesが変更されたらノードのデータを更新（位置は保持）
  React.useEffect(() => {
    setNodes((currentNodes) => {
      // 既存のノードIDのマップを作成
      const existingNodesMap = new Map(currentNodes.map(node => [node.id, node]));

      // 新しいテーブルリストに基づいてノードを更新
      const updatedNodes = tables.map((table, index) => {
        const existingNode = existingNodesMap.get(table.name);

        if (existingNode) {
          // 既存ノードがある場合は位置を保持してデータのみ更新
          return {
            ...existingNode,
            data: { table, style },
          };
        } else {
          // 新しいノードの場合は初期位置を設定
          return {
            id: table.name,
            type: 'tableNode',
            position: {
              x: (index % 3) * 350 + 50,
              y: Math.floor(index / 3) * 300 + 50,
            },
            data: { table, style },
          };
        }
      });

      return updatedNodes;
    });
  }, [tables, style, setNodes]);

  // relationshipsが変更されたらエッジを完全に再構築
  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // スタイルが変更されたらノードデータとエッジを更新
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, style },
      }))
    );

    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: style.edgeType,
        animated: style.edgeAnimated,
        style: { stroke: style.relationshipColor, strokeWidth: style.relationshipWidth },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.relationshipColor,
        },
        labelStyle: {
          fill: style.tableBodyText,
          fontSize: style.fontSize - 2,
          fontFamily: style.fontFamily,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      }))
    );
  }, [style, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: style.backgroundColor, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <MiniMap
          nodeColor={(node) => {
            const nodeData = node.data as any;
            const table = nodeData?.table as Table;
            // テーブル個別の色設定があればそれを使用、なければデフォルト
            return table?.customStyle?.headerBg || nodeData?.style?.tableHeaderBg || style.tableHeaderBg;
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>

      {/* エッジ編集パネル */}
      <EdgeEditPanel
        selectedEdge={selectedEdge}
        onUpdateEdge={handleUpdateEdge}
        onDeleteEdge={handleDeleteEdge}
        onReverseEdge={handleReverseEdge}
        onClose={() => setSelectedEdge(null)}
      />
    </div>
  );
};

export default ERDiagram;
