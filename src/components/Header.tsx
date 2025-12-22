import React from 'react';
import { Upload, Download, Eye, EyeOff, FileText, FileCode, Table, FilePlus } from 'lucide-react';

interface HeaderProps {
  showStylePanel: boolean;
  hasTables: boolean;
  onToggleStylePanel: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, mode: 'new' | 'append') => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportPDF: () => void;
  onExportMarkdown: () => void;
  onExportMermaid: () => void;
  onExportPlantUML: () => void;
  onExportCSV: () => void;
  onExportTSV: () => void;
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
  onExportCSV,
  onExportTSV,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">SQL ER図ジェネレーター</h1>

          <div className="flex gap-3">
            {/* ファイルアップロード - 新規 */}
            <label className="cursor-pointer bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
              <Upload size={18} />
              <span>新規で開く</span>
              <input
                type="file"
                accept=".sql"
                onChange={(e) => onFileUpload(e, 'new')}
                className="hidden"
                multiple
              />
            </label>

            {/* ファイルアップロード - 追加 */}
            <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2">
              <FilePlus size={18} />
              <span>追加で開く</span>
              <input
                type="file"
                accept=".sql"
                onChange={(e) => onFileUpload(e, 'append')}
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
                <button
                  onClick={onExportCSV}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  <Table size={18} />
                  CSV
                </button>
                <button
                  onClick={onExportTSV}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2"
                >
                  <Table size={18} />
                  TSV
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
