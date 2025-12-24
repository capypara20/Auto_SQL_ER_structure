import React, { useState, useCallback } from 'react';
import ERDiagram from './components/ERDiagram';
import TableSQLSidebar from './components/TableSQLSidebar';
import RightSidebar from './components/RightSidebar';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import DebugConsole, { ConsoleMessage } from './components/DebugConsole';
import { useFileUpload } from './hooks/useFileUpload';
import { useDiagramExport } from './hooks/useDiagramExport';
import { Table, Relationship, DiagramStyle, defaultStyle, Column } from './types';
import { DIAGRAM_CONTAINER_ID } from './constants/diagram';

function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [style, setStyle] = useState<DiagramStyle>(defaultStyle);
  const [showStylePanel, setShowStylePanel] = useState(true);
  const [selectedTableForSQL, setSelectedTableForSQL] = useState<Table | null>(null);
  const [selectedTableForStyle, setSelectedTableForStyle] = useState<Table | null>(null);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);

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

  // コンソールにメッセージを追加
  const addConsoleMessage = useCallback((
    type: ConsoleMessage['type'],
    message: string,
    details?: string
  ) => {
    const newMessage: ConsoleMessage = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type,
      message,
      details,
    };
    setConsoleMessages((prev) => [...prev, newMessage]);
  }, []);

  // ファイルアップロード処理
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, mode: 'new' | 'append') => {
      try {
        addConsoleMessage('info', `ファイルアップロード開始 (モード: ${mode === 'new' ? '新規' : '追加'})`);

        uploadFile(
          event,
          (parsedTables, parsedRelationships) => {
            // パース結果の詳細をログ出力
            const tableDetails = parsedTables.map(t => {
              const pkCols = t.columns.filter(c => c.isPrimaryKey).map(c => c.name).join(', ');
              const fkCols = t.columns.filter(c => c.isForeignKey).map(c => c.name).join(', ');
              return `  - ${t.name} (${t.columns.length}カラム${pkCols ? `, PK: ${pkCols}` : ''}${fkCols ? `, FK: ${fkCols}` : ''})`;
            }).join('\n');

            const relationshipDetails = parsedRelationships.map(r =>
              `  - ${r.source}.${r.sourceColumn} → ${r.target}.${r.targetColumn}`
            ).join('\n');

            if (mode === 'new') {
              // 新規モード: 既存のテーブルを置き換え
              setTables(parsedTables);
              setRelationships(parsedRelationships);
              addConsoleMessage(
                'success',
                `SQLファイルのパース成功`,
                `テーブル数: ${parsedTables.length}\nリレーション数: ${parsedRelationships.length}\n\nテーブル:\n${tableDetails || '  (なし)'}\n\nリレーション:\n${relationshipDetails || '  (なし)'}`
              );

              // 警告: テーブルが0個の場合
              if (parsedTables.length === 0) {
                addConsoleMessage(
                  'warn',
                  'テーブルが検出されませんでした',
                  'SQLファイルにCREATE TABLE文が含まれているか確認してください。\nINSERT、ALTER、DROP文のみのファイルは解析できません。'
                );
              }
            } else {
              // 追加モード: 既存のテーブルに追加（重複チェック）
              setTables((prevTables) => {
                const existingTableNames = new Set(prevTables.map((t) => t.name));
                const newTables = parsedTables.filter((t) => !existingTableNames.has(t.name));
                const duplicateCount = parsedTables.length - newTables.length;

                if (duplicateCount > 0) {
                  addConsoleMessage(
                    'warn',
                    `${duplicateCount}個の重複テーブルをスキップしました`,
                    parsedTables.filter(t => existingTableNames.has(t.name))
                      .map(t => `  - ${t.name}`)
                      .join('\n')
                  );
                }

                return [...prevTables, ...newTables];
              });
              setRelationships((prevRelationships) => {
                // リレーションシップの重複チェック
                const existingRelKeys = new Set(
                  prevRelationships.map(
                    (r) => `${r.source}-${r.sourceColumn}-${r.target}-${r.targetColumn}`
                  )
                );
                const newRelationships = parsedRelationships.filter(
                  (r) =>
                    !existingRelKeys.has(
                      `${r.source}-${r.sourceColumn}-${r.target}-${r.targetColumn}`
                    )
                );

                addConsoleMessage(
                  'success',
                  `追加モードでパース成功`,
                  `新規テーブル: ${parsedTables.length}\n新規リレーション: ${newRelationships.length}\n\n新規テーブル:\n${tableDetails || '  (なし)'}\n\n新規リレーション:\n${relationshipDetails || '  (なし)'}`
                );

                if (parsedTables.length === 0) {
                  addConsoleMessage(
                    'warn',
                    '新しいテーブルが検出されませんでした'
                  );
                }

                return [...prevRelationships, ...newRelationships];
              });
            }
          },
          (error, details) => {
            // エラーコールバック
            addConsoleMessage('error', error, details);
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addConsoleMessage('error', 'ファイルアップロードエラー', errorMessage);
        console.error('File upload error:', error);
      }
    },
    [uploadFile, addConsoleMessage]
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
        {/* 左サイドバー - SQL定義・カラム編集パネル */}
        {selectedTableForSQL && (
          <TableSQLSidebar
            table={selectedTableForSQL}
            onClose={() => setSelectedTableForSQL(null)}
            onUpdateColumn={handleUpdateColumn}
          />
        )}

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
                onTableDoubleClick={setSelectedTableForSQL}
                onTableClick={setSelectedTableForStyle}
              />
            </div>
          )}
        </div>

        {/* 右サイドバー - 統合パネル */}
        <RightSidebar
          selectedTable={selectedTableForStyle}
          onCloseTable={() => setSelectedTableForStyle(null)}
          onUpdateTableStyle={handleUpdateTableStyle}
          defaultStyle={style}
          showGlobalStyle={showStylePanel}
          globalStyle={style}
          onChangeGlobalStyle={setStyle}
        />
      </div>

      {/* デバッグコンソール */}
      <DebugConsole
        messages={consoleMessages}
        onClear={() => setConsoleMessages([])}
      />
    </div>
  );
}

export default App;
