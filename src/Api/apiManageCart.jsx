import axios from 'axios';

// Hàm lấy danh sách sản phẩm trong giỏ hàng theo user
export const fetchListCartItemByUser = async (user_id) => {
  try {
    const response = await axios.get(`https://backendebook.vercel.app/carts/${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};