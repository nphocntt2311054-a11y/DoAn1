
document.addEventListener('DOMContentLoaded', () => {
    // --- KIỂM TRA ĐĂNG NHẬP ---
    const user = localStorage.getItem('currentUser');
    if (!user) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để thanh toán.');
        window.location.href = 'login.html'; 
        return; 
    }
    const summaryDiv = document.getElementById('order-summary');
    const finalTotalEl = document.getElementById('final-total');
    const btnConfirm = document.getElementById('btn-confirm');

    // 1. Lấy giỏ hàng từ "ba-lô" ra
    const cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    
    // Nếu giỏ trống thì đuổi về trang chủ
    if (cart.length === 0) {
        alert('Giỏ hàng trống! Vui lòng mua sách trước.');
        window.location.href = 'trangchu.html';
        return;
    }

    // 2. Hiển thị tóm tắt đơn hàng
    let totalAmount = 0;
    summaryDiv.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        summaryDiv.innerHTML += `
            <div class="flex justify-between">
                <span>${item.title} (x${item.quantity})</span>
                <span class="font-medium">${itemTotal.toLocaleString('vi-VN')}đ</span>
            </div>
        `;
    });

    finalTotalEl.textContent = totalAmount.toLocaleString('vi-VN') + 'đ';

    // 3. Xử lý khi bấm nút "XÁC NHẬN"
    btnConfirm.addEventListener('click', async () => {
        const name = document.getElementById('customer_name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        if (!name || !phone || !address) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng!');
            return;
        }

        // Tạo gói dữ liệu để gửi lên Server
        const orderData = {
            customer_name: name,
            phone: phone,
            address: address,
            total_price: totalAmount,
            items: cart // Gửi cả cái giỏ hàng lên
        };

        try {
            const response = await fetch('http://127.0.0.1:3000/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                alert('🎉 ĐẶT HÀNG THÀNH CÔNG! Mã đơn: #' + result.orderId);
                
                // Xóa sạch giỏ hàng sau khi mua xong
                localStorage.removeItem('shopping-cart');
                
                // Chuyển hướng về trang chủ
                window.location.href = 'trangchu.html';
            } else {
                alert('Lỗi: ' + result.message);
            }

        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối server.');
        }
    });
});