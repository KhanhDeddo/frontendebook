import axios from 'axios';

// Hàm lấy danh sách books
export const fetchListBook = async () => {
  try {
    const response = await axios.get('https://backendebook.vercel.app/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};