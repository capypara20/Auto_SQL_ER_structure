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
import RelationshipEdge from './RelationshipEdge';
import EdgeEditPanel from './EdgeEditPanel';
import ColumnEditPanel from './ColumnEditPanel';
import { Table, Relationship, DiagramStyle, Column } from '../types';

interface ERDiagramProps {
  tables: Table[];
  relationships: Relationship[];
  style: DiagramStyle;
  onUpdateColumn: (tableName: string, columnName: string, updates: Partial<Column>) => void;
}

const nodeTypes = {
  tableNode: TableNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

const ERDiagram: React.FC<ERDiagramProps> = ({ tables, relationships, style, onUpdateColumn }) => {
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
    return relationships.map((rel) => {
      // カーディナリティの決定
      let sourceCardinality = '1';
      let targetCardinality = 'N';

      if (rel.type === 'one-to-one') {
        sourceCardinality = '1';
        targetCardinality = '1';
      } else if (rel.type === 'one-to-many') {
        sourceCardinality = '1';
        targetCardinality = 'N';
      } else if (rel.type === 'many-to-many') {
        sourceCardinality = 'M';
        targetCardinality = 'N';
      }

      return {
        id: rel.id,
        source: rel.source,
        target: rel.target,
        sourceHandle: `${rel.source}-${rel.sourceColumn}-right`,
        targetHandle: `${rel.target}-${rel.targetColumn}-left`,
        type: 'relationship',
        animated: style.edgeAnimated,
        style: { stroke: style.relationshipColor, strokeWidth: style.relationshipWidth },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.relationshipColor,
        },
        data: {
          sourceCardinality,
          targetCardinality,
        },
        label: `${rel.sourceColumn} → ${rel.targetColumn}`,
        labelStyle: {
          fill: style.tableBodyText,
          fontSize: style.fontSize - 2,
          fontFamily: style.fontFamily,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      };
    });
  }, [relationships, style]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}-${Date.now()}`,
        type: 'relationship', // カスタムエッジを使用
        animated: style.edgeAnimated,
        style: { stroke: style.relationshipColor, strokeWidth: style.relationshipWidth },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.relationshipColor,
        },
        data: {
          sourceCardinality: '1',
          targetCardinality: 'N',
          pathType: 'default',
        },
        label: 'カスタム接続',
        labelStyle: {
          fill: style.tableBodyText,
          fontSize: style.fontSize - 2,
          fontFamily: style.fontFamily,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      };
      setEdges((eds) => addEdge(newEdge as any, eds));
    },
    [setEdges, style]
  );

  // エッジをクリックしたときの処理
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedTable(null); // エッジ選択時はテーブル選択を解除
  }, []);

  // ノード（テーブル）をクリックしたときの処理
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const table = tables.find((t) => t.name === node.id);
    if (table) {
      setSelectedTable(table);
      setSelectedEdge(null); // テーブル選択時はエッジ選択を解除
    }
  }, [tables]);

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

  // 初回レンダリング時またはテーブルが新規追加/削除されたときのみノードを再構築
  React.useEffect(() => {
    setNodes((currentNodes) => {
      // 現在のノードが空の場合（初回）、または数が違う場合は再構築
      if (currentNodes.length === 0 || currentNodes.length !== tables.length) {
        return initialNodes;
      }

      // それ以外の場合は位置を保持してデータのみ更新
      const existingNodesMap = new Map(currentNodes.map(node => [node.id, node]));

      return tables.map((table) => {
        const existingNode = existingNodesMap.get(table.name);
        if (existingNode) {
          return {
            ...existingNode,
            data: { table, style },
          };
        }
        // 新しいテーブルが追加された場合（通常はここには来ない）
        const index = tables.indexOf(table);
        return {
          id: table.name,
          type: 'tableNode',
          position: {
            x: (index % 3) * 350 + 50,
            y: Math.floor(index / 3) * 300 + 50,
          },
          data: { table, style },
        };
      });
    });
  }, [tables, style, initialNodes, setNodes]);

  // relationshipsが変更されたらエッジを再構築
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
        // typeは変更しない（relationshipエッジを保持）
        // pathTypeをdata内で管理
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
            return nodeData?.style?.tableHeaderBg || style.tableHeaderBg;
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

      {/* カラム編集パネル */}
      <ColumnEditPanel
        table={selectedTable}
        onClose={() => setSelectedTable(null)}
        onUpdateColumn={onUpdateColumn}
      />
    </div>
  );
};

export default ERDiagram;
