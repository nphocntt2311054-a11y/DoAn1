// frontend/cart.js - PHIÊN BẢN NÂNG CẤP (TĂNG/GIẢM SỐ LƯỢNG)

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTotalEl = document.getElementById('cart-total');
    const btnCheckout = document.getElementById('btn-checkout');

    // --- HÀM 1: TẢI VÀ HIỂN THỊ GIỎ HÀNG ---
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-10">
                    <p class="text-gray-500 text-lg">Giỏ hàng của bạn đang trống.</p>
                    <a href="trangchu.html" class="text-primary font-bold hover:underline mt-2 inline-block">Quay lại mua sắm</a>
                </div>
            `;
            updateTotal(0);
            return;
        }

        cartContainer.innerHTML = ''; 
        let totalAmount = 0;

        cart.forEach((item, index) => {
            // Fix lỗi dữ liệu cũ nếu có
            if (!item.quantity || item.quantity < 1) item.quantity = 1;
            if (!item.price) item.price = 0;

            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            const imgSrc = item.image || 'https://placehold.co/100?text=No+Img';

            const rowHTML = `
                <div class="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 items-center hover:bg-gray-50 transition">
                    <div class="col-span-6 flex items-center gap-4">
                        <img src="${imgSrc}" class="w-16 h-24 object-cover rounded border shadow-sm">
                        <div>
                            <h3 class="font-bold text-gray-800 text-sm md:text-base line-clamp-2">
                                <a href="detail.html?id=${item.id}">${item.title}</a>
                            </h3>
                            <button onclick="removeItem(${index})" class="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Xóa tất cả
                            </button>
                        </div>
                    </div>

                    <div class="col-span-2 text-center hidden md:block text-gray-600 text-sm">
                        ${item.price.toLocaleString('vi-VN')}đ
                    </div>

                    <div class="col-span-3 md:col-span-2 text-center flex justify-center items-center gap-2">
                        <button onclick="decreaseItem(${index})" class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold flex items-center justify-center transition">-</button>
                        
                        <span class="text-sm font-bold text-gray-800 w-6">${item.quantity}</span>
                        
                        <button onclick="increaseItem(${index})" class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold flex items-center justify-center transition">+</button>
                    </div>

                    <div class="col-span-3 md:col-span-2 text-right font-bold text-primary text-sm md:text-base">
                        ${itemTotal.toLocaleString('vi-VN')}đ
                    </div>
                </div>
            `;
            cartContainer.innerHTML += rowHTML;
        });

        updateTotal(totalAmount);
    }

    function updateTotal(amount) {
        const formatted = amount.toLocaleString('vi-VN') + 'đ';
        if(cartSubtotalEl) cartSubtotalEl.textContent = formatted;
        if(cartTotalEl) cartTotalEl.textContent = formatted;
    }
    // xử lý khi bấm nút "Thanh toán"
    if(btnCheckout){
        btnCheckout.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
            const user = localStorage.getItem('currentUser'); 

            if (cart.length === 0) {
                alert('Giỏ hàng trống trơn à!');
                return;
            }

            // --- KIỂM TRA ĐĂNG NHẬP ---
            if (!user) { 
                alert('Vui lòng Đăng nhập để tiếp tục thanh toán!');
                window.location.href = 'login.html'; 
                return;
            }
            window.location.href = 'checkout.html'; 
        });
    }
    renderCart();
});

// --- CÁC HÀM XỬ LÝ BÊN NGOÀI ---

// 1. Hàm GIẢM số lượng (-)
function decreaseItem(index) {
    let cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    
    // Nếu đang là 1 mà bấm giảm -> Hỏi xóa
    if (cart[index].quantity <= 1) {
        if(confirm('Bạn muốn xóa sản phẩm này khỏi giỏ?')) {
            cart.splice(index, 1);
        }
    } else {
        // Nếu > 1 -> Giảm đi 1
        cart[index].quantity -= 1;
    }

    // Lưu và tải lại
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
    location.reload();
}

// 2. Hàm TĂNG số lượng (+)
function increaseItem(index) {
    let cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    cart[index].quantity += 1;
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
    location.reload();
}

// 3. Hàm XÓA SẠCH dòng đó (Thùng rác)
function removeItem(index) {
    if(!confirm('Bạn muốn bỏ toàn bộ cuốn này ra khỏi giỏ?')) return;
    let cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
    location.reload();
}