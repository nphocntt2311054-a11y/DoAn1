function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          
          <div className="w-full max-w-xs text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Tin Tức</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  "Bước vào không gian tri thức vô tận, nơi mỗi cuốn sách là một cánh cửa mở ra những cuộc phiêu lưu mới mẻ và kiến thức sâu rộng; chúng tôi cam kết mang đến trải nghiệm mua sắm..."
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full max-w-xs text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3">
              <li><a href="tel:19001909" className="text-sm text-gray-400 hover:text-white transition-colors">HotLine: 19001909</a></li>
              <li><a href="https://www.facebook.com/" className="text-sm text-gray-400 hover:text-white transition-colors">Facebook: https://www.facebook.com/</a></li>
              <li><a href="https://www.tiktok.com/" className="text-sm text-gray-400 hover:text-white transition-colors">TikTok: https://www.TikTok.com/</a></li>
              <li><a href="mailto:support@bookworld.vn" className="text-sm text-gray-400 hover:text-white transition-colors">Gmail: support@bookworld.vn</a></li>
            </ul>
          </div>

          <div className="w-full max-w-xs text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Tài khoản của tôi</h4>
            <ul className="space-y-3">
              <li><a href="register.html" className="text-sm text-gray-400 hover:text-white transition-colors">Đăng ký</a></li>
              <li><a href="login.html" className="text-sm text-gray-400 hover:text-white transition-colors">Đăng nhập</a></li>
              <li><a href="history.html" className="text-sm text-gray-400 hover:text-white transition-colors">Lịch sử mua hàng</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2025 BookWorld.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;