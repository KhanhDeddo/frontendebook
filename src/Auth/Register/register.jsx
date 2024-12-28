import React, { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { createUser, fetchListUser} from "../../Api/apiManageUser";
import { sendMail } from "../../Api/apiSendMail";
import { ROUTER } from "../../Routers/router";
import { createCart } from "../../Api/apiManageCart";
import Notification from "../../Components/User/Notification/notification";

const RegisterPage = () => {
  const navigate = useNavigate();
  // State để lưu thông tin form
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    user_date_of_birth: "",
    user_address: "",
    user_phone: "",
    user_gender: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái gửi form
  const [error, setError] = useState(null); // Lưu lỗi nếu có
  const [success, setSuccess] = useState(null); // Lưu thông báo thành công

  // Hàm kiểm tra email hợp lệ
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Hàm kiểm tra số điện thoại hợp lệ
  const isValidPhone = (phone) => /^[0-9]{10,11}$/.test(phone);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    setSuccess(null);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createCartForUser = async () => {
    try {
        const listUser = await fetchListUser();
        const user = listUser[listUser.length-1]
        await createCart({user_id:user.user_id});
    } catch (error) {
      alert(`Lỗi create giỏ hàng: ${error.message}`);
      console.error("Lỗi create giỏ hàng:", error);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Kiểm tra đầu vào trước khi gửi
    if (!isValidEmail(formData.user_email)) {
      setError("Email không hợp lệ.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidPhone(formData.user_phone)) {
      setError("Số điện thoại phải gồm 10-11 chữ số.");
      setIsSubmitting(false);
      return;
    }

    if (formData.user_password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setIsSubmitting(false);
      return;
    }
    try {
      // POST request
      await sendMail(formData.user_email)
      await createUser(formData);
      setSuccess("Đăng ký thành công! \nThông báo đã được gửi đến email của bạn.");
      setFormData({
        user_name: "",
        user_email: "",
        user_password: "",
        user_date_of_birth: "",
        user_address: "",
        user_phone: "",
        user_gender: "",
      });
      createCartForUser()
      navigate(ROUTER.USER.LOGIN)
    } catch (err) {
      setError(err.response?.data?.error || "Đăng ký thất bại! Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
      
    }
  };

  return (
    <div className="body">
      <div className="register-container">
        <div className="register-image">
          <img
            src="https://i.pinimg.com/564x/2b/c5/1b/2bc51bedd7c40a78647655ebca148d56.jpg"
            alt="Books"
          />
        </div>
        <div className="register-form">
          <h2 className="register-title">
            <Link to="/">Ebook</Link>
          </h2>
          <h3>Đăng ký</h3>
          <form onSubmit={handleSubmit}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleInputChange}
              placeholder="Nhập email"
              required
            />

            <label>Số điện thoại</label>
            <input
              type="text"
              name="user_phone"
              value={formData.user_phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              required
            />

            <label>Mật khẩu</label>
            <input
              type="password"
              name="user_password"
              value={formData.user_password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              required
            />

            <label>Ngày sinh *</label>
            <input
              type="date"
              name="user_date_of_birth"
              value={formData.user_date_of_birth}
              onChange={handleInputChange}
              required
            />

            <label>Địa chỉ</label>
            <input
              type="text"
              name="user_address"
              value={formData.user_address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ"
              required
            />

            <div className="gender-options">
              <label>Giới tính: </label>
              <label>
                <input
                  type="radio"
                  name="user_gender"
                  value="Nam"
                  checked={formData.user_gender === "Nam"}
                  onChange={handleInputChange}
                  required
                />{" "}
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="user_gender"
                  value="Nữ"
                  checked={formData.user_gender === "Nữ"}
                  onChange={handleInputChange}
                  required
                />{" "}
                Nữ
              </label>
            </div>

            <button type="submit" className="register-button" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Đăng ký"}
            </button>
          </form>
          {error && <p className="error-message">{Notification("Đăng ký không thành công, vui lòng thử lại !")}</p>}
          {success && <p className="success-message">{Notification(success)}</p>}

          <p className="login-link">
            Bạn đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
