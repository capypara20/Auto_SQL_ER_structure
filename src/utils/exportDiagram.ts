import { toPng, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import { Table, Relationship } from '../types';

export async function exportDiagramAsPNG(elementId: string, filename: string = 'er-diagram.png', backgroundColor: string = '#f8fafc') {
  const element = document.querySelector(`#${elementId} .react-flow__viewport`) as HTMLElement;

  if (!element) {
    throw new Error('Diagram element not found');
  }

  try {
    const dataUrl = await toPng(element, {
      backgroundColor,
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

export async function exportDiagramAsSVG(elementId: string, filename: string = 'er-diagram.svg', backgroundColor: string = '#f8fafc') {
  const element = document.querySelector(`#${elementId} .react-flow__viewport`) as HTMLElement;

  if (!element) {
    throw new Error('Diagram element not found');
  }

  try {
    const dataUrl = await toSvg(element, {
      backgroundColor,
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

export async function exportDiagramAsPDF(elementId: string, filename: string = 'er-diagram.pdf', backgroundColor: string = '#f8fafc') {
  const element = document.querySelector(`#${elementId} .react-flow__viewport`) as HTMLElement;

  if (!element) {
    throw new Error('Diagram element not found');
  }

  try {
    // 高解像度の画像を生成
    const dataUrl = await toPng(element, {
      backgroundColor,
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

export function exportDiagramAsPlantUML(
  tables: Table[],
  relationships: Relationship[],
  filename: string = 'er-diagram.puml'
) {
  try {
    let puml = '@startuml\n';
    puml += '!define Table(name,desc) class name as "desc" << (T,#FFAAAA) >>\n';
    puml += '!define primary_key(x) <b>x</b>\n';
    puml += '!define foreign_key(x) <i>x</i>\n';
    puml += '!define column(x) x\n';
    puml += 'hide methods\n';
    puml += 'hide stereotypes\n\n';

    // テーブル定義
    tables.forEach((table) => {
      puml += `entity "${table.name}" {\n`;

      table.columns.forEach((column) => {
        let columnDef = '';

        // 主キー+外部キーの場合
        if (column.isPrimaryKey && column.isForeignKey) {
          columnDef = `  * <b><i>${column.name}</i></b> : ${column.type}`;
        }
        // 主キーのみ
        else if (column.isPrimaryKey) {
          columnDef = `  * <b>${column.name}</b> : ${column.type}`;
        }
        // 外部キーのみ
        else if (column.isForeignKey) {
          columnDef = `  + <i>${column.name}</i> : ${column.type}`;
        }
        // 通常のカラム
        else {
          columnDef = `  ${column.name} : ${column.type}`;
        }

        // NULL許可の表記
        if (!column.isNullable) {
          columnDef += ' NOT NULL';
        }

        puml += columnDef + '\n';
      });

      puml += '}\n\n';
    });

    // リレーション
    relationships.forEach((rel) => {
      // PlantUMLのリレーション表記: source }|--|| target
      // 1対多: }|--||  多対多: }|--|{
      let relationType = '';
      switch (rel.type) {
        case 'one-to-one':
          relationType = '||--||';
          break;
        case 'one-to-many':
          relationType = '}|--||';
          break;
        case 'many-to-many':
          relationType = '}|--|{';
          break;
        default:
          relationType = '--';
      }

      puml += `"${rel.source}" ${relationType} "${rel.target}" : ${rel.sourceColumn} -> ${rel.targetColumn}\n`;
    });

    puml += '\n@enduml\n';

    // ダウンロード
    const blob = new Blob([puml], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export PlantUML:', error);
    throw error;
  }
}

export function exportDiagramAsMermaid(
  tables: Table[],
  relationships: Relationship[],
  filename: string = 'er-diagram.mmd'
) {
  try {
    let mermaid = 'erDiagram\n';

    // テーブル定義
    tables.forEach((table) => {
      mermaid += `    ${table.name} {\n`;
      table.columns.forEach((column) => {
        const type = column.type.replace(/\(.*\)/, '');
        const pk = column.isPrimaryKey ? ' PK' : '';
        const fk = column.isForeignKey ? ' FK' : '';
        mermaid += `        ${type} ${column.name}${pk}${fk}\n`;
      });
      mermaid += `    }\n`;
    });

    // リレーション
    relationships.forEach((rel) => {
      mermaid += `    ${rel.source} ||--o{ ${rel.target} : "${rel.sourceColumn} -> ${rel.targetColumn}"\n`;
    });

    // ダウンロード
    const blob = new Blob([mermaid], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export Mermaid:', error);
    throw error;
  }
}

export function exportDiagramAsMarkdown(
  tables: Table[],
  _relationships: Relationship[], // 将来の拡張用に保持
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

    // SQL定義の再構築
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
