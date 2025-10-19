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
            className="px-4 py-2 flex items-center justify-between relative"
            style={{
              color: style.tableBodyText,
              backgroundColor: style.tableBodyBg,
            }}
          >
            {/* 各カラムの左側ハンドル（source & target の両方） */}
            <Handle
              type="source"
              position={Position.Left}
              id={`${table.name}-${column.name}-left`}
              isConnectable={true}
              style={{
                background: column.isPrimaryKey && column.isForeignKey
                  ? style.primaryForeignKeyColor
                  : column.isPrimaryKey
                    ? style.primaryKeyColor
                    : column.isForeignKey
                      ? style.foreignKeyColor
                      : style.relationshipColor,
                width: '10px',
                height: '10px',
                left: '-5px',
              }}
            />

            <div className="flex items-center gap-2 flex-1">
              {/* 主キー+外部キーの複合キー */}
              {column.isPrimaryKey && column.isForeignKey && (
                <Key
                  size={16}
                  style={{ color: style.primaryForeignKeyColor }}
                  strokeWidth={2.5}
                />
              )}
              {/* 主キーのみ */}
              {column.isPrimaryKey && !column.isForeignKey && (
                <Key
                  size={16}
                  style={{ color: style.primaryKeyColor }}
                  strokeWidth={2.5}
                />
              )}
              {/* 外部キーのみ */}
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

            {/* 各カラムの右側ハンドル（source & target の両方） */}
            <Handle
              type="source"
              position={Position.Right}
              id={`${table.name}-${column.name}-right`}
              isConnectable={true}
              style={{
                background: column.isPrimaryKey && column.isForeignKey
                  ? style.primaryForeignKeyColor
                  : column.isPrimaryKey
                    ? style.primaryKeyColor
                    : column.isForeignKey
                      ? style.foreignKeyColor
                      : style.relationshipColor,
                width: '10px',
                height: '10px',
                right: '-5px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TableNode);
