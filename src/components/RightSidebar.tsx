import React from 'react';
import { Table, DiagramStyle } from '../types';
import TableStylePanel from './TableStylePanel';
import StylePanel from './StylePanel';

interface RightSidebarProps {
  selectedTable: Table | null;
  onCloseTable: () => void;
  onUpdateTableStyle: (tableName: string, customStyle: Table['customStyle']) => void;
  defaultStyle: DiagramStyle;
  showGlobalStyle: boolean;
  globalStyle: DiagramStyle;
  onChangeGlobalStyle: (style: DiagramStyle) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedTable,
  onCloseTable,
  onUpdateTableStyle,
  defaultStyle,
  showGlobalStyle,
  globalStyle,
  onChangeGlobalStyle,
}) => {
  // 何も表示するものがない場合はnullを返す
  if (!selectedTable && !showGlobalStyle) {
    return null;
  }

  return (
    <div className="flex flex-col bg-white border-l border-gray-200 overflow-hidden">
      {/* 個別テーブルスタイル設定 */}
      {selectedTable && (
        <TableStylePanel
          table={selectedTable}
          defaultStyle={defaultStyle}
          onClose={onCloseTable}
          onUpdateStyle={(customStyle) => {
            onUpdateTableStyle(selectedTable.name, customStyle);
          }}
        />
      )}

      {/* 全体スタイル設定 */}
      {showGlobalStyle && (
        <StylePanel style={globalStyle} onChange={onChangeGlobalStyle} />
      )}
    </div>
  );
};

export default RightSidebar;
