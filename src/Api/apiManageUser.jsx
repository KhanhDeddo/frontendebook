import axios from 'axios';

// API lấy danh sách user
export const fetchListUser = async () => {
  try {
    const response = await axios.get('https://backendebook.vercel.app/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// API cập nhật thông tin useruser
export const updateUserInfor = async (user_id,data) => {
  try {
    const response = await axios.put(`https://backendebook.vercel.app/users/${user_id}`,data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};