-- ファイル名: 20250901000000_create_tables.sql
-- 更新日: 2025-09-13
-- 投資信託銘柄一覧テーブル
-- fund_code = 	銘柄コード:主キー = tbl_funds_master_pkey
-- fund_name = 	銘柄名
-- company = 	運用会社
CREATE TABLE public.tbl_funds_master (
	fund_code 	TEXT NOT NULL,
	fund_name 	TEXT NOT NULL,
	company 	TEXT NOT NULL,
	CONSTRAINT tbl_funds_master_pkey PRIMARY KEY (fund_code)
);

-- 個別銘柄一覧テーブル
-- 作成日: 2025-09-13
-- stock_code = 銘柄コード:主キー = tbl_stock_master_pkey
-- stock_name = 銘柄名
-- market = 	市場区分
-- code_33 = 	33業種コード
-- name_33 = 	33業種名
-- code_17 = 	17業種コード
-- name_17 = 	17業種名
CREATE TABLE public.tbl_stock_master (
	stock_code 	TEXT NOT NULL,
	stock_name	TEXT NOT NULL,
	market 		TEXT NOT NULL,
	code_33 	TEXT NOT NULL,
	name_33 	TEXT NOT NULL,
	code_17 	TEXT NOT NULL,
	name_17 	TEXT NOT NULL,
	CONSTRAINT tbl_stock_master_pkey PRIMARY KEY (stock_code)
);

-- 証券口座一覧テーブル
-- 作成日: 2025-09-13
-- account_id は 'S001' 形式
-- account_id = 	口座ID:主キー = tbl_trading_account_pkey
-- account_name = 	口座名
-- sec_company = 	証券会社
-- created_at = 	作成日時
CREATE TABLE public.tbl_trading_account (
	account_id      TEXT NOT NULL,
	account_name    TEXT NOT NULL,
	sec_company     TEXT NOT NULL,
	created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	CONSTRAINT tbl_trading_account_pkey PRIMARY KEY (account_id)
);

-- 銀行口座一覧テーブル
-- 作成日: 2025-09-13
-- account_id は 'B001' のような形式
-- account_id = 	口座ID:主キー = tbl_bank_account_pkey
-- account_name =	口座名
-- bank_name = 		銀行名
-- created_at = 	作成日時
CREATE TABLE public.tbl_bank_account (
	account_id      TEXT NOT NULL,
	account_name    TEXT NOT NULL,
	bank_name       TEXT NOT NULL,
	created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	CONSTRAINT tbl_bank_account_pkey PRIMARY KEY (account_id)
);

-- 銀行取引履歴テーブル
-- 作成日: 2025-09-13
-- id	 		取引ID:主キー			tbl_bank_txn_pkey
-- account_id	口座ID:主キー 外部キー 	tbl_bank_txn_account_id_fkey
-- txn_date  	取引日
-- txn_type  	取引種別 (例: 出金, 入金, 振替)
-- amount 		金額 (単位: 円)
-- description  取引内容
-- memo 		メモ (任意)
-- created_at  	作成日時
CREATE TABLE public.tbl_bank_txn (
	id		    SERIAL NOT NULL,
	account_id  TEXT NOT NULL,
	txn_date    DATE NOT NULL,
	txn_type    TEXT NOT NULL,
	amount      INTEGER NOT NULL,
	description TEXT NOT NULL,
	memo        TEXT,
	created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	CONSTRAINT tbl_bank_txn_pkey PRIMARY KEY (id),
	CONSTRAINT tbl_bank_txn_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.tbl_bank_account(account_id) ON DELETE RESTRICT
);

-- 個別銘柄取引テーブル
-- 作成日: 2025-09-13
-- id  			ID:主キー				tbl_stock_txn_pkey
-- account_id  	口座ID:外部キー 		tbl_stock_txn_account_id_fkey
-- stock_code  	銘柄コード:外部キー		tbl_stock_txn_stock_code_fkey
-- txn_date 	取引日
-- txn_type 	取引種別 (例: 買付, 売却, 配当)
-- txn_category	取引区分 (例: 特定口座, 一般口座, NISA)
-- amount		株数量
-- price		取引価格 (単位: 円/株)
-- memo			メモ (任意)
-- created_at	作成日時
CREATE TABLE public.tbl_stock_txn (
	id          	SERIAL NOT NULL,
	account_id      TEXT NOT NULL,
	stock_code      TEXT NOT NULL,
	txn_date        DATE NOT NULL,
	txn_type        TEXT NOT NULL,
	txn_category    TEXT NOT NULL,
	amount          INTEGER NOT NULL,
	price           REAL NOT NULL,
	memo            TEXT,
	created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	CONSTRAINT tbl_stock_txn_pkey PRIMARY KEY (id),
	CONSTRAINT tbl_stock_txn_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.tbl_trading_account(account_id) ON DELETE RESTRICT,
	CONSTRAINT tbl_stock_txn_stock_code_fkey FOREIGN KEY (stock_code) REFERENCES public.tbl_stock_master(stock_code) ON DELETE RESTRICT
);

