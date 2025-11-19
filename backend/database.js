// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./online-book.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Đã kết nối thành công đến CSDL SQLite.');
        db.serialize(() => {
            // Tạo bảng Users
            db.run(`
                CREATE TABLE IF NOT EXISTS Users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    securityQuestion TEXT NOT NULL,
                    securityAnswer TEXT NOT NULL,
                    isAdmin INTEGER DEFAULT 0 
                )
            `);

            // Tạo bảng Books
            db.run(`
                CREATE TABLE IF NOT EXISTS Books (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    category TEXT,
                    price REAL NOT NULL,
                    description TEXT,
                    stock INTEGER DEFAULT 1,
                    imageUrl TEXT 
                )
            `);

            // Tạo bảng Đơn Hàng (Orders) ---
            db.run(`
                CREATE TABLE IF NOT EXISTS Orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer_name TEXT,
                    phone TEXT,
                    address TEXT,
                    total_price INTEGER,
                    items TEXT,  
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                 )  
            `);

            console.log("Các bảng CSDL đã sẵn sàng.");
        });
    }
});

module.exports = db;