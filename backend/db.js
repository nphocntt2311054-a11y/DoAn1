const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '123456',
    database: 'WebBanSach' 
});


db.connect((err) => {
    if (err) {
        console.error(' Lỗi kết nối MySQL', err.message);
        return;
    }
    console.log(' Đã kết nối thành công với MySQL');
});
module.exports = db;