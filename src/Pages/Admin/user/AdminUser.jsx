import React, { useEffect, useState } from 'react';
import './AdminUser.scss';
import DataTable from "react-data-table-component";
import { fetchListUser } from '../../../Api/apiManageUser';
// import { addProduct, addUser, getProducts, getUsers, updateProduct, updateStatusOrder, updateUser } from '../../../../Api/apiAdmin';

const AdminUser = () => {
    const [listData,setlistData] = useState([]);

	const [search, setSearch] = useState('');

	const [keyTable, setkeyTable] = useState(1);

	const [rowSelected, setrowSelected] = useState({});

	const [showPopup, setshowPopup] = useState(false);

	const loadDataGrid = async(value) => {
		const data = await fetchListUser();
		setlistData(data)
	};

	const [statePopup, setstatePopup] = useState(1);

	const STATE_ADD = 2;

	var dataDetail = {};

	const CONFIRM_STATUS = "Xác nhận";

	useEffect(()=>{
		loadDataGrid(search);
    }, [])

	const columns = [
		{
		  id: 2,
		  name: "Tên người dùng",
		  selector: (row) => row.user_name,
		  reorder: true
		},
		{
			id: 3,
			name: "Email",
			selector: (row) => row.user_email,
			reorder: true
		},
		{
			id: 4,
			name: "Số điện thoại",
			selector: (row) => row.user_phone,
			reorder: true
		},
		{
			id: 5,
			name: "Giới tính",
			selector: (row) => row.user_gender,
			reorder: true
		},
		{
			id: 6,
			name: "Địa chỉ",
			selector: (row) => row.user_address,
			reorder: true
		},
	];


	const list_detail = [
		{
			name: 'Tên người dùng',
			property: 'user_name',
			type: 'text'
		},
		{
			name: 'Email',
			property: 'user_email',
			type: 'text'

		},
		{
			name: 'Số điện thoại',
			property: 'user_phone',
			type: 'text'
		},
		{
			name: 'Giới tính',
			property: 'user_gender',
			type: 'text'
		},
		{
			name: 'Ngày sinh',
			property: 'user_date_of_birth',
			type: 'date'
		},
		{
			name: 'Địa chỉ',
			property: 'user_address',
			type: 'text'
		},
	];


	const paginationComponentOptions = {
		selectAllRowsItem: true,
		selectAllRowsItemText: "ALL"
	};

	const handleSelected = async (row) => {
		console.log(row);
		setrowSelected(row);
		dataDetail = row;
		setshowPopup(true);
		setstatePopup(1);
	}

	// const handleSearch = async (e) => {
	// 	console.log(e.target?.value);
	// 	if(e.target.value) {
	// 		await loadDataGrid(e.target.value);
	// 	}else {
	// 		await loadDataGrid('');
	// 	}
	// 	setkeyTable(keyTable + 1);
	// }

	const formatDate = (dateString) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
	  
		return `${day}/${month}/${year}`;
	}

	// const hanldeConfirm = async () => {
	// 	console.log(rowSelected);
	// 	if (statePopup === STATE_ADD) {
	// 		var res = await addUser(rowSelected);
	// 	}else {
	// 		var res = await updateUser(rowSelected);
	// 	}
	// 	if (res) {
	// 		setshowPopup(false);
	// 		alert('Lưu thành công');
	// 	}else {
	// 		alert('Có lỗi xảy ra');
	// 	}
		
	// }

	const handleAdd = () => {
		setrowSelected({});
		setstatePopup(2);
		setshowPopup(true)
	}

	const handleChange = (event, property) => {
		var value = event.target.value;
		if (property == 'user_is_admin') {
			value = event.target.checked 
		}
		setrowSelected({ ...rowSelected, [property]: value });
	  };

	return (
		<div className=''>
			<div className="home-title">Người dùng</div>
			<div className='header-page'>
				<button onClick={handleAdd}>Thêm mới</button>
				{/* <input placeholder='Tìm kiếm' className='input input-search' onChange={handleSearch} /> */}
			</div>

			<DataTable
				key={keyTable}
				columns={columns}
				data={listData}
				defaultSortFieldId={1}
				pagination
				paginationComponentOptions={paginationComponentOptions}
				onRowDoubleClicked={handleSelected}
			/>
			{showPopup &&
				<div className='popup' >
				<div className="popup-content">
					<div className='header-popup flex-center'>
						<div>Chi tiết người dùng</div>
						<div onClick={() => setshowPopup(false)}>X</div>
					</div>
					<div className='body-popup'>
						{list_detail.map((item, key) => {
							return(<div className='item flex-center' key={key}> 
								<span className='title'>{item.name}:</span>
								<input type={item.type} className='value' value={rowSelected[item.property]}
								onChange={(e) => handleChange(e, item.property)}
								/>
							</div>)
						})}

					</div>
					<div className='footer-popup'>
						{/* <button className='button' onClick={hanldeConfirm}>Lưu</button> */}
					</div>
				</div>
			</div>
			}
		</div>
	);
};

export default AdminUser;
