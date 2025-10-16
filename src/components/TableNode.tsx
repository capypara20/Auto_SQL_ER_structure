import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Table, DiagramStyle } from '../types';
import { Key, KeyRound } from 'lucide-react';

interface TableNodeProps {
  data: {
    table: Table;
    style: DiagramStyle;
  };
}

const TableNode: React.FC<TableNodeProps> = ({ data }) => {
  const { table, style } = data;

  return (
    <div
      className="shadow-lg"
      style={{
        backgroundColor: style.tableBodyBg,
        borderRadius: `${style.borderRadius}px`,
        border: `${style.borderWidth}px solid ${style.tableBorderColor}`,
        minWidth: '250px',
        fontFamily: style.fontFamily,
        fontSize: `${style.fontSize}px`,
      }}
    >
      {/* テーブルヘッダー */}
      <div
        className="px-4 py-2 font-bold text-center"
        style={{
          backgroundColor: style.tableHeaderBg,
          color: style.tableHeaderText,
          borderTopLeftRadius: `${style.borderRadius - style.borderWidth}px`,
          borderTopRightRadius: `${style.borderRadius - style.borderWidth}px`,
        }}
      >
        {table.name}
      </div>

      {/* カラム一覧 */}
      <div className="divide-y divide-gray-200">
        {table.columns.map((column, index) => (
          <div
            key={index}
            className="px-4 py-2 flex items-center justify-between"
            style={{
              color: style.tableBodyText,
              backgroundColor: style.tableBodyBg,
            }}
          >
            <div className="flex items-center gap-2 flex-1">
              {column.isPrimaryKey && (
                <Key
                  size={16}
                  style={{ color: style.primaryKeyColor }}
                  strokeWidth={2.5}
                />
              )}
              {column.isForeignKey && !column.isPrimaryKey && (
                <KeyRound
                  size={16}
                  style={{ color: style.foreignKeyColor }}
                  strokeWidth={2.5}
                />
              )}
              <span className={column.isPrimaryKey ? 'font-semibold' : ''}>
                {column.name}
              </span>
            </div>
            <span className="text-xs opacity-60 ml-2">{column.type}</span>
          </div>
        ))}
      </div>

      {/* React Flow用のハンドル */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: style.relationshipColor }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: style.relationshipColor }}
      />
    </div>
  );
};

export default memo(TableNode);
