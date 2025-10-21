# SQL Test Files

このディレクトリには、SQL ER図ジェネレーターのテスト用SQLファイルが含まれています。

## ファイル一覧

### 基本テストケース（単一ファイル）

| ファイル名 | DBMS | 規模 | 説明 |
|-----------|------|------|------|
| `000_mysql_simple_blog.sql` | MySQL | 小 | シンプルなブログシステム（3テーブル） |
| `001_mysql_ecommerce.sql` | MySQL | 中 | ECサイトシステム（6テーブル） |
| `002_postgresql_university.sql` | PostgreSQL | 中 | 大学管理システム（6テーブル、SERIAL、CONSTRAINT使用） |
| `003_postgresql_hospital.sql` | PostgreSQL | 中 | 病院管理システム（7テーブル、多対多リレーション） |
| `004_sqlite_task_manager.sql` | SQLite | 中 | タスク管理システム（6テーブル、SQLite構文） |

### 大規模テストケース

| ファイル名 | DBMS | 規模 | 説明 |
|-----------|------|------|------|
| `005_mysql_large_social_network.sql` | MySQL | 大 | SNSシステム（24テーブル、複雑なリレーション） |
| `006_postgresql_large_banking.sql` | PostgreSQL | 大 | 銀行システム（15テーブル、金融取引） |

### 複数ファイルテスト

以下の3ファイルは同時にアップロードしてテストしてください：

| ファイル名 | 説明 |
|-----------|------|
| `007_multi_file_part1_users.sql` | ユーザー管理（3テーブル） |
| `008_multi_file_part2_products.sql` | 商品カタログ（3テーブル、part1参照） |
| `009_multi_file_part3_orders.sql` | 注文管理（3テーブル、part1とpart2参照） |

### エッジケーステスト

| ファイル名 | テスト内容 |
|-----------|----------|
| `010_edge_case_composite_keys.sql` | 複合主キー・複合外部キー |
| `011_edge_case_self_reference.sql` | 自己参照テーブル（再帰的リレーション） |
| `012_edge_case_backticks_schema.sql` | バッククォート、スキーマ名、特殊文字 |
| `013_edge_case_data_types.sql` | 様々なデータ型（MySQL、PostgreSQL） |
| `014_edge_case_constraints.sql` | 名前付き制約、CONSTRAINT構文 |
| `015_edge_case_minimal.sql` | 最小限のテーブル定義 |
| `016_edge_case_no_relationships.sql` | 外部キーなしの独立テーブル |
| `017_edge_case_circular_reference.sql` | 循環参照（A→B→C→A） |
| `018_mssql_syntax.sql` | Microsoft SQL Server構文 |
| `019_oracle_syntax.sql` | Oracle Database構文 |

## テスト項目

各ファイルで以下の機能をテストできます：

### パーサー機能
- ✅ CREATE TABLE構文の解析
- ✅ 主キー（PRIMARY KEY）の検出
- ✅ 外部キー（FOREIGN KEY）の検出
- ✅ 複合主キー・複合外部キーの検出
- ✅ 自己参照の検出
- ✅ バッククォート・スキーマ名の処理
- ✅ 様々なデータ型の処理
- ✅ CONSTRAINT構文の処理
- ✅ IF NOT EXISTSの処理

### ER図生成
- ✅ テーブルノードの生成
- ✅ リレーションシップエッジの生成
- ✅ 主キー・外部キーのアイコン表示
- ✅ 複雑なリレーションの可視化
- ✅ 多対多リレーションの表示
- ✅ 自己参照の矢印表示

### DBMS互換性
- ✅ MySQL
- ✅ PostgreSQL
- ✅ SQLite
- ✅ Microsoft SQL Server
- ✅ Oracle Database

## 使用方法

1. アプリケーションを起動: `npm run dev`
2. ブラウザで http://localhost:5173 を開く
3. テストしたいSQLファイルを選択してアップロード
4. ER図が正しく生成されることを確認

### 複数ファイルのテスト方法

複数ファイルを同時にアップロードする場合：
1. ファイル選択ダイアログで、Ctrl（Windows/Linux）またはCmd（Mac）を押しながら複数ファイルを選択
2. `007_multi_file_part1_users.sql`、`008_multi_file_part2_products.sql`、`009_multi_file_part3_orders.sql`を同時に選択
3. アップロードして、テーブル間のリレーションが正しく表示されることを確認

## 期待される動作

### 正常系
- すべてのテーブルがノードとして表示される
- 外部キーがエッジ（矢印）として表示される
- 主キーに金色の鍵アイコンが表示される
- 外部キーに紫色の鍵アイコンが表示される

### エラーケース
- パースエラーが発生した場合はコンソールにエラーメッセージが表示される
- サポートされていない構文は無視される

## トラブルシューティング

### パースエラーが発生する場合
- ブラウザのコンソールを確認
- SQLファイルの文字エンコーディングがUTF-8であることを確認
- CREATE TABLE構文が正しいことを確認

### リレーションが表示されない場合
- 外部キー制約が正しく記述されているか確認
- 参照先のテーブルが存在するか確認
- テーブル名・カラム名のスペルミスがないか確認
