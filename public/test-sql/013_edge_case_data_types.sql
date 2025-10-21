-- Edge Case: Various Data Types
-- Tests parser's handling of different SQL data types

CREATE TABLE IF NOT EXISTS data_type_test (
    -- Numeric types
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tiny_int TINYINT,
    small_int SMALLINT,
    medium_int MEDIUMINT,
    regular_int INT,
    big_int BIGINT,
    decimal_value DECIMAL(10, 2),
    numeric_value NUMERIC(15, 4),
    float_value FLOAT,
    double_value DOUBLE,
    real_value REAL,

    -- String types
    char_fixed CHAR(10),
    varchar_variable VARCHAR(255),
    tiny_text TINYTEXT,
    regular_text TEXT,
    medium_text MEDIUMTEXT,
    long_text LONGTEXT,

    -- Binary types
    binary_fixed BINARY(16),
    varbinary_variable VARBINARY(255),
    tiny_blob TINYBLOB,
    regular_blob BLOB,
    medium_blob MEDIUMBLOB,
    long_blob LONGBLOB,

    -- Date and time types
    date_value DATE,
    time_value TIME,
    datetime_value DATETIME,
    timestamp_value TIMESTAMP,
    year_value YEAR,

    -- Other types
    enum_value ENUM('option1', 'option2', 'option3'),
    set_value SET('value1', 'value2', 'value3'),
    json_data JSON,
    boolean_flag BOOLEAN,
    bit_field BIT(8)
);

CREATE TABLE IF NOT EXISTS postgresql_types (
    id SERIAL PRIMARY KEY,
    uuid_value UUID,
    json_data JSON,
    jsonb_data JSONB,
    array_data INTEGER[],
    text_array TEXT[],
    hstore_data HSTORE,
    inet_value INET,
    cidr_value CIDR,
    macaddr_value MACADDR,
    timestamp_tz TIMESTAMP WITH TIME ZONE,
    timestamp_no_tz TIMESTAMP WITHOUT TIME ZONE,
    interval_value INTERVAL,
    point_value POINT,
    line_value LINE,
    polygon_value POLYGON
);

CREATE TABLE IF NOT EXISTS complex_constraints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    not_null_col VARCHAR(50) NOT NULL,
    unique_col VARCHAR(50) UNIQUE,
    default_col VARCHAR(50) DEFAULT 'default_value',
    check_col INT CHECK (check_col >= 0 AND check_col <= 100),
    auto_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    multiple_constraints VARCHAR(100) NOT NULL UNIQUE DEFAULT 'test'
);
