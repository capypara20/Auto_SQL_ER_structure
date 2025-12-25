# 変更履歴 / Changelog

このファイルはプロジェクトの主要な変更を記録します。

## [2025-12-26] - SQL Server対応: ブラケット記法のサポート

### 追加
- **SQL Serverブラケット記法のサポート**: `[TableName]`、`[ColumnName]` 形式に対応
  - CREATE TABLEでのブラケット記法
  - ALTER TABLEでのブラケット記法
  - CONSTRAINT定義でのブラケット記法
  - スキーマ名付きテーブル `[schema].[table]` に対応
- **SQL Server特有のデータ型を追加**:
  - NVARCHAR, NCHAR (Unicode文字列型)
  - BIGINT, BIT (数値型)
  - DATETIME (日付時刻型)
  - VARBINARY, BINARY (バイナリ型)
  - IDENTITY (自動採番)
- **SQL Server特有の構文対応**:
  - PRIMARY KEY CLUSTERED
  - ON DELETE/UPDATE CASCADE
- **テストサンプルファイルの追加**:
  - test-sqlserver.sql - SQL Server形式の包括的なサンプル
  - test-mysql.sql - MySQL形式のサンプル
  - test-postgresql.sql - PostgreSQL形式のサンプル
  - test-mixed.sql - 混合記法のサンプル

### 変更
- SQLパーサーの正規表現を拡張してブラケット記法に対応
- 既存のバッククォート記法（MySQL）と標準SQL記法（PostgreSQL）との互換性を維持

### 技術詳細
- 修正ファイル: `src/utils/sqlParser.ts`
- 対応記法: `` `table` ``（MySQL）、`[table]`（SQL Server）、標準SQL（PostgreSQL）
- 複数記法の混在にも対応

---

## [Unreleased] - 今後実装予定

### 予定している機能
1. **PlantUML形式のエクスポート** - ER図をPlantUML形式でダウンロード
2. **リレーション表記の改善** - 1対多、多対多などのカーディナリティ表示
3. **Mermaid形式の独立エクスポート** - Mermaid ER図の単独ダウンロード
4. **MDエクスポート形式の簡素化** - テーブル一覧とSQL定義のみに限定
5. **テーブルスキーマ表の生成** - 日本語説明付きのドキュメント生成機能

---

## [2025-12-24] - UI/UX改善: サイドバー統合とナビゲーション改善

### 追加
- **左サイドバー（TableSQLSidebar）**: テーブルダブルクリックでSQL定義とカラム編集を表示
  - SQL CREATE文の自動生成と表示
  - カラム編集機能の統合
  - コピー機能付き
- **右サイドバー（RightSidebar）**: 2つのパネルを統合
  - テーブル個別スタイル編集パネル（テーブルクリック時）
  - グローバルスタイル編集パネル（常時表示可能）
  - タブ切り替えで効率的なナビゲーション

### 変更
- **テーブル操作の整理**:
  - シングルクリック → 右サイドバーでテーブル個別スタイル編集
  - ダブルクリック → 左サイドバーでSQL定義・カラム編集
- **モーダルからサイドバーへ移行**:
  - `TableSQLModal.tsx` を削除
  - `ColumnEditPanel.tsx` の機能を `TableSQLSidebar` に統合
  - `TableStylePanel.tsx` の機能を `RightSidebar` に統合
- **StylePanelの最適化**:
  - コンパクトなデザイン（幅380px → 96、padding/margin削減）
  - フォントサイズを小型化（text-sm → text-xs）
  - 入力要素のサイズを縮小
- **ERDiagramコンポーネントの簡素化**:
  - パネル表示ロジックを親コンポーネント（App.tsx）に移動
  - `onTableClick` / `onTableDoubleClick` コールバックを追加
  - コンポーネントの責務を明確化

### 削除
- `TableSQLModal.tsx`: サイドバー方式に変更
- `ColumnEditPanel.tsx`: TableSQLSidebarに統合
- `TableStylePanel.tsx`: RightSidebarに統合
- TableNodeの「SQL定義」ボタン: ダブルクリック操作に変更

