
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./online-book.db');

db.serialize(() => {
    // Thêm cột 'position' vào bảng Books
    // Mặc định là 'new' (Sản phẩm mới)
    db.run("ALTER TABLE Books ADD COLUMN position TEXT DEFAULT 'new'", (err) => {
        if (err) {
            console.log("Có thể cột 'position' đã tồn tại hoặc lỗi: " + err.message);
        } else {
            console.log("Đã thêm cột 'position' thành công!");
        }
    });
});

db.close();