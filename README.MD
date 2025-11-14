# Bertie's Books

Sample code for the Dynamic Web Applications module.

This project uses:
- Node.js with Express
- EJS templating engine
- MySQL for database storage

===========================
📦 Installation & Running
===========================

1. Clone the repository and navigate into the folder:

   git clone https://github.com/yourusername/berties-books.git
   cd berties-books

2. Install dependencies:

   npm install

3. Start the server:

   node index.js

   The app will run on:
   http://localhost:8000


===========================
🛠️ MySQL Setup Instructions
===========================

1. Start MySQL and log in as root:

   mysql -u root -p

2. Create the database and user:

   CREATE DATABASE IF NOT EXISTS berties_books;

   CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';

   GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
   FLUSH PRIVILEGES;

3. Use the database and create the books table:

   USE berties_books;

   CREATE TABLE IF NOT EXISTS books (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     price DECIMAL(6, 2) NOT NULL
   );

4. (Optional) Insert some sample data:

   INSERT INTO books (name, price) VALUES
   ('Wonders of the Universe', 52.99),
   ('JavaScript for Beginners', 19.95),
   ('EJS Templating Basics', 15.00);


===========================
🧪 Test Pages
===========================

- http://localhost:8000/books/list          → View all books
- http://localhost:8000/books/addbook       → Add a new book
- http://localhost:8000/books/search        → Search for books
- http://localhost:8000/books/bargainbooks  → View books under £20


===========================
📁 Folder Structure
===========================

/routes       → Route handlers (books, main)
/views        → EJS templates
/public       → Static files (CSS)
/index.js     → Main app entry point


===========================
✅ Prerequisites
===========================

- Node.js
- MySQL Server