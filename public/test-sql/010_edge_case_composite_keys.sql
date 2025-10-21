-- Edge Case: Composite Primary Keys and Foreign Keys
-- Tests parser's ability to handle multi-column keys

CREATE TABLE IF NOT EXISTS countries (
    country_code CHAR(2) PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS regions (
    country_code CHAR(2) NOT NULL,
    region_code VARCHAR(10) NOT NULL,
    region_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (country_code, region_code),
    FOREIGN KEY (country_code) REFERENCES countries(country_code)
);

CREATE TABLE IF NOT EXISTS cities (
    country_code CHAR(2) NOT NULL,
    region_code VARCHAR(10) NOT NULL,
    city_code VARCHAR(10) NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    population INT,
    PRIMARY KEY (country_code, region_code, city_code),
    FOREIGN KEY (country_code, region_code) REFERENCES regions(country_code, region_code)
);

CREATE TABLE IF NOT EXISTS student_courses (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    semester VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    grade VARCHAR(2),
    PRIMARY KEY (student_id, course_id, semester, year)
);

CREATE TABLE IF NOT EXISTS product_suppliers (
    product_id INT NOT NULL,
    supplier_id INT NOT NULL,
    supply_date DATE NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (product_id, supplier_id, supply_date)
);
