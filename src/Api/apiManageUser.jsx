import apiClient from './apiClient';

const handleApiError = (error, defaultMessage) => {
  throw new Error(error.response?.data?.error || defaultMessage);
};

// Lấy danh sách người dùng
export const fetchListUser = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy danh sách người dùng");
  }
};

// Tạo mới người dùng
export const createUser = async (data) => {
  try {
    const response = await apiClient.post('/users', data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi tạo người dùng");
  }
};

// Cập nhật thông tin người dùng
export const updateUserInfor = async (user_id, data) => {
  try {
    const response = await apiClient.put(`/users/${user_id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi cập nhật thông tin người dùng");
  }
};

// Xóa người dùng
export const deleteUser = async (user_id) => {
  try {
    await apiClient.delete(`/users/${user_id}`);
    return;
  } catch (error) {
    handleApiError(error, "Lỗi khi xóa người dùng");
  }
};
