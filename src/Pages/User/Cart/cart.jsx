import "./cart.scss";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchListBook } from "../../../Api/apiManageBook";
import { fetchListCart, fetchListCartItemByUser, updateCartItem } from "../../../Api/apiManageCart";
import { createOrder, createOrderItem, fetchListOrderByUser} from "../../../Api/apiManageOrder";
import NavBar from "../../../Components/User/Navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../../Redux/dataSlice";
import Notification from "../../../Components/User/Notification/notification";
import { randomOrderIdZalopay } from "../../../Action/randomOrderId";
import { pyamentByZaloPay } from "../../../Api/apiPaymentByZaloPay";

export const CartPage = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [listCartItem, setListCartItem] = useState([]);
  const [error, setError] = useState(null); // State xử lý lỗi
  const [selectAll, setSelectAll] = useState(false); // State cho checkbox "chọn tất cả"
  const [selectedBookIds, setSelectedBookIds] = useState([]); // State cho các book_id được chọn
  const [listBook, setListBook] = useState([]); // State cho các book_id được chọn
  const [payment,setPayment] = useState(false);
  const [changeQuantityCartItem,setChangeQuantityCartItem] = useState(false);
  const [listCart,setListCart] = useState([]);
  const checkDataChange = useSelector((state) => state.data.value); // Lấy state
  const dispatch = useDispatch(); //hàm cập nhật dư liệu :v
 
  // Tính tổng tiền
  const total = selectedBookIds.reduce(
    (sum, item) => sum + Number(item.price_at_purchase),
    0
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Chuyển đổi chuỗi JSON thành đối tượng
    }
  }, [location]);
  
  useEffect(() => {
    if(user){
      const loadListBook = async () => {
        try {
          const data = await fetchListBook();
          const dataListCart = await fetchListCart();
          setListBook(data);
          setListCart(dataListCart)
        } catch (err) {
          setError(err.message);
        }
      };
      loadListBook();
    }
  },[user])
  useEffect(() => {
    if (user) {
      const loadListCart = async () => {
        try {
          const data = await fetchListCartItemByUser(user.user_id); // Gọi API lấy dữ liệu giỏ hàng of user
          setListCartItem(data);
        } catch (err) {
          setError(err.message);
        }
      };
      loadListCart();
    }
  }, [user,changeQuantityCartItem]);

  const deleteCartItem = async (cart_id, book_id) => {
    const apiUrl = `https://backendebook.vercel.app/cartitems/${cart_id}/${book_id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item with id ${book_id}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Delete successful:", result);
      // alert(`Item with id ${book_id} deleted successfully!`);
      dispatch(updateData(!checkDataChange))
      // Cập nhật danh sách giỏ hàng bằng cách loại bỏ item vừa xóa
      setListCartItem((prevList) =>
        prevList.filter((item) => item.book_id !== book_id)
      );
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      Notification(`Error deleting item: ${error.message}`);
    }
  };

  // Xử lý checkbox "chọn tất cả"
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedBookIds(
        listCartItem
        .filter((item) => findBookById(item.book_id).status_book === "Đang bán") // Lọc các item có sách "Đang bán"
        .map((item) => item) // Lấy ra book_id của các sách đó
      );
    } else {
      setSelectedBookIds([]);
    }
  };

  // Xử lý checkbox cho từng mục
  const handleCheckboxChange = (book_id) => {
    setSelectedBookIds((prevSelected) =>
      prevSelected.includes(book_id)
        ? prevSelected.filter((id) => id !== book_id)
        : [...prevSelected, book_id]
    );
  };
  const [order, setOrder] = useState({});
  useEffect(() => {
    if (user) {
      setOrder({
        user_id : user.user_id,
        payment_id_zalopay: randomOrderIdZalopay(),
        recipient_name: user.user_name || "",
        recipient_email: user.user_email || "",
        recipient_phone: user.user_phone || "",
        shipping_address: user.user_address || "",
        payment_method: "",
        total_price: total,
      });
    }
  }, [user,total]);
  
   
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  const findBookById = (book_id) => {
    return listBook.find((book) => book.id === book_id);
  };
  const handConfirm = async () => {
    try {
      const requiredFields = ["recipient_name", "recipient_email", "recipient_phone", "shipping_address", "payment_method"];
        // Kiểm tra từng trường yêu cầu
      for (let field of requiredFields) {
        if (!order[field] || order[field].trim() === "") {
          Notification(`Vui lòng nhập đầy đủ thông tin: ${field.replace(/_/g, " ")}!`);
          return; // Ngừng thực hiện nếu phát hiện trường còn thiếu
        }
      }
      const req = await createOrder(order);
      const getOrderUser = await fetchListOrderByUser(user.user_id);
      const getOrderId = getOrderUser.find(
        (item) => item.payment_id_zalopay === order.payment_id_zalopay
      );
      for (const item of selectedBookIds) {
        const book = {
          order_id: getOrderId.order_id,
          book_id: item.book_id,
          quantity: item.quantity,
          price_per_item: item.price_at_purchase / item.quantity,
          total_price: item.price_at_purchase,
        };
        try {
          await createOrderItem(book);
          await deleteCartItem(item.cart_id, item.book_id);
        } catch (error) {
          console.error(`Failed to process book ${item.book_id}:`, error);
        }
      }
      if (order.payment_method === "Thanh toán bằng ZaloPay") {
        const datapayment = {
          app_user: user.user_name,
          app_trans_id: order.payment_id_zalopay,
          amount: order.total_price,
          description: "Thanh toán đơn hàng",
        };
        const res = await pyamentByZaloPay(datapayment);
        console.log(res);
        if (res.return_message === "Giao dịch thành công") {
          window.location.href = res.order_url;
        } else {
          setError("Thanh toán thất bại! Vui lòng thử lại.");
        }
      }
      Notification("Đơn hàng được đặt thành công.");
      setPayment(false);
      console.log(req);
      console.log(order);
    } catch (error) {
      Notification(`Lỗi khi đặt hàng: ${error.message}`);
      console.error("Lỗi khi đặt hàng:", error);
    }
  };  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form
    const requiredFields = ["recipient_name", "recipient_email", "recipient_phone", "shipping_address", "payment_method"];
    
    // Kiểm tra từng trường yêu cầu
    for (let field of requiredFields) {
      if (!order[field] || order[field].trim() === "") {
        Notification(`Vui lòng nhập đầy đủ thông tin: ${field.replace(/_/g, " ")}!`);
        return; // Ngừng thực hiện nếu phát hiện trường còn thiếu
      }
    }
  
    // Nếu tất cả trường hợp lệ, thực hiện đặt hàng
    handConfirm();
    console.log("Form Data:", order);
  };
  

  const updateQuantityCartItems = async (book_id,newQuantity,new_price_at_purchase) => {
      try{
            // Lọc các giỏ hàng của user
            const cartOfUser = listCart.filter((cart) => cart.user_id === user.user_id);
            console.log(listCart);
            // Kiểm tra xem có giỏ hàng nào cho user không
            if (cartOfUser.length === 0) {
            console.log("No cart found for this user");
            return;
            }
            // Lấy cart_id từ phần tử đầu tiên của mảng cartOfUser
            const cartId = cartOfUser[0].cart_id; // Lấy cart_id của giỏ hàng đầu tiên
          const data = {quantity:newQuantity,price_at_purchase:new_price_at_purchase}
          await updateCartItem(cartId,book_id,data)
          setChangeQuantityCartItem(!changeQuantityCartItem)
      }catch(err){}
  };
  const addQuantity = (book_id,quantityCartItem,book_price) =>{
      updateQuantityCartItems(book_id,quantityCartItem + 1,(quantityCartItem + 1)*book_price)
  }
  const subQuantity = (book_id,quantityCartItem,book_price) =>{
    updateQuantityCartItems(book_id,quantityCartItem-1,(quantityCartItem - 1)*book_price)
  }
  return (
    <div className="container">
      <NavBar name ="Giỏ hàng"/>
      {user?
      <div>
        <div className="row">
        <div className="col-lg-9">
          <div className="row cart-title">
            <div className="col-lg-15">
              <p>Ảnh</p>
            </div>
            <div className="col-lg-15">
              <p>Tên sản phẩm</p>
            </div>
            <div className="col-lg-15">
              <p>Giá</p>
            </div>
            <div className="col-lg-15">
              <p>Số lượng</p>
            </div>
            <div className="col-lg-15">
              <p>Thành tiền</p>
            </div>
            <div className="col-lg-15">
              <p>Trạng thái</p>
            </div>
            <div className="col-lg-15">
              <p>Ngày thêm</p>
            </div>
            <div className="col-lg-15 option">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </div>
          </div>
          {listCartItem.length === 0 ? (
            <p>Giỏ hàng của bạn hiện đang trống.</p>
          ) : (
            <div>
              {listCartItem.map((item) => {
                const book = findBookById(item.book_id);
                if (!book) {
                  return (
                    <div key={item.book_id}>
                      <p>Không tìm thấy thông tin sách cho ID: {item.book_id}</p>
                    </div>
                  );
                }
                return (
                  <div key={item.book_id}>
                    <div className="row cart-item">
                        <div className="col-lg-15 ">
                          <img src={book.image_url} alt={book.title} className="image-book" />
                        </div>
                        <div className="col-lg-15">
                          <p>{book.title}</p>
                        </div>
                        <div className="col-lg-15">
                          <p>{book.price}.000 VND</p>
                        </div>
                        <div className="col-lg-15 control-quantity">
                          <button 
                            disabled = {item.quantity <= 1} 
                            onClick={() => subQuantity(item.book_id,item.quantity,book.price)}
                          >
                              -
                          </button>
                          <p>{item.quantity}</p>
                          <button 
                            disabled = {item.quantity >= book.stock_quantity}
                            onClick={() => addQuantity(item.book_id,item.quantity,book.price)}
                          >
                            +
                          </button>
                        </div>
                        <div className="col-lg-15">
                          <p>{item.price_at_purchase}.000 VND</p>
                        </div>
                        <div className={book.status_book === "Đang bán" ? "col-lg-15 con-hang":"col-lg-15 het-hang"}>
                          <p>{book.status_book}</p>
                        </div>
                        <div className="col-lg-15">
                          <p>{new Date(item.added_at).toLocaleString()}</p>
                        </div>
                        <div className="col-lg-15 option">
                          <button
                            onClick={() => deleteCartItem(item.cart_id, item.book_id)}
                          >
                            Xóa
                          </button>
                          {book.stock_quantity>0 && book.status_book === "Đang bán"?
                            <input
                            type="checkbox"
                            checked={selectedBookIds.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                          />:<div></div>
                          }
                        </div>
                      </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="col-lg-3 control">
          <div>
            <p>Số lượng: {selectedBookIds.length}</p>
            <p>Thành tiền:{total}.000VND</p>
          </div>
          <div className="b">
            {selectedBookIds.length>0?
             <button onClick={() => setPayment(true)}>Đặt hàng</button>
             :<button>Đặt hàng</button>
            }
          </div>
        </div>
      </div>
      {/* Modal cập nhật thông tin */}
      {payment && (
                    <div className="payment">
                        <div className="modal-content">
                            <div className="row">
                              <div className="col-lg-6">
                                <h3>Danh sách mặt hàng</h3>
                                <div>
                                  {selectedBookIds.map((item) => {
                                    const book = findBookById(item.book_id);
                                    if (!book) {
                                      return (
                                        <div key={item.book_id}>
                                          <p>Không tìm thấy thông tin sách cho ID: {item.book_id}</p>
                                        </div>
                                      );
                                    }
                                    return (
                                      <div key={item.book_id}>
                                        <div className="row cart-item-order">
                                            <div className="col-lg-24 ">
                                              <img src={book.image_url} alt={book.title} className="image-book" />
                                            </div>
                                            <div className="col-lg-24">
                                              <p>{book.title}</p>
                                            </div>
                                            <div className="col-lg-24">
                                              <p>{book.price}.000</p>
                                            </div>
                                            <div className="col-lg-24">
                                              <p>{item.quantity}</p>
                                            </div>
                                            <div className="col-lg-24">
                                              <p>{item.price_at_purchase}.000</p>
                                            </div>
                                          </div>
                                      </div>
                                    );
                                  })}
                              </div>
                              </div>
                              <div className="col-lg-6">
                                <h3>Thông tin đặt hàng</h3>
                                <form>
                                    <label>
                                        Tên người nhận:
                                        <input
                                            type="text"
                                            name="recipient_name"
                                            value={order.recipient_name || ""}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Email người nhận:
                                        <input
                                            type="email"
                                            name="recipient_email"
                                            value={order.recipient_email || ""}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Số điện thoại người nhận:
                                        <input
                                            type="text"
                                            name="recipient_phone"
                                            value={order.recipient_phone || ""}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Địa chỉ nhận hàng:
                                        <input
                                            type="text"
                                            name="shipping_address"
                                            value={order.shipping_address || ""}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                      Phương thức thanh toán:
                                      <div className="methods-payment">
                                        <div>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={"Thanh toán bằng ZaloPay"}
                                            onChange={handleInputChange}
                                            checked = {order.payment_method === "Thanh toán bằng ZaloPay"}
                                            required
                                          />
                                          <label>Thanh toán bằng ZaloPay</label>
                                        </div>
                                        <div>
                                          <input
                                            type="radio"
                                            name="payment_method"
                                            value={"Thanh toán khi nhận hàng"}
                                            onChange={handleInputChange}
                                            checked = {order.payment_method === "Thanh toán khi nhận hàng"}
                                            required
                                          />
                                          <label>Thanh toán khi nhận hàng</label>
                                        </div>
                                      </div>
                                    </label>
                                    <label>
                                        <h4>Tổng tiền: {total}.000VND</h4>
                                    </label>
                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={() => setPayment(false)}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="button"
                                            className="ok-button"
                                            onClick={handleSubmit}
                                        >
                                            Xác nhận
                                        </button>
                                    </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                )}
        </div>
        :<div>
          Vui lòng đăng nhập để thực hiện chức năng này....
        </div>
      }
    </div>
  );
};  
