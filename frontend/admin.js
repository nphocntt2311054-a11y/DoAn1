
document.addEventListener('DOMContentLoaded', () => {
    // --- PHẦN 1: KHAI BÁO CÁC NÚT TABS ---
    const tabBooksBtn = document.getElementById('tab-books');
    const tabUsersBtn = document.getElementById('tab-users');
    const contentBooks = document.getElementById('content-books');
    const contentUsers = document.getElementById('content-users');

    // --- PHẦN 2: KHAI BÁO CÁC NÚT CỦA TAB SÁCH ---
    const addBookForm = document.getElementById('add-book-form');
    const bookListDiv = document.getElementById('book-list');
    const messageEl = document.getElementById('admin-message');
    const logoutBtn = document.getElementById('logout-btn');

    // --- HÀM 1: CHUYỂN TAB ---
    function switchTab(tabName) {
        if (tabName === 'books') {
            tabBooksBtn.classList.add('active', 'text-emerald-600');
            tabUsersBtn.classList.remove('active', 'text-emerald-600');
            tabUsersBtn.classList.add('text-gray-500'); 
            
            contentBooks.classList.remove('hidden');
            contentUsers.classList.add('hidden');
        } else if (tabName === 'users') {
            tabUsersBtn.classList.add('active', 'text-emerald-600');
            tabBooksBtn.classList.remove('active', 'text-emerald-600');
            tabBooksBtn.classList.add('text-gray-500'); 

            contentUsers.classList.remove('hidden');
            contentBooks.classList.add('hidden');
        }
    }

    tabBooksBtn.addEventListener('click', () => switchTab('books'));
    tabUsersBtn.addEventListener('click', () => switchTab('users'));

    // --- HÀM 2: TẢI DANH SÁCH SÁCH ---
    //...
    async function loadBooks() {
        try {
            // Thêm credentials vào đây
            const response = await fetch('http://127.0.0.1:3000/books', {
                credentials: 'include'
            });
            const data = await response.json();
//...

            if (data.success) {
                bookListDiv.innerHTML = ''; 
                if (data.books.length === 0) {
                    bookListDiv.innerHTML = '<p>Chưa có sách nào trong CSDL.</p>';
                    return;
                }
                
                data.books.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.className = 'p-4 border rounded-lg flex justify-between items-center';
                    bookItem.innerHTML = `
                        <div class="flex-grow">
                            <h3 class="font-bold">${book.title}</h3>
                            <p class="text-sm text-gray-600">${book.author}</p>
                            <p class="text-xs text-gray-500">ID: ${book.id}</p>
                        </div>
                        <span class="font-bold text-emerald-600 mr-6">${book.price.toLocaleString('vi-VN')} VNĐ</span>
                        <button 
                            data-id="${book.id}" 
                            class="delete-btn bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                            Xóa
                        </button>
                    `;
                    bookListDiv.appendChild(bookItem);
                });
            }
        } catch (error) {
            bookListDiv.innerHTML = '<p>Lỗi tải sách. Vui lòng kiểm tra lại.</p>';
        }
    }

    // --- HÀM 3: GỬI FORM THÊM SÁCH 
    addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        // Lấy giá trị từ các ô input
        const titleInput = document.getElementById('title');
        const authorInput = document.getElementById('author');
        const categoryInput = document.getElementById('category');
        const priceInput = document.getElementById('price');
        const stockInput = document.getElementById('stock'); 
        const imageInput = document.getElementById('imageUrl');
        const descInput = document.getElementById('description');

        const book = {
            title: titleInput.value,
            author: authorInput.value,
            category: categoryInput.value,
            price: parseFloat(priceInput.value),
            stock: stockInput ? parseInt(stockInput.value) : 1, 
            imageUrl: imageInput.value, 
            description: descInput.value,
        };

        try {
            const response = await fetch('http://127.0.0.1:3000/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
                credentials: 'include'
            });
            
            const result = await response.json();

            if (result.success) {
                messageEl.textContent = 'Thêm sách thành công!';
                messageEl.className = 'text-center mb-4 font-bold text-emerald-600';
                
                addBookForm.reset(); // Xóa trắng form
                loadBooks(); // Tải lại danh sách ngay lập tức
            } else {
                messageEl.textContent = 'Lỗi: ' + result.message;
                messageEl.className = 'text-center mb-4 font-bold text-red-600';
            }
        } catch (error) {
            console.error(error);
            messageEl.textContent = 'Lỗi kết nối Server.';
            messageEl.className = 'text-center mb-4 font-bold text-red-600';
        }
    });

    // --- HÀM 4: ĐĂNG XUẤT ---
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:3000/logout', { 
                method: 'POST',
                credentials: 'include' // Thêm "thẻ VIP"
            });
            const result = await response.json();
            if (result.success) {
                window.location.href = 'index.html'; 
            }
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        }
    });

    // --- HÀM 5: XỬ LÝ NÚT XÓA ---
    async function handleDeleteClick(e) {
        if (!e.target.classList.contains('delete-btn')) {
            return;
        }
        
        const bookId = e.target.dataset.id; 

        if (!confirm(`Bạn có chắc muốn xóa sách có ID: ${bookId} không?`)) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:3000/admin/delete-book/${bookId}`, {
                method: 'DELETE',
                credentials: 'include' // Thêm "thẻ VIP"
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Xóa sách thành công!');
                loadBooks(); // Tải lại
            } else {
                alert('Lỗi: ' + result.message);
                if (result.message.includes('Admin')) {
                    window.location.href = 'login.html';
                }
            }
        } catch (error) {
            alert('Lỗi kết nối.');
        }
    }
    
    bookListDiv.addEventListener('click', handleDeleteClick);

    // --- CHẠY LẦN ĐẦU ---
    loadBooks(); // Tải sách khi mở trang
    switchTab('books'); // Đảm bảo tab sách là active
});