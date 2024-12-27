import React, { useState } from 'react';

const Payment = () => {
    const [amount, setAmount] = useState('');
    const [orderId, setOrderId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const paymentData = {
            amount,
            orderId,
        };

        try {
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = data.paymentUrl; // Redirect to VNPAY
            } else {
                alert("Payment creation failed");
            }
        } catch (error) {
            console.error("Error creating payment:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            <button type="submit">Pay with VNPAY</button>
        </form>
    );
};

export default Payment;
