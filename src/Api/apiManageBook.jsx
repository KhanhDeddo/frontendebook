import apiClient from './apiClient';

const handleApiError = (error, defaultMessage) => {
  throw new Error(error.response?.data?.error || defaultMessage);
};

// Lấy danh sách sách
export const fetchListBook = async () => {
  try {
    const response = await apiClient.get('/books');
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy danh sách sách");
  }
};


//  Lấy thông tin chi tiết sách theo ID
export const fetchBookById = async (book_id) => {
  try {
    const response = await apiClient.get(`/books/${book_id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy thông tin sách");
  }
};


export const updateBook = async (book_id,data) => {
  try {
    const response = await apiClient.put(`/books/${book_id}`,data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi cập nhật sách");
  }
};

export const addBook = async (data) => {
  try {
    const response = await apiClient.post(`/books`,data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi thêm sách");
  }
};

