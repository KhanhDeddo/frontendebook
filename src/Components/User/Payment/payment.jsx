import React, { useState } from 'react';
import axios from 'axios';

function Payment() {
    const [amount, setAmount] = useState(50000); // Ví dụ với số tiền là 50.000 VND
    const [description, setDescription] = useState('Payment for order');
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            // Gửi yêu cầu đến backend để tạo giao dịch ZaloPay
            const response = await axios.post('http://localhost:5000/create_payment', {
                // app_user: 'user123',  // ID người dùng (có thể thay bằng dữ liệu thực tế)
                // amount: amount,  // Số tiền thanh toán
                // description: description,  // Mô tả giao dịch
                // embed_data: {},  // Dữ liệu bổ sung (nếu cần)
                // item: [{}]  // Thông tin sản phẩm hoặc dịch vụ
                
                  app_user: "user123",
                  amount: 50000,
                  description: "Payment for order",
                  embed_data: {},
                  item: [
                      {
                          item_id: "1",
                          name: "Book 1",
                          quantity: 1,
                          price: 50000
                      }
                  ]
              
              
            });

            // Kiểm tra phản hồi và chuyển hướng đến ZaloPay
            const { order_url } = response.data;
            if (order_url) {
                window.location.href = order_url;  // Chuyển hướng người dùng đến trang thanh toán của ZaloPay
            }
        } catch (error) {
            console.error('Payment error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Thanh toán qua ZaloPay</h1>
            <div>
                <label>Số tiền (VND):</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <div>
                <label>Mô tả giao dịch:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button onClick={handlePayment} disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
            </button>
        </div>
    );
}

export default Payment;
