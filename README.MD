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

```bash
git clone https://github.com/HCosk/06_berties_33796832/
cd berties-books
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node index.js
```

The app will run at:  
http://localhost:8000

===========================
🛠️ MySQL Setup Instructions
===========================

1. Start MySQL:

```bash
mysql -u root -p
```

2. Create the database and user:

```sql
CREATE DATABASE IF NOT EXISTS berties_books;

CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';

GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
FLUSH PRIVILEGES;
```

3. Create tables:

```sql
USE berties_books;

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(6,2) NOT NULL
);

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
```

(Optional) Insert sample books:

```sql
INSERT INTO books (name, price) VALUES
('Wonders of the Universe', 52.99),
('JavaScript for Beginners', 19.95),
('EJS Templating Basics', 15.00);
```

===========================
🧪 Test Pages
===========================

- /books/list — View all books  
- /books/addbook — Add a new book  
- /books/search — Search books  
- /books/bargainbooks — Books under £20  
- /users/register — Register new user  
- /users/login — Login  
- /users/audit — View audit log  

===========================
📁 Folder Structure
===========================

```
/routes       → Route handlers (books, main, users)
/views        → EJS templates
/public       → Static files
/index.js     → Main app entry point
```

===========================
🔐 dotenv (Environment Variables)
===========================

To securely store database credentials and prevent them from being committed to GitHub, this project uses the `dotenv` package.

### Setup Instructions:

1. Install dotenv:

```bash
npm install dotenv
```

2. Create a `.env` file in your project root:

```
BB_HOST='x'
BB_USER='x'
BB_PASSWORD='x'
BB_DATABASE='x'
```

3. In `index.js`, load environment variables:

```js
require('dotenv').config();
```

4. Use the variables in your MySQL connection:

```js
const db = mysql.createPool({
  host: process.env.BB_HOST,
  user: process.env.BB_USER,
  password: process.env.BB_PASSWORD,
  database: process.env.BB_DATABASE
});
```

5. Add `.env` to your `.gitignore`:

```
.env
```

===========================
📝 Audit (Feature Documentation)
===========================

This project includes an **audit logging feature** that records all login attempts.  
The feature was implemented as follows:

### **1. Audit Table**
A database table `audit_log` was created:

```sql
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    action VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Each entry stores:
- the username used during login  
- the action (`login_success`, `login_failed_wrong_password`, `login_failed_username_not_found`)  
- the timestamp of the action  

### **2. Logging Login Attempts**
Inside `/routes/users.js`, audit entries are created whenever a user attempts login:

```js
const logAction = "INSERT INTO audit_log (username, action) VALUES (?, ?)";
```

The system logs:
- successful logins  
- failed logins due to incorrect password  
- failed logins where the username does not exist  

### **3. Viewing the Audit Log**
A new route `/users/audit` displays all audit entries:

```js
router.get('/audit', function (req, res, next) {
    const sqlquery = "SELECT * FROM audit_log ORDER BY timestamp DESC";
    db.query(sqlquery, function(err, result) {
        if (err) return next(err);
        res.render('audit.ejs', { audit: result });
    });
});
```

The audit history is rendered through `audit.ejs` as a table showing username, action, and timestamp.

### **4. Purpose of the Audit Feature**
The audit log provides:
- traceability for login activity  
- a record of failed or suspicious login attempts  
- transparency for instructors/markers reviewing the system  
