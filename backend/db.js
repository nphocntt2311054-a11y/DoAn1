const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2'); // T thấy m đang xài mysql2 trong file db.js

// 1. Cắm ống vào kho cũ (SQLite)
const dbOld = new sqlite3.Database('./online-book.db');

// 2. Cắm ống vào kho mới (Lấy đúng y chang thông tin trong file db.js của m)
const dbNew = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', 
    database: 'WebBanSach'
});

dbNew.connect(err => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
        return;
    }
    console.log('✅ Đã cắm ống thành công vào WebBanSach!');

    dbOld.all("SELECT * FROM Books", [], (err, books) => {
        if (err) throw err;
        console.log(`📦 Tìm thấy ${books.length} cuốn sách ở kho cũ! Bắt đầu bưng...`);

        // Lấy ra các danh mục (Tâm lý, Kinh tế...) để tạo ID
        const categories = [...new Set(books.map(b => b.category))].filter(Boolean);

        categories.forEach(catName => {
            // Nhét danh mục vào bảng categories
            dbNew.query('INSERT IGNORE INTO categories (name) VALUES (?)', [catName], (err) => {
                if (err) console.error(err);
                
                // Lấy cái ID của danh mục vừa tạo
                dbNew.query('SELECT id FROM categories WHERE name = ?', [catName], (err, results) => {
                    if (err || results.length === 0) return;
                    const catId = results[0].id;

                    const booksInCat = books.filter(b => b.category === catName);
                    
                    booksInCat.forEach(book => {
                        // T giả định cột ảnh trong SQLite cũ của m tên là 'image' hoặc 'imageUrl'
                        // Chỉnh sửa tên cột chỗ book.image cho khớp nếu báo lỗi nhé!
                        const img = book.image || book.imageUrl || book.image_url || ''; 

                        const insertSql = `
                            INSERT INTO books (title, author, category_id, price, description, image_url) 
                            VALUES (?, ?, ?, ?, ?, ?)
                        `;
                        const values = [book.title, book.author, catId, book.price, book.description, img];
                        
                        dbNew.query(insertSql, values, (err) => {
                            if (err) {
                                // Bỏ qua lỗi báo trùng lặp nếu m chạy lệnh này 2 lần
                                if (err.code !== 'ER_DUP_ENTRY') console.error(`Lỗi bưng ${book.title}:`, err.message);
                            } else {
                                console.log(` Đã bưng qua: ${book.title}`);
                            }
                        });
                    });
                });
            });
        });
    });
});