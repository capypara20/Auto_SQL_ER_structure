-- 最小限のシンプルなテスト

CREATE TABLE users (
  id INT PRIMARY KEY,
  name TEXT
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT,
  title TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
