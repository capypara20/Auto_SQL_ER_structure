import React, { useState, useCallback } from 'react';
import ERDiagram from './components/ERDiagram';
import StylePanel from './components/StylePanel';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import { useFileUpload } from './hooks/useFileUpload';
import { useDiagramExport } from './hooks/useDiagramExport';
import { Table, Relationship, DiagramStyle, defaultStyle, Column } from './types';
import { DIAGRAM_CONTAINER_ID } from './constants/diagram';

function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [style, setStyle] = useState<DiagramStyle>(defaultStyle);
  const [showStylePanel, setShowStylePanel] = useState(true);

  // カスタムフック
  const { handleFileUpload: uploadFile } = useFileUpload();
  const {
    handleExportPNG,
    handleExportSVG,
    handleExportPDF,
    handleExportMarkdown,
    handleExportMermaid,
    handleExportPlantUML,
    handleExportCSV,
    handleExportTSV,
  } = useDiagramExport({
    backgroundColor: style.backgroundColor,
    tables,
    relationships,
  });

  // ファイルアップロード処理
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, mode: 'new' | 'append') => {
      uploadFile(event, (parsedTables, parsedRelationships) => {
        if (mode === 'new') {
          // 新規モード: 既存のテーブルを置き換え
          setTables(parsedTables);
          setRelationships(parsedRelationships);
        } else {
          // 追加モード: 既存のテーブルに追加（重複チェック）
          setTables((prevTables) => {
            const existingTableNames = new Set(prevTables.map((t) => t.name));
            const newTables = parsedTables.filter((t) => !existingTableNames.has(t.name));
            return [...prevTables, ...newTables];
          });
          setRelationships((prevRelationships) => {
            // リレーションシップの重複チェック
            const existingRelKeys = new Set(
              prevRelationships.map(
                (r) => `${r.sourceTable}-${r.sourceColumn}-${r.targetTable}-${r.targetColumn}`
              )
            );
            const newRelationships = parsedRelationships.filter(
              (r) =>
                !existingRelKeys.has(
                  `${r.sourceTable}-${r.sourceColumn}-${r.targetTable}-${r.targetColumn}`
                )
            );
            return [...prevRelationships, ...newRelationships];
          });
        }
      });
    },
    [uploadFile]
  );

  // カラム更新処理
  const handleUpdateColumn = useCallback(
    (tableName: string, columnName: string, updates: Partial<Column>) => {
      setTables((prevTables) =>
        prevTables.map((table) => {
          if (table.name === tableName) {
            return {
              ...table,
              columns: table.columns.map((column) =>
                column.name === columnName ? { ...column, ...updates } : column
              ),
            };
          }
          return table;
        })
      );
    },
    []
  );

  // テーブルスタイル更新処理
  const handleUpdateTableStyle = useCallback(
    (tableName: string, customStyle: Table['customStyle']) => {
      setTables((prevTables) =>
        prevTables.map((table) => {
          if (table.name === tableName) {
            return {
              ...table,
              customStyle,
            };
          }
          return table;
        })
      );
    },
    []
  );

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
      <Header
        showStylePanel={showStylePanel}
        hasTables={tables.length > 0}
        onToggleStylePanel={() => setShowStylePanel(!showStylePanel)}
        onFileUpload={handleFileUpload}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
        onExportPDF={handleExportPDF}
        onExportMarkdown={handleExportMarkdown}
        onExportMermaid={handleExportMermaid}
        onExportPlantUML={handleExportPlantUML}
        onExportCSV={handleExportCSV}
        onExportTSV={handleExportTSV}
      />

      {/* メインコンテンツ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ER図表示エリア */}
        <div className="flex-1 relative">
          {tables.length === 0 ? (
            <EmptyState />
          ) : (
            <div id={DIAGRAM_CONTAINER_ID} className="w-full h-full">
              <ERDiagram
                tables={tables}
                relationships={relationships}
                style={style}
                onUpdateColumn={handleUpdateColumn}
                onUpdateTableStyle={handleUpdateTableStyle}
              />
            </div>
          )}
        </div>

        {/* スタイルパネル */}
        {showStylePanel && <StylePanel style={style} onChange={setStyle} />}
      </div>
    </div>
  );
}

export default App;
