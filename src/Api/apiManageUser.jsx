import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

// API lấy danh sách user
export const fetchListUser = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// API create user
export const createUser = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/users`,data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// API cập nhật thông tin user
export const updateUserInfor = async (user_id,data) => {
  try {
    const response = await axios.put(`${apiUrl}/users/${user_id}`,data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// API xóa user
export const deleteUser = async (user_id) => {
  try {
    await axios.delete(`${apiUrl}/users/${user_id}`);
    return;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};