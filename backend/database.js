
const sqlite3 = require('sqlite3').verbose();

// Kết nối Database
const db = new sqlite3.Database('./online-book.db', (err) => {
    if (err) {
        console.error("Lỗi kết nối:", err.message);
    } else {
        console.log(' Đã kết nối thành công đến CSDL SQLite.');
        
        db.serialize(() => {
            // 1. Bảng Users
            db.run(`
                CREATE TABLE IF NOT EXISTS Users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    securityQuestion TEXT, 
                    securityAnswer TEXT,
                    isAdmin INTEGER DEFAULT 0 
                )
            `);

            // 2. Bảng Books
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

            // 3. Bảng Orders 
            db.run(`
                CREATE TABLE IF NOT EXISTS Orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,       -- Cột mới: ID tài khoản mua
                    customer_name TEXT,
                    phone TEXT,
                    address TEXT,
                    total_price REAL,
                    items TEXT,  
                    status TEXT DEFAULT 'Đang xử lý', -- Cột mới: Trạng thái
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                 )  
            `);

            console.log(" Các bảng CSDL đã được kết nối");
        });
    }
});

module.exports = db;