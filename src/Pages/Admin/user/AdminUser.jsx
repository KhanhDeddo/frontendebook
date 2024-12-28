import React, { useEffect, useState } from 'react';
import './AdminUser.scss';
import DataTable from "react-data-table-component";
import { fetchListUser } from '../../../Api/apiManageUser';

const AdminUser = () => {
    const [listData,setlistData] = useState([]);
	const [keyTable] = useState(1);
	const [rowSelected, setrowSelected] = useState({});
	const [showPopup, setshowPopup] = useState(false);

	const loadDataGrid = async() => {
		try {
			const data = await fetchListUser();
			setlistData(data)
		} catch (error) {}
	};
	useEffect(()=>{
		loadDataGrid();
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
		setshowPopup(true);
	}
	// const handleAdd = () => {
	// 	setrowSelected({});
	// 	setshowPopup(true)
	// }

	const handleChange = (event, property) => {
		var value = event.target.value;
		if (property === 'user_is_admin') {
			value = event.target.checked 
		}
		setrowSelected({ ...rowSelected, [property]: value });
	  };

	return (
		<div className=''>
			<div className="home-title">Người dùng</div>
			<div className='header-page'>
				{/* <button onClick={handleAdd}>Thêm mới</button> */}
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
				</div>
			</div>
			}
		</div>
	);
};

export default AdminUser;
