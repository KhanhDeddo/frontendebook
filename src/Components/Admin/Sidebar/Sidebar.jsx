import React from 'react';
import './Sidebar.scss';
import { IoMdHome } from 'react-icons/io';
import { IoCart } from 'react-icons/io5';
import { IoBagCheck } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import {NavLink, useLocation } from 'react-router-dom';
import { AiOutlineBarChart } from 'react-icons/ai';

const Sidebar = () => {
	const { pathname } = useLocation();
	console.log('🚀 ~ Sidebar ~ location:', pathname, pathname === '/admin');

	const sidebarItem = [
		{
			id: 1,
			title: 'Trang chủ',
			icon: <IoMdHome />,
			link: '/admin',
		},
		{
			id: 2,
			title: 'Thống kê',
			icon: <AiOutlineBarChart />,
			link: '/admin/statistics',
		},
		{
			id: 3,
			title: 'Đơn hàng',
			icon: <IoCart />,
			link: '/admin/order',
		},
		{
			id: 4,
			title: 'Sản phẩm',
			icon: <IoBagCheck />,
			link: '/admin/product',
		},
		{
			id: 55,
			title: 'Quản lý người dùng',
			icon: <FaUser />,
			link: '/admin/user',
		},
	];

	return (
		<div className="sidebars">
			<ul className="sidebar-menu">
				{sidebarItem.map((item) => (
					<NavLink
						to={item.link}
						className={({ isActive }) =>
							isActive ? 'sidebar-item active' : 'sidebar-item'
						}
						end={item.link === '/admin'}
					>
						<div className="sidebar-item-icon">{item.icon}</div>
						<div className="sidebar-item-title">{item.title}</div>
					</NavLink>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
