# SQL ER図ジェネレーター

SQLファイルをアップロードするだけで、きれいなER図を自動生成できるWebアプリケーションです。

## 特徴

- SQLファイル（CREATE TABLE文）からER図を自動生成
- インタラクティブな図の表示（ドラッグ&ドロップ、ズーム対応）
- デザインの完全カスタマイズ
  - 色（背景、テーブル、ヘッダー、キーなど）
  - フォント（サイズ、ファミリー）
  - 形状（角の丸み、枠線の太さ）
- 図のエクスポート（PNG、SVG形式）
- 主キー・外部キーの視覚的な表示
- リレーションシップの自動検出と描画

## セットアップ

### 必要な環境

- Node.js 16以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 使い方

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで http://localhost:5173 にアクセス
3. 「SQLファイルを開く」ボタンをクリックしてSQLファイルをアップロード
4. ER図が自動的に生成されます
5. 右側のパネルでデザインをカスタマイズ
6. 「PNG」または「SVG」ボタンで図をエクスポート

## サンプルファイル

`public/examples/sample.sql` にサンプルSQLファイルが含まれています。
ブログシステムのデータベーススキーマの例です。

## 対応しているSQL構文

- CREATE TABLE文
- PRIMARY KEY制約（テーブルレベル、カラムレベル）
- FOREIGN KEY制約（テーブルレベル、カラムレベル）
- REFERENCES句
- 基本的なデータ型

## 技術スタック

- React 18
- TypeScript
- Vite
- React Flow（図の描画）
- Tailwind CSS（スタイリング）
- html-to-image（エクスポート機能）

## ライセンス

MIT
