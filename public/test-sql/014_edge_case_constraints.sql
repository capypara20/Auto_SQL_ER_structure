-- Edge Case: Named Constraints and Complex Relationships
-- Tests CONSTRAINT keyword and named foreign keys

CREATE TABLE IF NOT EXISTS organizations (
    org_id INT AUTO_INCREMENT PRIMARY KEY,
    org_name VARCHAR(100) NOT NULL,
    CONSTRAINT uk_org_name UNIQUE (org_name)
);

CREATE TABLE IF NOT EXISTS departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    org_id INT NOT NULL,
    CONSTRAINT fk_dept_org FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
    CONSTRAINT uk_dept_name_org UNIQUE (dept_name, org_id)
);

CREATE TABLE IF NOT EXISTS employees (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dept_id INT,
    manager_id INT,
    salary DECIMAL(10, 2),
    hire_date DATE NOT NULL,
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL,
    CONSTRAINT fk_emp_manager FOREIGN KEY (manager_id) REFERENCES employees(emp_id) ON DELETE SET NULL,
    CONSTRAINT chk_salary CHECK (salary > 0),
    CONSTRAINT chk_hire_date CHECK (hire_date <= CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    dept_id INT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15, 2),
    CONSTRAINT fk_project_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id),
    CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_budget CHECK (budget >= 0)
);

CREATE TABLE IF NOT EXISTS employee_projects (
    emp_id INT NOT NULL,
    project_id INT NOT NULL,
    role VARCHAR(50),
    allocation_percentage INT,
    CONSTRAINT pk_emp_project PRIMARY KEY (emp_id, project_id),
    CONSTRAINT fk_ep_employee FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE,
    CONSTRAINT fk_ep_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT chk_allocation CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    performed_by INT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (performed_by) REFERENCES employees(emp_id),
    CONSTRAINT chk_action CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
);
