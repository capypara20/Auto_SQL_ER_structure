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

  // テーブル個別の色設定がある場合はそれを優先、なければデフォルトのスタイルを使用
  const headerBg = table.customStyle?.headerBg || style.tableHeaderBg;
  const headerText = table.customStyle?.headerText || style.tableHeaderText;
  const bodyBg = table.customStyle?.bodyBg || style.tableBodyBg;
  const bodyText = table.customStyle?.bodyText || style.tableBodyText;
  const borderColor = table.customStyle?.borderColor || style.tableBorderColor;

  return (
    <>
      <div
        className="shadow-lg"
        style={{
          backgroundColor: bodyBg,
          borderRadius: `${style.borderRadius}px`,
          border: `${style.borderWidth}px solid ${borderColor}`,
          minWidth: '320px',
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
        }}
      >
        {/* テーブルヘッダー */}
        <div
          className="px-5 py-3 font-bold text-center"
          style={{
            backgroundColor: headerBg,
            color: headerText,
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
              className="px-5 py-3 flex items-center justify-between relative"
              style={{
                color: bodyText,
                backgroundColor: bodyBg,
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
              <span className="text-sm opacity-70 ml-3 whitespace-nowrap">{column.type}</span>

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
    </>
  );
};

export default memo(TableNode);
