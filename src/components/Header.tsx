import React from 'react';
import { Upload, Download, Eye, EyeOff, FileText, FileCode } from 'lucide-react';

interface HeaderProps {
  showStylePanel: boolean;
  hasTables: boolean;
  onToggleStylePanel: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportPDF: () => void;
  onExportMarkdown: () => void;
  onExportMermaid: () => void;
  onExportPlantUML: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showStylePanel,
  hasTables,
  onToggleStylePanel,
  onFileUpload,
  onExportPNG,
  onExportSVG,
  onExportPDF,
  onExportMarkdown,
  onExportMermaid,
  onExportPlantUML,
}) => {
  return (
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
                onChange={onFileUpload}
                className="hidden"
                multiple
              />
            </label>

            {/* エクスポート */}
            {hasTables && (
              <>
                <button
                  onClick={onExportPNG}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  PNG
                </button>
                <button
                  onClick={onExportSVG}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  SVG
                </button>
                <button
                  onClick={onExportPDF}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <FileText size={18} />
                  PDF
                </button>
                <button
                  onClick={onExportMarkdown}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <FileCode size={18} />
                  MD
                </button>
                <button
                  onClick={onExportMermaid}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center gap-2"
                >
                  <FileCode size={18} />
                  Mermaid
                </button>
                <button
                  onClick={onExportPlantUML}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors flex items-center gap-2"
                >
                  <FileCode size={18} />
                  PlantUML
                </button>
              </>
            )}

            {/* スタイルパネル表示切替 */}
            <button
              onClick={onToggleStylePanel}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              {showStylePanel ? <EyeOff size={18} /> : <Eye size={18} />}
              {showStylePanel ? 'パネルを隠す' : 'パネルを表示'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
