const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('static', express.static('public'));

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});

// Lấy danh sách Sách (Có hỗ trợ lọc theo Danh mục)
app.get('/api/books', (req, res) => {
    const categoryName = req.query.category; // Lấy cái tên danh mục mà Frontend gửi lên

    let sql = 'SELECT * FROM Books';
    let values = [];

    // Nếu Frontend có yêu cầu lấy theo danh mục cụ thể
    if (categoryName) {
        // Mẹo: Tạm thời nếu kho MySQL m dùng category_id, m cần phải JOIN với bảng Categories
        // T viết sẵn lệnh xịn này cho m, nó sẽ tìm sách dựa trên TÊN danh mục luôn!
        sql = `
            SELECT Books.* FROM Books 
            JOIN Categories ON Books.category_id = Categories.id 
            WHERE Categories.name = ?
        `;
        values = [categoryName];
    }

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Lỗi lấy sách:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        }
        res.json(results); // Trả sách về cho Frontend
    });
});

// API thêm sách mới vào kho
app.post('/api/books', (req, res) => {
    const {title, author, price, description, image_url, category_id} = req.body;
    const sql = 'INSERT INTO books (title, author, price, description, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, author, price, description, image_url, category_id], (err, result) => {
    if (err){
        console.error(' lỗi khi thêm sách ', err);
        return res.status(500).json({ message: 'Lỗi server' });
    }
    res.status(201).json({ message: 'Sách đã được thêm thành công',
        newBookId: result.insertId });
    });
});