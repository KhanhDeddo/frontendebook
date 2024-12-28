import React, { useCallback, useEffect, useState } from 'react';
import './AdminProduct.scss';
import DataTable from "react-data-table-component";
// import { addProduct, getProducts, updateProduct} from '../../../../Api/apiAdmin';
import { Space, Switch } from 'antd';
import { addBook, updateBook } from '../../../Api/apiManageBook';
import { fetchListBookAdmin } from '../../../Api/apiHomeAdmin';
import Notification from '../../../Components/User/Notification/notification';

const AdminProduct = () => {
    const [listData,setlistData] = useState([]);
    const [listSearchProduct,setListSearchProduct] = useState([]);
	const [search] = useState('');
	const [keyTable] = useState(1);
	const [rowSelected, setrowSelected] = useState({});
	const [showPopup, setshowPopup] = useState(false);
	const [currentFilter, setCurrentFilter] = useState(""); // Bộ lọc hiện tại
	const [activeButton, setActiveButton] = useState(0); // Index của nút active
	const [checkUpdate, setCheckUpdate] = useState(false);
	const [statePopup, setstatePopup] = useState(1);//Trạng thái updatebookbook hay addbook
	const loadDataGrid = useCallback(
        async (value) => {
            try {
                const data = await fetchListBookAdmin({ search: value });
                const safeData = Array.isArray(data) ? data : [];
    
                // Sắp xếp danh sách theo ngày mới nhất
                const sortedData = safeData.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
    
                setlistData(sortedData); // Cập nhật danh sách gốc
    
                // Áp dụng bộ lọc hiện tại
                const filteredData =
                    currentFilter === ""
                        ? sortedData
                        : sortedData.filter((item) => item.status_book === currentFilter);
    
                setListSearchProduct(filteredData);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setlistData([]);
                setListSearchProduct([]);
            }
        },
        [currentFilter] // Chỉ phụ thuộc vào currentFilter
    );
	
	const handleChangeFilter = (status, index) => {
		setCurrentFilter(status); // Cập nhật bộ lọc hiện tại
		setActiveButton(index);  // Đánh dấu nút đang active
		// Áp dụng bộ lọc ngay sau khi thay đổi
		const filteredData = status === ""
			? listData
			: listData.filter((item) => item.status_book === status);
	
		setListSearchProduct(filteredData); // Cập nhật danh sách hiển thị
	};
	const updateStatus = async(id,status) =>{
		try{
			const data = {status_book : status}
			await updateBook(id,data)
			setCheckUpdate(!checkUpdate)
		}catch(error){}
	}
	useEffect(()=>{
		loadDataGrid(search);
    }, [loadDataGrid, search, checkUpdate])
	
	const columns = [
		{
			id: 1,
			name: "ID",
			selector: (row) => row.id,
			reorder: true
		},
		{
			id: 2,
			name: "Tiêu đề",
			selector: (row) => row.title,
			reorder: true
		},
		{
			id: 3,
			name: "Trạng thái",
			selector: (row) => (
			  <Space direction="vertical">
				<Switch
				  checkedChildren="Đang bán"
				  unCheckedChildren="Ngưng bán"
				  defaultChecked={row.status_book === "Đang bán"}
				  className="custom-switch"
				  onChange={(checked) => {
					const newStatus = checked ? "Đang bán" : "Ngưng bán";
					updateStatus(row.id,newStatus)
					console.log(`Trạng thái mới của sách ID ${row.id}: ${newStatus}`);
				  }}
				/>
			  </Space>
			),
			center: true,
			reorder: true,
		},		  
		{
			id: 5,
			name: "Giá tiền",
			selector: (row) => row.price,
			reorder: true
		},
		{
			id: 6,
			name: "Thể loại",
			selector: (row) => row.category,
			reorder: true
		},
		{
			id: 7,
			name: "Số lượng sách",
			selector: (row) => row.stock_quantity,
			center:true,
			reorder: true
		},
		{
			id: 8,
			name: "Thao tác",
			cell: (row) => (
				<div className="btn-update">
					<button 
						onClick={() => handleEdit(row)}
					>
						Cập nhật
					</button>
				</div>
			),
			center:true,
			reorder: true
		},
	];
	


	const list_detail = [
		{ name: "Tiêu đề", property: "title", type: "text" },
		{ name: "Tác giả", property: "author", type: "text" },
		{ name: "Trạng thái", property: "status_book", type: "text" },
		{ name: "Mô tả", property: "description", type: "text" },
		{ name: "Giá tiền", property: "price", type: "number" },
		{ name: "Link ảnh", property: "image_url", type: "text" },
		{ name: "Thể loại", property: "category", type: "text" },
		{ name: "Lớp", property: "level_class", type: "number" },
		{ name: "Level trường", property: "level_school", type: "text" },
		{ name: "Số lượng sách", property: "stock_quantity", type: "number" },
		{ name: "Người phát hành", property: "publisher", type: "text" },
		{
		  name: "Ngày phát hành",
		  property: "created_at",
		  type: "date",
		  readOnly: true, // Chỉ hiển thị
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
		setstatePopup(1);
	}
	const handleSearch = (e) => {
        const keyword = e.target.value.trim().toLowerCase().replace(/\s+/g, " "); // Chuyển từ khóa tìm kiếm về chữ thường
        if (!keyword) {
            // Nếu không nhập gì, hiển thị toàn bộ dữ liệu
            setListSearchProduct(
                currentFilter === "" 
                    ? listData 
                    : listData.filter((book) => book.status_book === currentFilter)
            );
        } else {
            // Tìm kiếm dựa trên các trường cụ thể (mã đơn hàng, người tạo)
            const filteredData = listData.filter(
                (book) =>
                    String(book.id).toLowerCase().includes(keyword) || // Tìm theo mã đơn hàng
                    book.title.toLowerCase().includes(keyword)   // Tìm theo người tạo
            );
    
            // Áp dụng bộ lọc nếu có
            setListSearchProduct(
                currentFilter === "" 
                    ? filteredData 
                    : filteredData.filter((book) => book.status_book === currentFilter)
            );
        }
    };

	const handleAdd = () => {
		setrowSelected({});
		setstatePopup(2);
		setshowPopup(true)
	}
	const handleEdit = (row) => {
		setrowSelected(row);  // Lưu thông tin hàng được chọn
		setshowPopup(true);   // Hiển thị popup
		setstatePopup(1);     // Đặt trạng thái thành "Sửa"
	};

	const hanldeConfirm = async () => {
		try{
			console.log(rowSelected)
			const { updated_at, ...bookUpdate } = rowSelected;
			if(statePopup === 1){
				await updateBook(bookUpdate.id,bookUpdate)
				Notification(`Cập nhật ${bookUpdate.title} thành công !`)
			}else{
				await addBook(bookUpdate)
				Notification(`Thêm sách ${bookUpdate.title} thành công !`)
			}
			setshowPopup(false)
			setCheckUpdate(!checkUpdate)
		}catch(err){
			Notification(`${err}`)
		}
	}

	const handleChange = (event, property) => {
		setrowSelected({ ...rowSelected, [property]: event.target.value });
	  };
	const menu = [
		{name:"Tất cả",status:""},
		{name:"Đang bán",status:"Đang bán"},
		{name:"Ngưng bán",status:"Ngưng bán"},
	]
	return (
		<div className=''>
			<div className="home-title">Sản phẩm</div>
			<div className='input-btn-products'>
				<input placeholder='Tìm kiếm' className='input input-search' onChange={handleSearch} />
				<button onClick={handleAdd}>Thêm mới</button>
			</div>
			<div className='ad-prd-navbar'>
				{menu.map((item, key_item) => (
					item.name === "Thể loại" || item.name === "Tác giả" ? (
						<select
							// value={}
							// onChange={(e) => setLevelSchoolFilter(e.target.value)} // Cập nhật bộ lọc cấp học
						>
							<option value="">Tất cả</option>
							<option value="Tiểu học">Tiểu học</option>
							<option value="Trung học cơ sở">Trung học cơ sở</option>
							<option value="Trung học phổ thông">Trung học phổ thông</option>
						</select>
					) : (
						<button 
							key={key_item} 
							className={key_item === activeButton ? "active":""} 
							onClick={() => handleChangeFilter(item.status,key_item)}
						>
							{item.name}
						</button>
					)
				))}
			</div>

			<DataTable
				key={keyTable}
				columns={columns}
				data={listSearchProduct}
				defaultSortFieldId={1}
				defaultSortAsc = {false}
				pagination
				paginationComponentOptions={paginationComponentOptions}
				onRowDoubleClicked={handleSelected}
			/>
			{showPopup &&
				<div className='popup' >
				<div className="popup-content">
					<div className='header-popup flex-center'>
						<div>Chi tiết sách</div>
						<div onClick={() => setshowPopup(false)}>X</div>
					</div>
					<div className='body-popup'>
					{list_detail.map((item, key) => {
						return (
						<div className='item flex-center' key={key}>
							<span className='title'>{item.name}:</span>
							{item.readOnly ? (
							<span className='value'>
								{item.type === "date"
								? new Date(rowSelected[item.property]).toLocaleString()
								: rowSelected[item.property] || ""}
							</span>
							) : (
							<input
								type={item.type}
								placeholder={item.name==="Giá tiền"&&"Đơn vị: Nghìn VND"}
								min={item.type==="number"&&0}
								className='value'

								value={rowSelected[item.property] || ""}
								onChange={(e) => handleChange(e, item.property)}
							/>
							)}
						</div>
						);
					})}
					</div>
					<div className='footer-popup'>
						<button onClick={hanldeConfirm}>Lưu</button>
					</div>
				</div>
			</div>
			}
		</div>
	);
};

export default AdminProduct;
