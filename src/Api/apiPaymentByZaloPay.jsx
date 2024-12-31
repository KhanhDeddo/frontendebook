import apiClient from './apiClient';

const handleApiError = (error, defaultMessage) => {
  throw new Error(error.response?.data?.error || defaultMessage);
};

// Lấy danh sách đơn hàng
export const pyamentByZaloPay = async (data) => {
  try {
    const response = await apiClient.post('/create_payment',data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy danh sách đơn hàng");
  }
};