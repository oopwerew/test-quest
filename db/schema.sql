CREATE DATABASE IF NOT EXISTS hr_employees CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hr_employees;

CREATE TABLE IF NOT EXISTS departments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_departments_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS positions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_positions_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS employees (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    birth_date DATE NOT NULL,
    passport VARCHAR(11) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    position_id INT UNSIGNED NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    hire_date DATE NOT NULL,
    is_fired TINYINT(1) NOT NULL DEFAULT 0,
    fired_at DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_employees_passport UNIQUE (passport),
    CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES departments (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_employees_position FOREIGN KEY (position_id) REFERENCES positions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_employees_full_name (full_name),
    INDEX idx_employees_department_id (department_id),
    INDEX idx_employees_position_id (position_id),
    INDEX idx_employees_is_fired (is_fired)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
