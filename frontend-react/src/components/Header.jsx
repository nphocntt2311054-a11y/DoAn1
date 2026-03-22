function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[999]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo */}
        <a href="trangchu.html">
          <img src="image/logo.png" alt="Logo BookNè" width="120" height="auto" />
        </a>

        {/* Tìm kiếm */}
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <input
            id="search-input"
            type="search"
            className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Tìm kiếm sách, tác giả..."
          />
          <div id="search-btn" className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none cursor-pointer">
            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>

        {/* Tài khoản  */}
        <div className="flex items-center gap-3">
          <div id="account-area">
            <a href="login.html" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="hidden md:inline">Đăng nhập</span>
            </a>
          </div>

          {/* Giỏ hàng */}
          <a href="cart.html" className="relative p-2 text-gray-600 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span id="cart-count" className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
          </a>
        </div>

      </div>

      {/* ==== NAVIGATION ==== */}
      <nav className="bg-emerald-50 shadow-sm relative z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center items-center h-14 space-x-6 sm:space-x-10">
            <li><a href="trangchu.html" className="font-semibold text-gray-800 hover:text-primary transition-colors">Trang chủ</a></li>
            <li className="relative group">
              <a href="#" className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors flex items-center">
                Danh mục sản phẩm
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <li><a href="VanHoc.html" className="block px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 rounded-t-lg">Văn học</a></li>
                <li><a href="KinhTe.html" className="block px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700">Kinh tế</a></li>
                <li><a href="SachTamLy.html" className="block px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700">Tâm lý - Kỹ năng sống</a></li>
                <li><a href="SachKhoaHoc.html" className="block px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700">Sách khoa học</a></li>
                <li><a href="SachAV.html" className="block px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700">Sách học ngoại ngữ</a></li>
                <li><a href="SachThieuNhi.html" className="block px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700">Sách thiếu nhi</a></li>
              </ul>
            </li>
            <li><a href="GioiThieu.html" className="font-semibold text-gray-800 hover:text-primary transition-colors">Giới thiệu</a></li>
            <li><a href="LienHe.html" className="font-semibold text-gray-800 hover:text-primary transition-colors">Liên hệ</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;