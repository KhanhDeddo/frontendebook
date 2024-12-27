import apiClient from './apiClient';

const handleApiError = (error, defaultMessage) => {
  throw new Error(error.response?.data?.error || defaultMessage);
};

// Lấy danh sách đơn hàng
export const fetcListOrder = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy danh sách đơn hàng");
  }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi tạo đơn hàng");
  }
};

// Tạo món hàng trong đơn hàng
export const createOrderItem = async (orderItemData) => {
  try {
    const response = await apiClient.post('/orderitems', orderItemData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi tạo món hàng trong đơn hàng");
  }
};


export const updateOrder = async (order_id,data) => {
  try {
    const response = await apiClient.put(`/orders/${order_id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi update hàng trong đơn hàng");
  }
};

// Hàm lấy danh sách listOrderByUser
export const fetchListOrderByUser = async (user_id) => {
  try {
    const response = await apiClient.get(`/orders/${user_id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi update hàng trong đơn hàng");
  }
};

// Hàm lấy danh sách listOrderItemByOrderId
export const fetchListOrderItemByOrderId = async (order_id) => {
  try {
    const response = await apiClient.get(`/orderitems/${order_id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi update hàng trong đơn hàng");
  }
};
