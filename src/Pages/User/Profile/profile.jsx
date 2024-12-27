import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import { ROUTER } from "../../../Routers/router";
import NavBar from "../../../Components/User/Navbar/navbar";
import { deleteUser, updateUserInfor } from "../../../Api/apiManageUser";

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
    
            // Chuyển đổi ngày sinh từ format 'Thu, 01 Jan 1985 00:00:00 GMT' thành 'YYYY-MM-DD'
            if (parsedUser.user_date_of_birth) {
                const date = new Date(parsedUser.user_date_of_birth);
                parsedUser.user_date_of_birth = date.toISOString().split('T')[0]; // Chuyển sang định dạng 'YYYY-MM-DD'
            }
    
            setFormData(parsedUser); // Đặt dữ liệu mặc định cho form
        }
    }, []);
    

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate(ROUTER.USER.LOGIN);
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        try {
            await deleteUser(user.user_id);
            alert("Tài khoản đã được xóa!");
            setUser(null);
            navigate(ROUTER.USER.HOME);
            localStorage.removeItem("user");
        } catch (error) {
            console.error("Lỗi khi xóa tài khoản:", error);
            alert("Xóa tài khoản thất bại. Vui lòng thử lại.");
        }
    };

    const handleUpdateInfo = async () => {
        if (!user) return;

        try {
            // Gọi API PUT để cập nhật thông tin
            const response = await updateUserInfor(user.user_id,formData)
            console.log(formData);
            alert("Thông tin tài khoản đã được cập nhật!");
            localStorage.setItem("user", JSON.stringify(response));
            setUser(response);
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            alert("Cập nhật tài khoản thất bại. Vui lòng thử lại.");
            console.log(formData);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Chuyển đổi định dạng ngày sinh
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    };

    return (
        <div className="container">
            <NavBar name="Thông tin tài khoản" />
            <div className="profile-container">
                <div className="profile">
                    <h2>Thông tin tài khoản</h2>
                    {user ? (
                        <div className="profile-details">
                            <div className="profile-section">
                                <span>
                                    <strong>Tên người dùng:</strong> {user.user_name}
                                </span>
                                <span>
                                    <strong>Email:</strong> {user.user_email}
                                </span>
                                <span>
                                    <strong>Số điện thoại:</strong> {user.user_phone}
                                </span>
                            </div>
                            <div className="profile-section">
                                <span>
                                    <strong>Giới tính:</strong> {user.user_gender}
                                </span>
                                <span>
                                    <strong>Ngày sinh:</strong> {formatDate(user.user_date_of_birth)} {/* Chuyển đổi ngày sinh */}
                                </span>
                                <span>
                                    <strong>Địa chỉ:</strong> {user.user_address}
                                </span>
                            </div>
                            <div className="profile-actions">
                                <button
                                    className="update-button"
                                    onClick={() => setIsUpdateModalOpen(true)}
                                >
                                    Cập nhật thông tin
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => setIsDeleteConfirmOpen(true)}
                                >
                                    Xóa tài khoản
                                </button>
                                <button className="logout-button" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="loading-text">Đang tải thông tin...</p>
                    )}
                </div>

                {/* Modal cập nhật thông tin */}
                {isUpdateModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Cập nhật thông tin tài khoản</h3>
                            <form>
                                <label>
                                    Tên người dùng:
                                    <input
                                        type="text"
                                        name="user_name"
                                        value={formData.user_name || ""}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="user_email"
                                        value={formData.user_email || ""}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Số điện thoại:
                                    <input
                                        type="text"
                                        name="user_phone"
                                        value={formData.user_phone || ""}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Giới tính:
                                    <input
                                        type="text"
                                        name="user_gender"
                                        value={formData.user_gender || ""}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Ngày sinh:
                                    <input
                                        type="date"
                                        name="user_date_of_birth"
                                        value={formData.user_date_of_birth || ""}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Địa chỉ:
                                    <input
                                        type="text"
                                        name="user_address"
                                        value={formData.user_address || ""}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="save-button"
                                        onClick={handleUpdateInfo}
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => setIsUpdateModalOpen(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Xác nhận xóa tài khoản */}
                {isDeleteConfirmOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Bạn có chắc chắn muốn xóa tài khoản?</h3>
                            <div className="modal-actions">
                                <button
                                    className="delete-confirm-button"
                                    onClick={handleDeleteAccount}
                                >
                                    Xóa
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
