import { useCallback } from 'react';
import {
  exportDiagramAsPNG,
  exportDiagramAsSVG,
  exportDiagramAsPDF,
  exportDiagramAsMarkdown,
  exportDiagramAsMermaid,
  exportDiagramAsPlantUML,
} from '../utils/exportDiagram';
import { exportTableSchemaAsCSV, exportTableSchemaAsTSV } from '../utils/exportTableSchema';
import { Table, Relationship } from '../types';
import { DIAGRAM_CONTAINER_ID, DEFAULT_EXPORT_FILENAMES, ERROR_MESSAGES } from '../constants/diagram';

interface UseDiagramExportProps {
  backgroundColor: string;
  tables: Table[];
  relationships: Relationship[];
}

interface UseDiagramExportReturn {
  handleExportPNG: () => Promise<void>;
  handleExportSVG: () => Promise<void>;
  handleExportPDF: () => Promise<void>;
  handleExportMarkdown: () => void;
  handleExportMermaid: () => void;
  handleExportPlantUML: () => void;
  handleExportCSV: () => void;
  handleExportTSV: () => void;
}

export const useDiagramExport = ({
  backgroundColor,
  tables,
  relationships,
}: UseDiagramExportProps): UseDiagramExportReturn => {
  const handleExportPNG = useCallback(async () => {
    try {
      await exportDiagramAsPNG(
        DIAGRAM_CONTAINER_ID,
        DEFAULT_EXPORT_FILENAMES.png,
        backgroundColor
      );
    } catch (error) {
      alert(ERROR_MESSAGES.exportPngFailed);
    }
  }, [backgroundColor]);

  const handleExportSVG = useCallback(async () => {
    try {
      await exportDiagramAsSVG(
        DIAGRAM_CONTAINER_ID,
        DEFAULT_EXPORT_FILENAMES.svg,
        backgroundColor
      );
    } catch (error) {
      alert(ERROR_MESSAGES.exportSvgFailed);
    }
  }, [backgroundColor]);

  const handleExportPDF = useCallback(async () => {
    try {
      await exportDiagramAsPDF(
        DIAGRAM_CONTAINER_ID,
        DEFAULT_EXPORT_FILENAMES.pdf,
        backgroundColor
      );
    } catch (error) {
      alert(ERROR_MESSAGES.exportPdfFailed);
    }
  }, [backgroundColor]);

  const handleExportMarkdown = useCallback(() => {
    try {
      exportDiagramAsMarkdown(tables, relationships, DEFAULT_EXPORT_FILENAMES.markdown);
    } catch (error) {
      alert(ERROR_MESSAGES.exportMarkdownFailed);
    }
  }, [tables, relationships]);

  const handleExportMermaid = useCallback(() => {
    try {
      exportDiagramAsMermaid(tables, relationships, DEFAULT_EXPORT_FILENAMES.mermaid);
    } catch (error) {
      alert(ERROR_MESSAGES.exportMermaidFailed);
    }
  }, [tables, relationships]);

  const handleExportPlantUML = useCallback(() => {
    try {
      exportDiagramAsPlantUML(tables, relationships, DEFAULT_EXPORT_FILENAMES.plantuml);
    } catch (error) {
      alert(ERROR_MESSAGES.exportPlantUMLFailed);
    }
  }, [tables, relationships]);

  const handleExportCSV = useCallback(() => {
    try {
      exportTableSchemaAsCSV(tables, DEFAULT_EXPORT_FILENAMES.csv);
    } catch (error) {
      alert(ERROR_MESSAGES.exportCSVFailed);
    }
  }, [tables]);

  const handleExportTSV = useCallback(() => {
    try {
      exportTableSchemaAsTSV(tables, DEFAULT_EXPORT_FILENAMES.tsv);
    } catch (error) {
      alert(ERROR_MESSAGES.exportTSVFailed);
    }
  }, [tables]);

  return {
    handleExportPNG,
    handleExportSVG,
    handleExportPDF,
    handleExportMarkdown,
    handleExportMermaid,
    handleExportPlantUML,
    handleExportCSV,
    handleExportTSV,
  };
};
