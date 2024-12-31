import React, { useEffect, useState } from "react";
import "./order.scss";
import DataTable from "react-data-table-component";
import { fetchListOrderByUser, fetchListOrderItemByOrderId, updateOrder } from "../../../Api/apiManageOrder";
import NavBar from "../../../Components/User/Navbar/navbar";
import { fetchListBook } from "../../../Api/apiManageBook";

const Orders = () => {
    const [user, setUser] = useState(null);
    const [listOrder, setListOrder] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [keyTable, setKeyTable] = useState(1);
    const [statusOrder, setStatusOrder] = useState(true);
    const [rowSelected, setRowSelected] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [orderDetail, setOrderDetail] = useState([]);
    const [listBook,setListBook] = useState([])

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            const loadDataOrders = async () => {
                try {
                    const data = await fetchListOrderByUser(user.user_id);
                    const datalistbook = await fetchListBook();
                    setListOrder(data);
                    setListBook(datalistbook);
                } catch (err) {
                    console.error(err);
                }
            };
            loadDataOrders();
        }
    }, [user, statusOrder]); // Thêm `statusOrder` vào danh sách phụ thuộc    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setKeyTable(keyTable + 1);
    };

    const handleFilterStatus = (status) => {
        setFilterStatus(status);
        setKeyTable(keyTable + 1);
    };

    const filteredOrders = listOrder
        .filter((order) => {
            const matchesSearchTerm = order.order_id.toString().includes(searchTerm);
            const matchesStatus = filterStatus ? order.status === filterStatus : true;
            return matchesSearchTerm && matchesStatus;
        })
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

        const handleCancel = async (order_id) => {
            const data = {
                status: "Đã hủy",
            };
            try {
                await updateOrder(order_id, data);
                setStatusOrder(!statusOrder); // Thay đổi trạng thái để kích hoạt `useEffect`
            } catch (err) {
                console.error("Error updating order:", err);
            }
        };    
        const handleReOrder = async (order_id) => {
            const data = {
                status: "Chờ xác nhận",
            };
            try {
                await updateOrder(order_id, data);
                setStatusOrder(!statusOrder); // Thay đổi trạng thái để kích hoạt `useEffect`
            } catch (err) {
                console.error("Error updating order:", err);
            }
        }; 
        const handleFinish = async (order_id) => {
            const data = {
                status: "Hoàn thành",
                payment_status: "Đã thanh toán",
            };
            try {
                await updateOrder(order_id, data);
                setStatusOrder(!statusOrder); // Thay đổi trạng thái để kích hoạt `useEffect`
            } catch (err) {
                console.error("Error updating order:", err);
            }
        };            
    const columns = [
        {
            id: 1,
            name: "Mã đơn hàng",
            selector: (row) => row.order_id,
            sortable: true,
        },
        {
            id: 2,
            name: "Ngày đặt đơn",
            selector: (row) => new Date(row.order_date).toLocaleString(),
            sortable: true,
        },
        {
            id: 3,
            name: "Tổng tiền",
            selector: (row) => (`${row.total_price}.000 VND`),
            sortable: true,
        },
        {
            id: 4,
            name: "Trạng thái",
            selector: (row) => row.status,
        },
        {
            id: 5,
            name: "Địa chỉ nhận hàng",
            cell: (row) => (
                <div>
                    <p>{row.shipping_address}</p>
                </div>
            ),
        },
        {
            id: 6,
            name: "Thao tác",
            cell :row => {
                if(row.status === "Chờ xác nhận"){
                    return <button className="cancel-order" onClick={() => handleCancel(row.order_id)}>Hủy</button> 
                }else if(row.status === "Đã hủy"){
                    return <button className="re-order" onClick={() => handleReOrder(row.order_id)}>Đặt lại</button> 
                }else if(row.status === "Đang giao" || row.status === "Hoàn thành" ){
                    return <button 
                                className="finish-order" 
                                disabled={row.status === "Hoàn thành"} 
                                onClick={() => handleFinish(row.order_id)}>
                                Hoàn thành
                            </button>
                }else{
                    return <button className="cancel-order-disabled" disabled>Hủy</button>
                }
            }
        }
        
    ];

    const menu = [
        { name: "Tất cả", status: "" },
        { name: "Chờ xác nhận", status: "Chờ xác nhận" },
        { name: "Đã xác nhận", status: "Đã xác nhận" },
        { name: "Chờ vận chuyển", status: "Chờ vận chuyển" },
        { name: "Đang giao", status: "Đang giao" },
        { name: "Hoàn thành", status: "Hoàn thành" },
        { name: "Đã hủy", status: "Đã hủy" },
    ];

    const paginationComponentOptions = {
        rowsPerPageText: "Số dòng mỗi trang:",
        rangeSeparatorText: "trong",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Tất cả",
    };


   // Lấy chi tiết đơn hàng
       const getDetailOrder = async (orderId) => {
           try {
               const data = await fetchListOrderItemByOrderId(orderId);
               setOrderDetail(data);
           } catch (err) {
               console.error("Lỗi khi tải chi tiết đơn hàng:", err);
           }
       }; 
    // Hàm chọn dòng trong bảng
    const handleSelected = async (row) => {
        setRowSelected(row);
        await getDetailOrder(row.order_id);
        setShowPopup(true);
    };
    const namebook = (item) => {
        const book = listBook.filter((book)=> (book.id === item.book_id))
        return book[0].title;
    }
    return (
        <div className="container">
            <NavBar name="Đơn hàng" />
            {user ? (
                <div className="orders-container">
                    <div className="row">
                        <div className="col-lg-3 navbar-orders">
                            <div className="filter-bar">
                                <input
                                    className="input-search"
                                    placeholder="Tìm kiếm mã đơn hàng"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <ul className="filter-menu">
                                    {menu.map((item, index) => (
                                        <li
                                            key={index}
                                            className={filterStatus === item.status ? "active" : ""}
                                            onClick={() => handleFilterStatus(item.status)}
                                        >
                                            {item.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9 ">
                            <DataTable className="order"
                                key={keyTable}
                                columns={columns}
                                data={filteredOrders}
                                pagination
                                paginationComponentOptions={paginationComponentOptions}
                                defaultSortFieldId={2}
                                defaultSortAsc={false} // Sắp xếp giảm dần
                                onRowDoubleClicked={handleSelected}
                            />
                        </div>
                    </div>
                    <div>
                        {showPopup && (
                            <div className='popup'>
                                <div className="popup-content">
                                    <div className='header-popup flex-center'>
                                        <div>Chi tiết đơn hàng</div>
                                        <div onClick={() => setShowPopup(false)}>X</div>
                                    </div>
                                    <div className='body-popup'>
                                        <div className='item'> Người mua: {rowSelected.user_name}</div>
                                        <div className='item'> Ngày mua: {new Date(rowSelected.created_at).toLocaleString()}</div>
                                        <div className='item'> Người nhận: {rowSelected.recipient_name}</div>
                                        <div className='item'> Số điện thoại nhận: {rowSelected.recipient_phone}</div>
                                        <div className='item'> Phương thức thanh toán: {rowSelected.payment_method}</div>
                                        <div className='item'> Trạng thái thanh toán: {rowSelected.payment_status}</div>
                                        <div className='item'> Địa chỉ nhận: {rowSelected.shipping_address}</div>
                                        <div className='item'> Ngày nhận: 
                                            {rowSelected.status === "Hoàn thành" && new Date(rowSelected.updated_at).toLocaleString()}</div>
                                        <div className='item'>
                                            <b>Danh sách đơn:</b>
                                            <div className='flex'>
                                                <div className='col-detail'>Tên sách</div>
                                                <div className='col-detail'>Số lượng</div>
                                                <div className='col-detail'>Giá tiền</div>
                                                <div className='col-detail'>Tổng tiền</div>
                                            </div>
                                            {Array.isArray(orderDetail) && orderDetail.length > 0 ? (
                                                orderDetail.map((item, index) => (
                                                    <div className='flex' key={index}>
                                                        <div className='col-detail'>{namebook(item)}</div>
                                                        <div className='col-detail'>{item.quantity}</div>
                                                        <div className='col-detail'>{Number(item.price_per_item)}.000 đ</div>
                                                        <div className='col-detail'>{Number(item.total_price)}.000 đ</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>Không có dữ liệu chi tiết đơn hàng.</div>
                                            )}
                                        </div>
                                        <div className='item'> Tổng tiền: {rowSelected.total_price}.000 đ</div>
                                        <div className='item'> Trạng thái: {rowSelected.status}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
            ) : (
                <div>Vui lòng đăng nhập để thực hiện chức năng này....</div>
            )}
        </div>
    );
};

export default Orders;
