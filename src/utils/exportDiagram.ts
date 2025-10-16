import { toPng, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import { Table, Relationship } from '../types';

export async function exportDiagramAsPNG(elementId: string, filename: string = 'er-diagram.png') {
  const element = document.querySelector(`#${elementId} .react-flow__viewport`) as HTMLElement;

  if (!element) {
    throw new Error('Diagram element not found');
  }

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1,
      pixelRatio: 2,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw error;
  }
}

export async function exportDiagramAsSVG(elementId: string, filename: string = 'er-diagram.svg') {
  const element = document.querySelector(`#${elementId} .react-flow__viewport`) as HTMLElement;

  if (!element) {
    throw new Error('Diagram element not found');
  }

  try {
    const dataUrl = await toSvg(element, {
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export SVG:', error);
    throw error;
  }
}

export async function exportDiagramAsPDF(elementId: string, filename: string = 'er-diagram.pdf') {
  const element = document.querySelector(`#${elementId} .react-flow__viewport`) as HTMLElement;

  if (!element) {
    throw new Error('Diagram element not found');
  }

  try {
    // 高解像度の画像を生成
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1,
      pixelRatio: 3,
    });

    // 画像のサイズを取得
    const img = new Image();
    img.src = dataUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // PDFのサイズを計算（A4横向きまたは画像サイズに合わせる）
    const imgWidth = img.width;
    const imgHeight = img.height;
    const ratio = imgWidth / imgHeight;

    // A4サイズ（横向き）: 297mm x 210mm
    let pdfWidth = 297;
    let pdfHeight = 210;

    // 画像の比率に応じてPDFサイズを調整
    if (ratio > pdfWidth / pdfHeight) {
      // 横長の画像
      pdfHeight = pdfWidth / ratio;
    } else {
      // 縦長の画像
      pdfWidth = pdfHeight * ratio;
    }

    // PDFを作成
    const pdf = new jsPDF({
      orientation: ratio > 1 ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    // 画像をPDFに追加
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // PDFをダウンロード
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
}

export function exportDiagramAsMarkdown(
  tables: Table[],
  relationships: Relationship[],
  filename: string = 'er-diagram.md'
) {
  try {
    let markdown = '# ER図 - データベーススキーマ\n\n';
    markdown += `生成日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
    markdown += '---\n\n';

    // テーブル一覧
    markdown += '## テーブル一覧\n\n';
    tables.forEach((table) => {
      markdown += `### ${table.name}\n\n`;
      markdown += '| カラム名 | データ型 | 主キー | 外部キー | NULL許可 | 参照先 |\n';
      markdown += '|----------|----------|--------|----------|----------|--------|\n';

      table.columns.forEach((column) => {
        const pk = column.isPrimaryKey ? '✓' : '';
        const fk = column.isForeignKey ? '✓' : '';
        const nullable = column.isNullable ? '✓' : '';
        const ref = column.foreignKeyRef
          ? `${column.foreignKeyRef.table}(${column.foreignKeyRef.column})`
          : '';

        markdown += `| ${column.name} | ${column.type} | ${pk} | ${fk} | ${nullable} | ${ref} |\n`;
      });

      markdown += '\n';
    });

    // リレーションシップ
    if (relationships.length > 0) {
      markdown += '## リレーションシップ\n\n';
      markdown += '```mermaid\n';
      markdown += 'erDiagram\n';

      // テーブル定義
      tables.forEach((table) => {
        markdown += `    ${table.name} {\n`;
        table.columns.forEach((column) => {
          const type = column.type.replace(/\(.*\)/, '');
          const pk = column.isPrimaryKey ? ' PK' : '';
          const fk = column.isForeignKey ? ' FK' : '';
          markdown += `        ${type} ${column.name}${pk}${fk}\n`;
        });
        markdown += `    }\n`;
      });

      // リレーション
      relationships.forEach((rel) => {
        markdown += `    ${rel.source} ||--o{ ${rel.target} : "${rel.sourceColumn} -> ${rel.targetColumn}"\n`;
      });

      markdown += '```\n\n';

      // リレーションシップの詳細
      markdown += '### リレーションシップの詳細\n\n';
      markdown += '| ソーステーブル | ソースカラム | ターゲットテーブル | ターゲットカラム | タイプ |\n';
      markdown += '|----------------|--------------|-------------------|-----------------|--------|\n';

      relationships.forEach((rel) => {
        markdown += `| ${rel.source} | ${rel.sourceColumn} | ${rel.target} | ${rel.targetColumn} | ${rel.type} |\n`;
      });

      markdown += '\n';
    }

    // SQL定義
    markdown += '## SQL定義の再構築\n\n';
    markdown += '```sql\n';
    tables.forEach((table) => {
      markdown += `CREATE TABLE ${table.name} (\n`;

      const columnDefs = table.columns.map((column) => {
        let def = `  ${column.name} ${column.type}`;
        if (!column.isNullable) def += ' NOT NULL';
        if (column.isPrimaryKey) def += ' PRIMARY KEY';
        return def;
      });

      const fkDefs = table.columns
        .filter((col) => col.isForeignKey && col.foreignKeyRef)
        .map((col) => {
          return `  FOREIGN KEY (${col.name}) REFERENCES ${col.foreignKeyRef!.table}(${col.foreignKeyRef!.column})`;
        });

      markdown += [...columnDefs, ...fkDefs].join(',\n');
      markdown += '\n);\n\n';
    });
    markdown += '```\n';

    // ダウンロード
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export Markdown:', error);
    throw error;
  }
}
