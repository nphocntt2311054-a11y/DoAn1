// 1. GỌI TẤT CẢ THƯ VIỆN LÊN ĐẦU
const express = require('express');
const cors = require('cors');
const session = require('express-session'); // Thư viện "ghi nhớ"
const bcrypt = require('bcrypt'); // Thư viện mã hóa
const db = require('./database.js'); // CSDL của chúng ta

// 2. KHỞI TẠO CÁC BIẾN CHÍNH
const app = express();
const PORT = 3000;
const saltRounds = 10; // Dùng cho mã hóa

// 3. SỬ DỤNG MIDDLEWARE (Cấu hình)
app.use(cors({
    origin: 'http://127.0.0.1:5501', // Cho phép Live Server (frontend) gọi
    credentials: true                   // Cho phép nhận "thẻ VIP"
}));
app.use(express.json()); // Đọc được JSON

// Cấu hình Session
app.use(session({
    secret: 'mot-chuoi-bi-mat-rat-dai-va-kho-doan', // Chuỗi bí mật bất kỳ
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Để 'false' nếu bạn dùng http, 'true' cho https
}));

// 4. "NGƯỜI GÁC CỔNG" (Middleware Tùy chỉnh)
const checkAdmin = (req, res, next) => {
    // Kiểm tra xem session có tồn tại, có user, và user.isAdmin == 1 không
    if (req.session.user && req.session.user.isAdmin === 1) {
        next(); // Ok, là Admin, cho qua
    } else {
        // Không phải Admin
        res.status(403).json({ success: false, message: 'Yêu cầu quyền Admin.' });
    }
};

// 5. CÁC API 
// API Thử nghiệm
app.get('/', (req, res) => {
    res.send('Chào bạn, đây là Backend của Online Book!');
});

// --- API Về Xác thực (Auth) ---
app.post('/register', async (req, res) => {
    const { username, password, securityQuestion, securityAnswer } = req.body;

    if (!username || !password || !securityQuestion || !securityAnswer) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ thông tin.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const hashedAnswer = await bcrypt.hash(securityAnswer, saltRounds);

        const sql = `INSERT INTO Users (username, password, securityQuestion, securityAnswer)
                     VALUES (?, ?, ?, ?)`;

        db.run(sql, [username, hashedPassword, securityQuestion, hashedAnswer], function(err) {
            if (err) {
                console.error(err.message);
                return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại.' });
            }
            console.log(`Một user mới đã được tạo với ID: ${this.lastID}`);
            res.json({ success: true, message: 'Đăng ký thành công!' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ tên đăng nhập và mật khẩu.' });
    }

    const sql = 'SELECT * FROM Users WHERE username = ?';
    db.get(sql, [username], async (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
        }

        if (!user) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        try {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
               
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    isAdmin: user.isAdmin
                };
                console.log('User đã đăng nhập:', req.session.user);
                res.json({ success: true, message: 'Đăng nhập thành công!' });
            } else {
                res.status(400).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi so sánh mật khẩu.' });
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: 'Lỗi khi đăng xuất.' });
        }
        res.clearCookie('connect.sid'); // Xóa cookie session
        res.json({ success: true, message: 'Đăng xuất thành công.' });
    });
}); 

// --- API LẤY SÁCH ĐỂ TÌM KIẾM VÀ HIỂN THỊ ---
// backend/server.js - API LẤY SÁCH (Hỗ trợ Tìm kiếm & Danh mục)

app.get('/books', (req, res) => {
    const searchQuery = req.query.q; // Lấy từ khóa tìm kiếm
    const categoryQuery = req.query.category; // <--- LẤY DANH MỤC TỪ URL

    // 1. Lấy tất cả sách
    const sql = "SELECT * FROM Books ORDER BY id DESC";

    db.all(sql, [], (err, books) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
        }

        let filteredBooks = books;

        // 2. Nếu có lọc theo DANH MỤC (Category)
        if (categoryQuery) {
            filteredBooks = filteredBooks.filter(book => 
                book.category && book.category.toLowerCase() === categoryQuery.toLowerCase()
            );
        }

        // 3. Nếu có TÌM KIẾM (Search)
        if (searchQuery) {
            const keyword = searchQuery.toLowerCase();
            filteredBooks = filteredBooks.filter(book => {
                const titleMatch = book.title && book.title.toLowerCase().includes(keyword);
                const authorMatch = book.author && book.author.toLowerCase().includes(keyword);
                return titleMatch || authorMatch;
            });
        }
        
        res.json({ success: true, books: filteredBooks });
    });
});

// --- API Lấy chi tiết 1 cuốn sách theo ID ---
app.get('/books/:id', (req, res) => {
    const id = req.params.id; // Lấy số ID từ đường dẫn

    const sql = "SELECT * FROM Books WHERE id = ?";
    db.get(sql, [id], (err, book) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Lỗi server.' });
        }
        if (!book) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách.' });
        }
        // Tìm thấy! Trả về cuốn sách đó
        res.json({ success: true, book: book });
    });
});

// --- API thêm sách mới (Chỉ Admin mới được thêm) ---
app.post('/books', (req, res) => {
    console.log("Đang nhận yêu cầu thêm sách:", req.body); // 1. In ra để kiểm tra
    const { title, author, price, image, category, position, description } = req.body;
    const sql = "INSERT INTO Books (title, author, price, imageUrl, category, position, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const params = [
        title, 
        author, 
        price, 
        image, 
        category, 
        position || 'new', 
        description || ''
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error("Lỗi SQL:", err.message); // 2. In lỗi SQL nếu có
            return res.status(400).json({ success: false, message: "Lỗi thêm sách: " + err.message });
        }
        console.log("Thêm sách thành công, ID:", this.lastID);
        res.json({ success: true, id: this.lastID });
    });
});

app.delete('/admin/delete-book/:id', checkAdmin, (req, res) => {
    const bookId = req.params.id; 

    const sql = 'DELETE FROM Books WHERE id = ?';
    
    db.run(sql, [bookId], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Lỗi khi xóa sách.' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách.' });
        }

        res.json({ success: true, message: 'Xóa sách thành công!' });
    });
});

// --- API ĐẶT HÀNG (Lưu vào CSDL) ---
app.post('/order', (req, res) => {
    const { customer_name, phone, address, total_price, items } = req.body;

    // Kiểm tra dữ liệu
    if (!customer_name || !phone || !address || !items) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const sql = `INSERT INTO Orders (customer_name, phone, address, total_price, items) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    // items đang là danh sách (Mảng), ta biến nó thành chuỗi chữ để lưu vào CSDL
    const itemsString = JSON.stringify(items);

    db.run(sql, [customer_name, phone, address, total_price, itemsString], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Lỗi khi lưu đơn hàng.' });
        }
        // Trả về thành công và mã đơn hàng (this.lastID)
        res.json({ success: true, message: 'Đặt hàng thành công!', orderId: this.lastID });
    });
});

// 6. KHỞI ĐỘNG MÁY CHỦ
app.listen(PORT, () => {
    console.log(`Máy chủ đang chạy tại http://localhost:${PORT}`);
});