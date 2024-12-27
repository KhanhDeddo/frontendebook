import React from 'react';
import './AdminProfile.scss';

const AdminProfile = () => {
	return (
		<div className="admin-profile-container">
			<div className="profile-content">
				<div className="profile-section">
					<h2 className="section-title">Chi tiết hồ sơ</h2>
					<div className="avatar-container">
						<img src="default-avatar.png" alt="Avatar" className="avatar" />
						<button className="change-avatar-btn">Thay đổi ảnh</button>
					</div>

					<form className="profile-form">
						<div className="form-group">
							<label htmlFor="name">Tên</label>
							<input type="text" id="name" placeholder="Nhập tên" />
						</div>

						<div className="form-group">
							<label htmlFor="phone">Số điện thoại</label>
							<input type="text" id="phone" placeholder="Nhập số điện thoại" />
						</div>

						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input type="email" id="email" placeholder="Nhập email" />
						</div>
					</form>
					<button type="submit" className="save-changes-btn">
						Lưu thay đổi
					</button>
				</div>
				<div className="password-section">
					<h2 className="section-title">Thay đổi mật khẩu</h2>
					<form className="password-form">
						<div className="form-group">
							<label htmlFor="oldPassword">Mật khẩu cũ</label>
							<input
								type="password"
								id="oldPassword"
								placeholder="Nhập mật khẩu cũ"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="newPassword">Mật khẩu mới</label>
							<input
								type="password"
								id="newPassword"
								placeholder="Nhập mật khẩu mới"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
							<input
								type="password"
								id="confirmPassword"
								placeholder="Nhập lại mật khẩu mới"
							/>
						</div>

						<button type="submit" className="save-changes-btn">
							Lưu thay đổi
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AdminProfile;
