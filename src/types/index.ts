export interface Column {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  foreignKeyRef?: {
    table: string;
    column: string;
  };
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  sourceColumn: string;
  targetColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export type EdgeType = 'default' | 'straight' | 'step' | 'smoothstep' | 'simplebezier';

export interface DiagramStyle {
  backgroundColor: string;
  tableBorderColor: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  tableBodyBg: string;
  tableBodyText: string;
  primaryKeyColor: string;
  foreignKeyColor: string;
  relationshipColor: string;
  relationshipWidth: number;
  edgeType: EdgeType;
  edgeAnimated: boolean;
  fontSize: number;
  fontFamily: string;
  borderRadius: number;
  borderWidth: number;
}

export const defaultStyle: DiagramStyle = {
  backgroundColor: '#f8fafc',
  tableBorderColor: '#cbd5e1',
  tableHeaderBg: '#3b82f6',
  tableHeaderText: '#ffffff',
  tableBodyBg: '#ffffff',
  tableBodyText: '#1e293b',
  primaryKeyColor: '#fbbf24',
  foreignKeyColor: '#8b5cf6',
  relationshipColor: '#64748b',
  relationshipWidth: 2,
  edgeType: 'smoothstep',
  edgeAnimated: true,
  fontSize: 14,
  fontFamily: 'ui-monospace, monospace',
  borderRadius: 8,
  borderWidth: 2,
};
