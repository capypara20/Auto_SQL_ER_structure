-- SQLite構文テスト
-- AUTOINCREMENT、WITHOUT ROWID、厳格な型システムなど

CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_date TEXT DEFAULT (datetime('now'))
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price >= 0),
  stock_quantity INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  order_date TEXT DEFAULT (datetime('now')),
  total_amount REAL NOT NULL,
  status TEXT CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- WITHOUT ROWIDテーブル
CREATE TABLE product_categories (
  category_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  category_name TEXT NOT NULL,
  PRIMARY KEY (category_id, product_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
) WITHOUT ROWID;
