import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

// Hàm lấy danh sách books
export const fetchListBook = async () => {
  try {
    const response = await axios.get(`${apiUrl}/books`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const fetchBookById = async (book_id) => {
  try {
    const response = await axios.get(`${apiUrl}/books/${book_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};
