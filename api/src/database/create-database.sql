CREATE DATABASE IF NOT EXISTS rinku_cinemas;
USE rinku_cinemas;

CREATE TABLE
    IF NOT EXISTS Role (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(50) NOT NULL,
        HourlyBonus DECIMAL(10, 2) NOT NULL DEFAULT 0.00
    );

CREATE TABLE
    IF NOT EXISTS EmployeeType (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(50) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS Employee (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        EmployeeCode VARCHAR(50) NOT NULL UNIQUE,
        FullName VARCHAR(100) NOT NULL,
        RoleID INT NOT NULL,
        EmployeeTypeID INT NOT NULL,
        Status BOOLEAN NOT NULL DEFAULT TRUE,
        FOREIGN KEY (RoleID) REFERENCES Role (ID),
        FOREIGN KEY (EmployeeTypeID) REFERENCES EmployeeType (ID)
    );

CREATE TABLE
    IF NOT EXISTS Movement (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        EmployeeID INT NOT NULL,
        Date DATE NOT NULL,
        HoursWorked DECIMAL(5, 2) NOT NULL DEFAULT 8.00,
        DeliveriesCount INT NOT NULL DEFAULT 0,
        CoveringRoleID INT NULL,
        FOREIGN KEY (EmployeeID) REFERENCES Employee (ID),
        FOREIGN KEY (CoveringRoleID) REFERENCES Role (ID)
    );