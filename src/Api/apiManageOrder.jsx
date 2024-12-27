import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;


// Hàm lấy danh sách Order
export const fetcListOrder = async () => {
  try {
    const response = await axios.get(`${apiUrl}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response?.data?.error || "Lỗi không xác định khi fetcListOrder");
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${apiUrl}/orders`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi không xác định khi createOrder");
  }
};


export const createOrderItem = async (orderItemData) => {
  try {
    const response = await axios.post(`${apiUrl}/orderitems`, orderItemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi không xác định khi createOrderItem");
  }
};

