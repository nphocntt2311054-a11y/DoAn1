
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageEl = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://127.0.0.1:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                messageEl.textContent = 'Đăng nhập thành công! Đang chuyển về trang chủ...';
                messageEl.style.color = 'green';

                // Chờ 1.5 giây rồi chuyển về trang chủ
                setTimeout(() => {
                    window.location.href = 'trangchu.html'; // Hoặc trang 'trangchu.html' của bạn
                }, 1500);
            } else {
                messageEl.textContent = result.message; // Hiển thị lỗi (VD: Sai mật khẩu)
                messageEl.style.color = 'red';
            }

        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            messageEl.textContent = 'Lỗi kết nối. Vui lòng thử lại.';
            messageEl.style.color = 'red';
        }
    });
});