-- Edge Case: Circular References
-- Tests circular foreign key relationships (A->B->C->A)

CREATE TABLE IF NOT EXISTS table_a (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    table_c_id INT NULL
);

CREATE TABLE IF NOT EXISTS table_b (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    table_a_id INT NULL,
    FOREIGN KEY (table_a_id) REFERENCES table_a(id)
);

CREATE TABLE IF NOT EXISTS table_c (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    table_b_id INT NULL,
    FOREIGN KEY (table_b_id) REFERENCES table_b(id)
);

-- This creates the circular reference
ALTER TABLE table_a ADD CONSTRAINT fk_a_to_c FOREIGN KEY (table_c_id) REFERENCES table_c(id);

-- Another circular example with two tables
CREATE TABLE IF NOT EXISTS partners (
    partner_id INT AUTO_INCREMENT PRIMARY KEY,
    partner_name VARCHAR(100) NOT NULL,
    spouse_id INT NULL
);

-- Self-referencing but mutual relationship
ALTER TABLE partners ADD CONSTRAINT fk_spouse FOREIGN KEY (spouse_id) REFERENCES partners(partner_id);
