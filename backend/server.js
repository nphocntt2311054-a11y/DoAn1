const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Cho phép React kết nối thoải mái
app.use(express.json());

// 1. Cấu hình kết nối vào cục MySQL của m
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Tên user MySQL của m (thường là root)
    password: '123456',      // Mật khẩu MySQL (nếu dùng XAMPP thì để trống, nếu m có set pass thì điền vào đây nha)
    database: 'webbansach' // Tên database m chụp trong hình
});

db.connect((err) => {
    if (err) {
        console.error('Bị lỗi kết nối Database rồi m ơi: ', err);
        return;
    }
    console.log('Ngon! Đã kết nối thành công với MySQL webbansach!');
});

// 2. Tạo cái API (Lệnh để bốc 60 cuốn sách)
app.get('/api/books', (req, res) => {
    const sql = "SELECT * FROM books LIMIT 60";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); // Trả cục data này về cho thằng React
    });
});

// 3. Bật cầu dao cho server chạy ở cổng 8081
app.listen(8081, () => {
    console.log('Server Backend đang chạy bon bon ở cổng http://localhost:8081');
});