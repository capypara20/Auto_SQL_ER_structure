-- 複雑なリレーションシップのテスト
-- 自己参照、多対多、複合主キーなど

CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  manager_id INT,
  department_id INT,
  hire_date DATE NOT NULL,
  FOREIGN KEY (manager_id) REFERENCES employees(employee_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE departments (
  department_id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  manager_id INT,
  budget DECIMAL(12, 2),
  FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

CREATE TABLE projects (
  project_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15, 2)
);

-- 多対多リレーション: 従業員とプロジェクト
CREATE TABLE employee_projects (
  employee_id INT NOT NULL,
  project_id INT NOT NULL,
  role VARCHAR(50),
  hours_allocated DECIMAL(5, 2),
  start_date DATE,
  PRIMARY KEY (employee_id, project_id),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

CREATE TABLE skills (
  skill_id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(50)
);

-- 多対多リレーション: 従業員とスキル
CREATE TABLE employee_skills (
  employee_id INT NOT NULL,
  skill_id INT NOT NULL,
  proficiency_level INT CHECK(proficiency_level BETWEEN 1 AND 5),
  years_experience DECIMAL(3, 1),
  PRIMARY KEY (employee_id, skill_id),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

-- 複合外部キー
CREATE TABLE project_milestones (
  milestone_id INT PRIMARY KEY,
  employee_id INT NOT NULL,
  project_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  due_date DATE,
  status VARCHAR(20),
  FOREIGN KEY (employee_id, project_id) REFERENCES employee_projects(employee_id, project_id)
);
