// frontend/load-category.js

async function loadBooksByCategory(categoryName, elementId) {
    const container = document.getElementById(elementId);
    
    if (!container) return; // Không tìm thấy khung thì thôi

    container.innerHTML = '<p class="text-center col-span-full">Đang tải sách từ MySQL...</p>';

    try {
        // 1. GỌI API MỚI CỦA MÌNH
        const response = await fetch(`http://localhost:3000/api/books?category=${encodeURIComponent(categoryName)}`);
        const data = await response.json();

        // 2. LẤY DỮ LIỆU TRỰC TIẾP
        // Vì Backend mới của mình trả thẳng về 1 mảng sách, nên m chỉ cần check data.length là đủ
        if (data && data.length > 0) {
            container.innerHTML = ''; // Xóa chữ đang tải

            data.forEach(book => {
                // 3. SỬA LẠI TÊN CỘT ẢNH CHO KHỚP MYSQL (image_url)
                let imageUrl = book.image_url || 'https://placehold.co/300x450';
                if (imageUrl.startsWith('frontend/')) imageUrl = imageUrl.replace('frontend/', '');

                // Khúc này T GIỮ NGUYÊN 100% HTML CỦA M, không đổi 1 chữ nào để giữ nguyên độ đẹp!
                const html = `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border flex flex-col h-full group">
                        <a href="detail.html?id=${book.id}" class="block h-72 w-full flex items-center justify-center p-4 overflow-hidden">
                            <img src="${imageUrl}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500">
                        </a>
                        <div class="p-4 flex flex-col flex-grow">
                            <h3 class="font-bold text-gray-800 mb-1 line-clamp-2">
                                <a href="detail.html?id=${book.id}">${book.title}</a>
                            </h3>
                            <p class="text-sm text-gray-500 mb-2">${book.author}</p>
                            <div class="mt-auto">
                                <p class="text-lg font-bold text-red-600">${book.price.toLocaleString('vi-VN')}đ</p>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
        } else {
            container.innerHTML = '<p class="text-center col-span-full text-gray-500">Chưa có sách nào trong kho MySQL.</p>';
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="text-center col-span-full text-red-500">Lỗi kết nối Server. Nhớ bật node server.js lên m nhé!</p>';
    }
}