
// File này chứa những tính năng dùng chung cho TOÀN BỘ website

// TÍNH NĂNG SỐ ĐIẾM TRONG GIỎ HÀNG
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Tự động chạy ngay khi trang web tải xong
});

// Hàm đếm số lượng trong giỏ hàng
function updateCartCount() {
    // 1. Tìm cái cục màu đỏ (dựa vào ID)
    const cartCountEl = document.getElementById('cart-count');
    
    // Nếu trang này không có icon giỏ hàng (ví dụ trang login) thì dừng lại
    if (!cartCountEl) return;

    // 2. Lấy dữ liệu từ "ba-lô" (localStorage)
    const cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    
    // 3. Tính tổng số lượng
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 4. Hiển thị lên icon
    cartCountEl.textContent = totalQuantity;
    
    if (totalQuantity > 0) {    
        cartCountEl.classList.remove('hidden'); // Hiện nếu có hàng
    } else {
        cartCountEl.classList.add('hidden');    // Ẩn nếu rỗng
    }
}

// frontend/common.js (KIỂM TRA LẠI PHẦN NÀY)

// Hàm render UI Đăng nhập/Đăng ký mặc định
function renderDefaultAuthUI(placeholder) {
    // KHI CHƯA ĐĂNG NHẬP: Hiển thị link Đăng nhập, Đăng ký VÀ Giỏ hàng
    placeholder.innerHTML = `
        <a href="login.html" class="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary transition colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span class="hidden md:inline">Tài khoản</span>
        </a>
        <a href="cart.html" class="flex items-center space-x-2 relative p-2 text-gray-700 hover:text-primary transition colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="hidden md:inline">Giỏ hàng</span>
            <span id="cart-count" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
        </a>
    `;
}

// Hàm Cập nhật giao diện Đăng nhập/Đăng xuất
function checkAuthUI() {
    const authPlaceholder = document.getElementById('auth-ui-placeholder');
    const userString = localStorage.getItem('currentUser'); 

    if (!authPlaceholder) return; 

    if (userString) {
        // ĐÃ ĐĂNG NHẬP: Hiển thị Avatar VÀ Giỏ hàng
        try {
            const user = JSON.parse(userString); 
            const firstLetter = (user.username ? user.username[0] : 'U').toUpperCase();
            
            authPlaceholder.innerHTML = `
                <div class="flex items-center space-x-4">
                    
                    <div class="relative">
                        <div id="user-avatar" 
                             class="w-8 h-8 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center cursor-pointer text-sm"
                             onclick="toggleUserMenu()">
                            ${firstLetter}
                        </div>
                        
                        <div id="user-menu" class="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden">
                            <div class="block px-4 py-2 text-sm text-gray-700 border-b">Xin chào, ${user.username}</div>
                            <button onclick="logout()" 
                                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Đăng xuất
                            </button>
                        </div>
                    </div>

                    <a href="cart.html" class="flex items-center space-x-2 relative p-2 text-gray-700 hover:text-primary transition colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span class="hidden md:inline">Giỏ hàng</span>
                        <span id="cart-count" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
                    </a>

                </div>
            `;
            // Cần gán lại sự kiện click cho menu
            const userMenu = document.getElementById('user-menu');
            if (userMenu) {
                window.toggleUserMenu = function() {
                    userMenu.classList.toggle('hidden');
                };
            }

        } catch (e) {
            console.error("Lỗi parse currentUser:", e);
            renderDefaultAuthUI(authPlaceholder);
        }

    } else {
        // Chưa đăng nhập -> Hiện UI mặc định (bao gồm Giỏ hàng)
        renderDefaultAuthUI(authPlaceholder);
    }
    // Sau khi nội dung được chèn, cần gọi lại updateCartCounter để hiển thị số lượng
    window.updateCartCounter();
}

// --- TÍNH NĂNG TÌM KIẾM ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');

    if (searchInput) {
        // Khi người dùng nhấn phím trong ô tìm kiếm
        searchInput.addEventListener('keypress', (e) => {
            // Nếu phím nhấn là Enter (Mã 13)
            if (e.key === 'Enter') {
                const keyword = searchInput.value.trim(); // Lấy chữ người dùng gõ
                if (keyword) {
                    // Chuyển hướng sang trang tìm kiếm với từ khóa
                    // Ví dụ: search.html?q=harry
                    window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
                }
            }
        });
    }
});