-- 投資信託取引履歴テーブル
-- 作成日: 2025-09-13
-- id  			取引ID:主キー 			tbl_fund_txn_pkey
-- account_id  	口座ID:外部キー 		tbl_fund_txn_account_id_fkey
-- fund_code  	銘柄コード:外部キー		tbl_fund_txn_fund_code_fkey
-- txn_date  	取引日
-- txn_type 	取引種別 (例: 買付, 解約, 分配金)
-- txn_category 取引区分 (例: 特定口座, 一般口座, NISA)
-- unit	 		取引口数
-- price	  	取引価格 (単位: 円)
-- memo 		メモ (任意)
-- created_at  	作成日時
CREATE TABLE public.tbl_fund_txn (
	id		        SERIAL NOT NULL,
	account_id      TEXT NOT NULL,
	fund_code       TEXT NOT NULL,
	txn_date        DATE NOT NULL,
	txn_type        TEXT NOT NULL,
	txn_category    TEXT NOT NULL,
	unit            INTEGER NOT NULL,
	price           REAL NOT NULL,
	memo            TEXT,
	created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	CONSTRAINT tbl_fund_txn_pkey PRIMARY KEY (id),
	CONSTRAINT tbl_fund_txn_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.tbl_trading_account(account_id) ON DELETE RESTRICT,
	CONSTRAINT tbl_fund_txn_fund_code_fkey FOREIGN KEY (fund_code) REFERENCES public.tbl_funds_master(fund_code) ON DELETE RESTRICT
);

-- 銀行口座スケジュール取引テーブル
-- 作成日: 2025-09-13
-- id 			スケジュールID:主キー		tbl_bank_schedule_txn_pkey
-- account_id  	口座ID:外部キー 			tbl_bank_schedule_txn_account_id_fkey
-- txn_date  	取引予定日
-- txn_type  	取引種別 (例: 出金, 入金, 振替)
-- amount 		金額 (単位: 円)
-- description  取引内容
-- memo 		メモ (任意)
-- exec_exists  実行済みフラグ
-- input_memo   入力メモ (任意)
-- created_at  	作成日時
CREATE TABLE public.tbl_bank_schedule_txn (
	id          SERIAL NOT NULL,
	account_id  TEXT NOT NULL,
	txn_date    DATE NOT NULL,
	txn_type    TEXT NOT NULL,
	amount      INTEGER NOT NULL,
	description TEXT NOT NULL,
	memo        TEXT,
	exec_exists BOOLEAN NOT NULL,
	input_memo  TEXT,
	created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	CONSTRAINT tbl_bank_schedule_txn_pkey PRIMARY KEY (id),
	CONSTRAINT tbl_bank_schedule_txn_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.tbl_bank_account(account_id) ON DELETE RESTRICT
);

-- 振替管理テーブル
-- 作成日: 2025-09-13
-- transfer_id 		振替ID:主キー			tbl_transfers_pkey
-- from_account_id 	振替元口座ID:疑似外部キー
-- from_type  		振替元口座種別 (例: bank, sec)
-- to_account_id 	振替先口座ID:疑似外部キー
-- to_type  		振替先口座種別 (例: bank, sec)
-- exec_date  		振替実行日
-- amount 			振替金額 (単位: 円)
-- memo 			メモ (任意)
-- created_at  		作成日時
-- transfer_id は BIGSERIAL (SERIALの64bit版) を使用。
CREATE TABLE public.tbl_transfers (
	transfer_id     BIGSERIAL NOT NULL,
	from_account_id TEXT NOT NULL,
	from_type       TEXT NOT NULL DEFAULT 'bank',
	to_account_id   TEXT NOT NULL,
	to_type         TEXT NOT NULL DEFAULT 'bank',
	exec_date       TIMESTAMP WITH TIME ZONE DEFAULT now(),
	amount          NUMERIC NOT NULL,
	memo            TEXT,
	created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	CONSTRAINT tbl_transfers_pkey PRIMARY KEY (transfer_id),
	CONSTRAINT transfers_from_type_check CHECK (from_type IN ('bank','sec')),
	CONSTRAINT transfers_to_type_check CHECK (to_type IN ('bank','sec'))
);
