import React from 'react';
import './AdminLayout.scss';
import AdminHeader from '../Header/AdminHeader';
import Sidebar from '../Sidebar/Sidebar';

const AdminLayout = ({ children, ...props }) => {
    return (
        <div {...props}>
            <div className="admin-layout">
				<AdminHeader/>
				<div className="admin-main-content">
					<Sidebar />
					<div className="admin-content">
						{children}
					</div>
				</div>
        </div>
        </div>
    );
};

export default AdminLayout;
