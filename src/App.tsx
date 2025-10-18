import React, { useState, useCallback } from 'react';
import ERDiagram from './components/ERDiagram';
import StylePanel from './components/StylePanel';
import { parseSQLToTables } from './utils/sqlParser';
import { exportDiagramAsPNG, exportDiagramAsSVG, exportDiagramAsPDF, exportDiagramAsMarkdown } from './utils/exportDiagram';
import { Table, Relationship, DiagramStyle, defaultStyle } from './types';
import { Upload, Download, Eye, EyeOff, FileText, FileCode } from 'lucide-react';

function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [style, setStyle] = useState<DiagramStyle>(defaultStyle);
  const [showStylePanel, setShowStylePanel] = useState(true);
  const [sqlContent, setSqlContent] = useState('');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const target = event.target;

    if (!files || files.length === 0) return;

    const fileContents: string[] = [];
    let filesProcessed = 0;

    // 複数ファイルを読み込む
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        fileContents[index] = content;
        filesProcessed++;

        // 全ファイルの読み込みが完了したらパース
        if (filesProcessed === files.length) {
          const combinedContent = fileContents.join('\n\n');
          setSqlContent(combinedContent);

          try {
            const { tables: parsedTables, relationships: parsedRelationships } = parseSQLToTables(combinedContent);
            setTables(parsedTables);
            setRelationships(parsedRelationships);
          } catch (error) {
            console.error('Failed to parse SQL:', error);
            alert('SQLファイルのパースに失敗しました。正しいCREATE TABLE文を含むファイルを選択してください。');
          }

          // inputをリセットして同じファイルを再度選択可能にする
          setTimeout(() => {
            target.value = '';
          }, 100);
        }
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        alert('ファイルの読み込みに失敗しました。');
      };
      reader.readAsText(file);
    });
  }, []);

  const handleExportPNG = useCallback(async () => {
    try {
      await exportDiagramAsPNG('er-diagram-container', 'er-diagram.png');
    } catch (error) {
      alert('PNG形式でのエクスポートに失敗しました。');
    }
  }, []);

  const handleExportSVG = useCallback(async () => {
    try {
      await exportDiagramAsSVG('er-diagram-container', 'er-diagram.svg');
    } catch (error) {
      alert('SVG形式でのエクスポートに失敗しました。');
    }
  }, []);

  const handleExportPDF = useCallback(async () => {
    try {
      await exportDiagramAsPDF('er-diagram-container', 'er-diagram.pdf');
    } catch (error) {
      alert('PDF形式でのエクスポートに失敗しました。');
    }
  }, []);

  const handleExportMarkdown = useCallback(() => {
    try {
      exportDiagramAsMarkdown(tables, relationships, 'er-diagram.md');
    } catch (error) {
      alert('Markdown形式でのエクスポートに失敗しました。');
    }
  }, [tables, relationships]);

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">SQL ER図ジェネレーター</h1>

            <div className="flex gap-3">
              {/* ファイルアップロード */}
              <label className="cursor-pointer bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                <Upload size={18} />
                <span>SQLファイルを開く</span>
                <input
                  type="file"
                  accept=".sql"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
              </label>

              {/* エクスポート */}
              {tables.length > 0 && (
                <>
                  <button
                    onClick={handleExportPNG}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Download size={18} />
                    PNG
                  </button>
                  <button
                    onClick={handleExportSVG}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <Download size={18} />
                    SVG
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <FileText size={18} />
                    PDF
                  </button>
                  <button
                    onClick={handleExportMarkdown}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <FileCode size={18} />
                    MD
                  </button>
                </>
              )}

              {/* スタイルパネル表示切替 */}
              <button
                onClick={() => setShowStylePanel(!showStylePanel)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                {showStylePanel ? <EyeOff size={18} /> : <Eye size={18} />}
                {showStylePanel ? 'パネルを隠す' : 'パネルを表示'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ER図表示エリア */}
        <div className="flex-1 relative">
          {tables.length === 0 ? (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <Upload size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-xl text-gray-600 mb-2">SQLファイルをアップロードしてください</p>
                <p className="text-sm text-gray-500">CREATE TABLE文を含む.sqlファイルに対応しています</p>
              </div>
            </div>
          ) : (
            <div id="er-diagram-container" className="w-full h-full">
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
