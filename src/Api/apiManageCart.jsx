import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

// API lấy danh sách giỏ hàng
export const fetchListCart = async () => {
  try {
    const response = await axios.get(`${apiUrl}/carts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// API lấy danh sách sản phẩm trong giỏ hàng theo user
export const fetchListCartItemByUser = async (user_id) => {
  try {
    const response = await axios.get(`${apiUrl}/carts/${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// API tạo giỏ hàng 
export const createCart = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/carts`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi không xác định khi thêm vào giỏ hàng");
  }
};

export const fetchCartItemByCartIdAndBookId = async (cart_id,book_id) => {
  try {
    const response = await axios.get(`${apiUrl}/cartitems/${cart_id}/${book_id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi không xác định khi thêm vào giỏ hàng");
  }
};


export const updateCartItem = async (cart_id,book_id,cartItemData) => {
  try {
    const response = await axios.put(`${apiUrl}/cartitems/${cart_id}/${book_id}`, cartItemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi không xác định khi thêm vào giỏ hàng");
  }
};



export const createCartItem = async (cartItemData) => {
  try {
    const response = await axios.post(`${apiUrl}/cartitems`, cartItemData);
    return response.data; // Trả về dữ liệu phản hồi từ API
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi không xác định khi thêm vào giỏ hàng");
  }
};

