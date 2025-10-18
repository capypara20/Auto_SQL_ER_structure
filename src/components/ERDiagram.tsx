import React, { useCallback, useMemo } from 'react';
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

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
    <div style={{ width: '100%', height: '100%', backgroundColor: style.backgroundColor }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ERDiagram;
