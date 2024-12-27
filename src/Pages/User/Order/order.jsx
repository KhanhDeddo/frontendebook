import React, { useEffect, useState } from "react";
import "./order.scss";
import DataTable from "react-data-table-component";
import { fetchListOrderByUser, updateOrder } from "../../../Api/apiManageOrder";
import NavBar from "../../../Components/User/Navbar/navbar";

const Orders = () => {
    const [user, setUser] = useState(null);
    const [listOrder, setListOrder] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [keyTable, setKeyTable] = useState(1);
    const [statusOrder, setStatusOrder] = useState(true);

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
                    setListOrder(data);
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
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div>Vui lòng đăng nhập để thực hiện chức năng này....</div>
            )}
        </div>
    );
};

export default Orders;
