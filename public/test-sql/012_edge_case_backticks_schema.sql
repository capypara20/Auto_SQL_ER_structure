-- Edge Case: Backticks and Schema-Qualified Names
-- Tests parser's handling of different identifier formats

CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_name` VARCHAR(50) NOT NULL,
    `email_address` VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS mydb.orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `my_schema`.`products` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_name` VARCHAR(200) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory.stock_items (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS `special-table-name` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `special-column` VARCHAR(100),
    `another_column` TEXT
);

CREATE TABLE IF NOT EXISTS CamelCaseTable (
    CamelCaseId INT AUTO_INCREMENT PRIMARY KEY,
    MixedCaseColumn VARCHAR(100),
    normalcolumn VARCHAR(100)
);
