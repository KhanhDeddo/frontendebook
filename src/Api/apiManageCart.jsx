import apiClient from './apiClient';

const handleApiError = (error, defaultMessage) => {
  throw new Error(error.response?.data?.error || defaultMessage);
};

// API lấy danh sách giỏ hàng
export const fetchListCart = async () =>
  apiClient.get('/carts').then((response) => response.data).catch((error) => {
    handleApiError(error, "Lỗi khi lấy danh sách giỏ hàng");
  });

// API lấy danh sách sản phẩm trong giỏ hàng theo user
export const fetchListCartItemByUser = async (user_id) =>
  apiClient.get(`/carts/${user_id}`).then((response) => response.data).catch((error) => {
    handleApiError(error, "Lỗi khi lấy sản phẩm trong giỏ hàng");
  });

// API tạo giỏ hàng
export const createCart = async (data) =>
  apiClient.post('/carts', data).then((response) => response.data).catch((error) => {
    handleApiError(error, "Lỗi khi tạo giỏ hàng");
  });

// API lấy sản phẩm trong giỏ hàng theo cart_id và book_id
export const fetchCartItemByCartIdAndBookId = async (cart_id, book_id) =>
  apiClient.get(`/cartitems/${cart_id}/${book_id}`).then((response) => response.data).catch((error) => {
    handleApiError(error, "Lỗi khi lấy sản phẩm trong giỏ hàng");
  });

// API cập nhật sản phẩm trong giỏ hàng
export const updateCartItem = async (cart_id, book_id, cartItemData) =>
  apiClient.put(`/cartitems/${cart_id}/${book_id}`, cartItemData)
    .then((response) => response.data).catch((error) => {
      handleApiError(error, "Lỗi khi cập nhật sản phẩm trong giỏ hàng");
    });

// API thêm sản phẩm vào giỏ hàng
export const createCartItem = async (cartItemData) =>
  apiClient.post('/cartitems', cartItemData)
    .then((response) => response.data).catch((error) => {
      handleApiError(error, "Lỗi khi thêm sản phẩm vào giỏ hàng");
    });