### 修正
- **リレーションシップの重複チェック修正**:
  - `sourceTable`/`targetTable` → `source`/`target` プロパティ名を修正
  - Relationship型定義に合わせて正しく動作するように修正
- **sqlParser.ts**: プロパティ名を統一（source/target）

### UI/UX改善
- より直感的な操作: クリックで色編集、ダブルクリックで構造編集
- モーダルによる視界遮断を削減
- 左右サイドバーでワークスペースを最大化
- コンパクトで情報密度の高いパネルデザイン

---

## [2025-10-19] - 線の形式変更、ミニマップ追加、モジュール化

### 追加
- **線の形式変更機能**: 実線/破線/点線/一点鎖線など5種類から選択可能
- **ミニマップ**: ReactFlowのミニマップコンポーネントを追加（ズーム・パン可能）
- **モジュール化**:
  - `constants/diagram.ts`: 定数とエラーメッセージの一元管理
  - `hooks/useFileUpload.ts`: ファイルアップロード処理のカスタムフック
  - `hooks/useDiagramExport.ts`: エクスポート処理のカスタムフック
  - `components/Header.tsx`: ヘッダーコンポーネント
  - `components/EmptyState.tsx`: 空状態表示コンポーネント

### 変更
- App.tsxを189行から73行に削減（約61%削減）
- コードの保守性と再利用性を向上

---

## [2025-10-19] - カラムレベルコネクタと線の編集機能

### 追加
- **カラムレベルのコネクタ**: 各テーブルのすべてのカラムに接続点を追加
- **ハンドルの色分け**:
  - 主キー+外部キー: 緑色
  - 主キーのみ: 金色
  - 外部キーのみ: 紫色
  - 通常のカラム: グレー
- **EdgeEditPanel**: 線の編集用パネルを新規作成
  - 色、太さ、形式（直線/階段/ベジェなど）の変更
  - アニメーション ON/OFF
  - ラベル編集
  - 矢印反転
  - 線の削除

### 修正
- **複合主キー・複合外部キーのサポート**: `PRIMARY KEY (col1, col2)` 形式に対応
- 正規表現を改善してカンマ区切りの複数カラムを検出

---

## [2025-10-19] - 初期機能とバグ修正

### 追加
- **機能1: 複数SQLファイルの読み込み**: 同じファイルを複数回開けるように改善
- **機能6: 外部キー表示の修正**: 紫色の鍵アイコンが正しく表示されるように修正

### 修正
- **App.tsx**: ファイル読み込み後にinput要素をリセット
- **ERDiagram.tsx**: initialNodes/initialEdgesが変更されたら完全に再構築
- **sqlParser.ts**: 外部キーフラグを後処理で更新するロジック追加

---

## [2025-10-19] - プロジェクト開始

### 追加
- 初期プロジェクトセットアップ
- SQL CREATE TABLE文からER図を自動生成
- ReactFlow を使用したインタラクティブなダイアグラム
- PNG/SVG/PDF/Markdown形式でのエクスポート機能
- スタイルカスタマイズパネル

---

## 今後の改善案 / Ideas for Future Improvements

### ユーザーからのフィードバック

#### 優先度: 高
1. **PlantUML形式のエクスポート** - 既存のドキュメントとの統合のため
2. **リレーション表記の改善** - ER図の可読性向上
3. **テーブルスキーマ表** - ドキュメント作成の効率化

#### 優先度: 中
4. **Mermaid形式の独立エクスポート** - Markdown内での利用
5. **MDエクスポート形式の改善** - 必要な情報のみに絞る

#### 検討中
- カラムのコメント機能（日本語説明の追加）
- テーブル間の依存関係の可視化
- SQLインポート時のバリデーション強化
- undo/redo 機能
- ダークモード対応

---

## 技術的な改善履歴

### パフォーマンス
- App.tsxのコード量を61%削減（v2025-10-19）

### コード品質
- TypeScript型エラーをすべて解決
- ESLintの未使用変数警告を解消
- カスタムフックによるロジック分離

### アーキテクチャ
- モジュール化により関心の分離を実現
- 定数の一元管理で保守性向上
- コンポーネントの責務を明確化
