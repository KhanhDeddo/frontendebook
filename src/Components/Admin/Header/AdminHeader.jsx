import React from 'react';
import './AdminHeader.scss';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTER } from '../../../Routers/router';
import logo from '../../../Asset/logo.png';

const AdminHeader = () => {
	const navigate = useNavigate();
	const handleLogout = () => {
        localStorage.removeItem("user");
        navigate(ROUTER.USER.LOGIN);
    };
	return (
		<header className="admin-header">
			<div className="header-logo">
							<Link to={ROUTER.ADMIN.HOME}>
								<img src={logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
								EBook
							</Link>
						</div>
			<div>
				<button className="admin-header-button" onClick={handleLogout}>Đăng xuất</button>
			</div>
		</header>
	);
};

export default AdminHeader;
