import apiClient from './apiClient';

const handleApiError = (error, defaultMessage) => {
  throw new Error(error.response?.data?.error || defaultMessage);
};
export const getDashboard = async () => {
  try {
    const response = await apiClient.get('/dashboard');
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy getDashboard");
  }
};
export const getUserRecent = async () => {
  try {
    const response = await apiClient.get('/user-recent');
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy getDashboard");
  }
};
export const getOrderRecent = async () => {
  try {
    const response = await apiClient.get('/order-recent');
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy getDashboard");
  }
};
export const fetchListBookAdmin = async (search) => {
  try {
    const response = await apiClient.post('/adminbook',search);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy danh sách sách admin");
  }
};
export const fetchListOrderAdmin = async (search) => {
  try {
    const response = await apiClient.post('/adminorder',search);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy danh sách sách admin");
  }
};