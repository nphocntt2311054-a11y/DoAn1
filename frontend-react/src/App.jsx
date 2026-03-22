import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  // 1. Tạo một cái kho rỗng để chứa sách khi bưng từ API về
  const [books, setBooks] = useState([]);

  // 2. Dùng useEffect để sai thằng React đi lấy sách NGAY KHI web vừa load xong
  useEffect(() => {
    // Gọi cái API của m nè
    fetch('http://localhost:8081/api/books')
      .then(response => response.json()) // Biến đống chữ loằng ngoằng thành dữ liệu xài được
      .then(data => {
        setBooks(data); // Đổ 60 cuốn sách vào kho
      })
      .catch(error => console.error("Lỗi lấy sách rồi m ơi:", error));
  }, []); // Cặp ngoặc vuông [] này nghĩa là chỉ đi lấy 1 lần duy nhất lúc mới mở web

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* KHÚC GIỮA: NƠI PHÉP MÀU XẢY RA */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b-2 border-primary pb-2 inline-block">
          Sách Mới Cập Nhật
        </h2>
        
        {/* Dàn khung Grid chia cột y như Shopee, Tiki */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          
          {/* Vòng lặp map(): Cứ có 1 cuốn sách trong kho thì nó đẻ ra 1 cái thẻ div này */}
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              
              {/* Hình ảnh sách */}
              <img 
                src={book.image || "https://placehold.co/400x600/10b981/white?text=Sách"} 
                alt={book.title} 
                className="w-full h-64 object-cover"
              />
              
              {/* Thông tin sách */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2" title={book.title}>
                  {book.title} 
                </h3>
                
                {/* Đẩy giá và nút bấm xuống đáy */}
                <div className="mt-auto">
                  <p className="text-primary font-bold text-xl mb-3">
                    {book.price ? Number(book.price).toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}
                  </p>
                  <button className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-emerald-600 transition-colors">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;