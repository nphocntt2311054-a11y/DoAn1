// backend/fix-admin.js (PHIÊN BẢN 4 - DÙNG TRIM)
const sqlite3 = require('sqlite3').verbose();
const DB_FILE = './online-book.db'; // Đường dẫn đến CSDL

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        return console.error("LỖI KHI KẾT NỐI:", err.message);
    }
    console.log("Đã kết nối CSDL (chỉ file fix-admin).");
});

const usernameToFix = 'ho';

// --- ĐÂY LÀ SỰ THAY ĐỔI ---
// Chúng ta dùng TRIM(username) để xóa khoảng trắng
const sql = `UPDATE Users SET isAdmin = 1 WHERE TRIM(username) = ?`;

console.log(`Đang chạy lệnh: UPDATE Users SET isAdmin = 1 WHERE TRIM(username) = '${usernameToFix}'`);

db.run(sql, [usernameToFix], function(err) {
    if (err) {
        console.error("LỖI KHI UPDATE:", err.message);
    } else {
        if (this.changes > 0) {
            console.log(`--- THÀNH CÔNG! ---`);
            console.log(`Đã đổi user '${usernameToFix}' (kể cả có khoảng trắng) thành Admin.`);
        } else {
            console.log(`--- THẤT BẠI ---`);
            console.log(`Không tìm thấy user nào có tên '${usernameToFix}', kể cả khi đã xóa khoảng trắng.`);
        }
    }
});

db.close((err) => {
    if (err) {
        console.error("Lỗi khi đóng CSDL:", err.message);
    } else {
        console.log("Đã đóng CSDL. Hoàn tất.");
    }
});