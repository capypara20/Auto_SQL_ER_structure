import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TableNode from './TableNode';
import EdgeEditPanel from './EdgeEditPanel';
import { Table, Relationship, DiagramStyle } from '../types';

interface ERDiagramProps {
  tables: Table[];
  relationships: Relationship[];
  style: DiagramStyle;
}

const nodeTypes = {
  tableNode: TableNode,
};

const ERDiagram: React.FC<ERDiagramProps> = ({ tables, relationships, style }) => {
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
      type: style.edgeType,
      animated: style.edgeAnimated,
      style: { stroke: style.relationshipColor, strokeWidth: style.relationshipWidth },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: style.relationshipColor,
      },
      label: `${rel.sourceColumn} → ${rel.targetColumn}`,
      labelStyle: {
        fill: style.tableBodyText,
        fontSize: style.fontSize - 2,
        fontFamily: style.fontFamily,
      },
      labelBgStyle: {
        fill: style.backgroundColor,
        fillOpacity: 0.8,
      },
    }));
  }, [relationships, style]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}-${Date.now()}`,
        type: style.edgeType,
        animated: style.edgeAnimated,
        style: { stroke: style.relationshipColor, strokeWidth: style.relationshipWidth },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.relationshipColor,
        },
        label: 'カスタム接続',
        labelStyle: {
          fill: style.tableBodyText,
          fontSize: style.fontSize - 2,
          fontFamily: style.fontFamily,
        },
        labelBgStyle: {
          fill: style.backgroundColor,
          fillOpacity: 0.8,
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

  // tablesまたはrelationshipsが変更されたら完全に再構築
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

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
          fill: style.backgroundColor,
          fillOpacity: 0.8,
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
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        connectionMode="loose"
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
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
