import React, { useState, useCallback } from 'react';
import ERDiagram from './components/ERDiagram';
import StylePanel from './components/StylePanel';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import { useFileUpload } from './hooks/useFileUpload';
import { useDiagramExport } from './hooks/useDiagramExport';
import { Table, Relationship, DiagramStyle, defaultStyle } from './types';
import { DIAGRAM_CONTAINER_ID } from './constants/diagram';

function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [style, setStyle] = useState<DiagramStyle>(defaultStyle);
  const [showStylePanel, setShowStylePanel] = useState(true);

  // カスタムフック
  const { handleFileUpload: uploadFile } = useFileUpload();
  const { handleExportPNG, handleExportSVG, handleExportPDF, handleExportMarkdown } =
    useDiagramExport({
      backgroundColor: style.backgroundColor,
      tables,
      relationships,
    });

  // ファイルアップロード処理
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      uploadFile(event, (parsedTables, parsedRelationships) => {
        setTables(parsedTables);
        setRelationships(parsedRelationships);
      });
    },
    [uploadFile]
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
      />

      {/* メインコンテンツ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ER図表示エリア */}
        <div className="flex-1 relative">
          {tables.length === 0 ? (
            <EmptyState />
          ) : (
            <div id={DIAGRAM_CONTAINER_ID} className="w-full h-full">
              <ERDiagram tables={tables} relationships={relationships} style={style} />
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
