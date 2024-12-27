import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const sendMail = async (email) => {
  const data = {
    recipient:email,
    subject:"Wellcome to Ebook",
    message:"Bạn đã đăng ký tài khoản thành công tại Ebook !"
  }
  try {
    const response = await axios.post(`${apiUrl}/send-email`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi không xác định");
  }
};

