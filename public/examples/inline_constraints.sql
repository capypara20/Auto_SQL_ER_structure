-- インラインの制約定義テスト
-- カラムレベルでの PRIMARY KEY、FOREIGN KEY、UNIQUE など

CREATE TABLE authors (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  bio TEXT
);

CREATE TABLE books (
  isbn VARCHAR(13) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author_id INT NOT NULL REFERENCES authors(id),
  publication_year INT,
  price DECIMAL(10, 2)
);

CREATE TABLE reviews (
  id INT PRIMARY KEY,
  book_isbn VARCHAR(13) NOT NULL REFERENCES books(isbn) ON DELETE CASCADE,
  reviewer_name VARCHAR(100),
  rating INT CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  review_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE book_editions (
  edition_id INT PRIMARY KEY,
  book_isbn VARCHAR(13) REFERENCES books(isbn),
  edition_number INT NOT NULL,
  format VARCHAR(20),
  pages INT,
  publisher VARCHAR(100)
);
