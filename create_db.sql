-- Create database for Bertie's Books
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

-- Create the books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT,
    name VARCHAR(50),
    price DECIMAL(5, 2),
    PRIMARY KEY(id)
);

-- Create the users table 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    action VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';