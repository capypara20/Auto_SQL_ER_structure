// ER図関連の定数定義

export const DIAGRAM_CONTAINER_ID = 'er-diagram-container';

export const DEFAULT_EXPORT_FILENAMES = {
  png: 'er-diagram.png',
  svg: 'er-diagram.svg',
  pdf: 'er-diagram.pdf',
  markdown: 'er-diagram.md',
} as const;

export const ERROR_MESSAGES = {
  fileUploadFailed: 'ファイルの読み込みに失敗しました。',
  sqlParseFailed: 'SQLファイルのパースに失敗しました。正しいCREATE TABLE文を含むファイルを選択してください。',
  exportPngFailed: 'PNG形式でのエクスポートに失敗しました。',
  exportSvgFailed: 'SVG形式でのエクスポートに失敗しました。',
  exportPdfFailed: 'PDF形式でのエクスポートに失敗しました。',
  exportMarkdownFailed: 'Markdown形式でのエクスポートに失敗しました。',
} as const;
