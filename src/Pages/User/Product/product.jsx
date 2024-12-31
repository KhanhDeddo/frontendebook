import "./product.scss";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import { fetchBookById, fetchListBook } from "../../../Api/apiManageBook";
import {createCartItem, fetchCartItemByCartIdAndBookId, fetchListCart, updateCartItem } from "../../../Api/apiManageCart";
import NavBar from "../../../Components/User/Navbar/navbar";
import { CardBook } from "../../../Components/User/Card/card";
import { createOrder, createOrderItem, fetchListOrderByUser} from "../../../Api/apiManageOrder";
import { useDispatch, useSelector} from "react-redux";
import { updateData } from "../../../Redux/dataSlice";
import Nortification from "../../../Components/User/Notification/notification";
import { pyamentByZaloPay } from "../../../Api/apiPaymentByZaloPay";
import Notification from "../../../Components/User/Notification/notification";
import { randomOrderIdZalopay } from "../../../Action/randomOrderId";


const BookDetails = ({ onCartUpdated }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [cartItem, setCartItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [books, setBooks] = useState([]);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [payment,setPayment] = useState(false);
  const [listCart,setListCart] = useState([]);
  const checkDataChange = useSelector((state) => state.data.value); // Lấy state
  const dispatch = useDispatch(); //hàm cập nhật dư liệu :v

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [location]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataListBook = await fetchListBook();
        const dataListCart = await fetchListCart();
        setBooks(dataListBook);
        setListCart(dataListCart)
      } catch (err) {
        console.error("Error:", err);
      }
    };
    loadData();
  }, []);

  // Gọi API lấy chi tiết sách
  useEffect(() => {
    const loadBookDetails = async () => {
        console.log(id)
      try {
        const data = await fetchBookById(id);
        console.log(data)
        setBook(data);
        setIsOutOfStock(data.status_book!=="Đang bán" || data.stock_quantity < 1);
      } catch (err) {
        console.error("Error fetching book details:", err);
      }
    };
    loadBookDetails();
  }, [id]);

  // Kiểm tra sách có trong giỏ hàng
  const checkBookInCart = useCallback(async () => {
    if (!user) return;
  
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
  
    try {
      // Kiểm tra nếu book đã có trong giỏ hàng
      const response = await fetch(
        `https://backendebook.vercel.app/cartitems/check/${cartId}/${id}`
      );
      
      if (response.ok) {
        const cartData = await fetchCartItemByCartIdAndBookId(cartId, id);
        console.log(cartData)
        setCartItem(cartData);
      } else {
        setCartItem(null);
      }
    } catch (error) {
      console.error("Error checking cart item:", error);
    }
  }, [user, id, listCart]);
  

  useEffect(() => {
    checkBookInCart();
  }, [checkBookInCart]);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "increment" ? prev + 1 : Math.max(prev - 1, 1)));
  };

  // Tính tổng tiền
  const totalPrice = (Number(book?.price || 0) * quantity)

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
        total_price: totalPrice,
      });
    }
  }, [user,totalPrice]);

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
        const getOrderId = getOrderUser.find((item) => item.payment_id_zalopay === order.payment_id_zalopay);
        const bookorder = {
          order_id: getOrderId.order_id,
          book_id: book.id,
          quantity: quantity,
          price_per_item: totalPrice/quantity,
          total_price: totalPrice,
          };
        createOrderItem(bookorder);
        console.log(bookorder) 
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
            Notification("Thanh toán thất bại! Vui lòng thử lại.");
          }
        }
        Notification("Đơn hàng được đặt thành công.");
        setPayment(false);
        console.log(req);
        console.log(order);         
    } catch (error) {
      Nortification(`Lỗi khi order in product: ${error.message}`);
      console.error("Lỗi khi order in product:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handConfirm();
    console.log('Form Data:',order);
  };
  // Thêm hoặc cập nhật sách trong giỏ hàng
  const handleAddCartAction = async () => {
    if (isOutOfStock) {
      Nortification("Sản phẩm đã ngưng bán và không thể thêm vào giỏ hàng.");
      return;
    }
    if (!user) {
      Nortification("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return;
    }

    try {
      if (cartItem) {
        const updatedData = {
          quantity: cartItem.quantity + quantity,
          price_at_purchase: Number(cartItem.price_at_purchase) + Number(book.price) * quantity,
        };
        await updateCartItem(cartItem.cart_id, id, updatedData);
        dispatch(updateData(!checkDataChange))
        Nortification(`Đã thêm ${book.title} vào giỏ hàng!`);
      } else {
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
        const newCartItem = {
          cart_id: cartId,
          book_id: book.id,
          quantity,
          price_at_purchase: Number(book.price) * quantity,
        };
        await createCartItem(newCartItem);
        if (onCartUpdated) {
          onCartUpdated();
        }
        dispatch(updateData(!checkDataChange))
        Nortification(`Đã thêm ${book.title} vào giỏ hàng!`);
      }
      checkBookInCart();
    } catch (error) {
      console.error("Error handling cart action:", error);
      Nortification("Lỗi khi xử lý giỏ hàng. Vui lòng thử lại.");
    }
  };

  // Mua ngay
  const handleBuyAction = () => {
    if (isOutOfStock) {
      Nortification("Sản phẩm đã ngưng bán và không thể mua.");
    } else if (!user) {
      Nortification("Bạn chưa đăng nhập, vui lòng đăng nhập!");
    } else {
      setPayment(true)
    }
  };

  // Responsive setting cho Carousel
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 7 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 5 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 5 },
  };

  if (!book) return <div>Đang tải chi tiết sách...</div>;
  const handleSimilarBookClick = (bookId) => {
    setQuantity(1); // Reset số lượng về 1
    // setError(null); // Reset lỗi (nếu cần)
    // setBook(null); // Reset thông tin sách hiện tại
    // Điều hướng tới URL của sách tương tự
    // window.location.href = `/book-details/${bookId}`;
  };
  

  return (
    <div className="container">
      <NavBar name={"Sản phẩm chi tiết"} search={book.title} />
      <div className="book-details">
        <div className="row">
          <div className="col-lg-3">
            <img src={book.image_url} alt={book.title} className="book-image" />
          </div>
          <div className="col-lg-6">
            <div className="book-infor">
              <h1>{book.title}</h1>
              <p>Thể loại: {book.category}</p>
              <p>Tác giả: {book.author}</p>
              <p>Nhà xuất bản: {book.publisher}</p>
              <p>Giá: {book.price}.000 VND</p>
              <p>Ngày xuất bản: {new Date(book.publication_date).toLocaleDateString()}</p>
              <p>Nhà xuất bản: {book.publisher}</p>
              <p>
                  Số lượng:
                  <span className={book.stock_quantity > 0 ? "" : "het-hang"}>
                    {book.stock_quantity}
                  </span>
              </p>
              <p>
                  Trạng thái:
                  {book.status_book === "Đang bán" ? (
                    <span>{book.status_book}</span>
                  ) : (
                    <span className="het-hang">{book.status_book}</span>
                  )}
                </p>
                <p>Mô tả sách: {book.description}</p>
            </div>
          </div>
          <div className="col-lg-3 pricing">
            <div className="quantity-control">
              <span>Số lượng: </span>
              <div className="input-button">
              <button onClick={() => handleQuantityChange("decrement")}>-</button>
              <input type="text" value={quantity} readOnly />
              <button 
                onClick={() => handleQuantityChange("increment")}
                disabled = {quantity >= book.stock_quantity}
              >+</button>
              </div>
            </div>
            <div>
              <span>Tổng tiền: </span>
              <span className="total-price">{totalPrice}.000 VND</span>
            </div>
            <div className="actions">
              <button className="add-to-cart" onClick={handleAddCartAction}>
                Thêm vào giỏ hàng
              </button>
              <button className="buy-now" onClick={handleBuyAction}>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="similar-books">
        <h2>Sản phẩm tương tự</h2>
        <Carousel responsive={responsive}>
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => handleSimilarBookClick(book.id)}
              style={{ cursor: "pointer" }}
            >
              <CardBook
                id={book.id}
                title={book.title}
                image={book.image_url}
                price={book.price}
                width={160}
                height={290}
                width_img={160}
                height_img={210}
                sizef={14}
              />
            </div>
          ))}
        </Carousel>
        {/* Modal cập nhật thông tin */}
      {payment && (
                    <div className="payment">
                        <div className="modal-content">
                            <div className="row">
                              <div className="col-lg-6">
                                <h3>Danh sách mặt hàng</h3>
                                <div>
                                  {!book?
                                      (
                                        <div key={book.book_id}>
                                          <p>Không tìm thấy thông tin sách cho ID: {book.book_id}</p>
                                        </div>
                                      )
                                    :
                                    (
                                      <div key={book.book_id}>
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
                                              <p>{quantity}</p>
                                            </div>
                                            <div className="col-lg-24">
                                              <p>{Number(totalPrice)}.000</p>
                                            </div>
                                          </div>
                                      </div>
                                    )
                                  }
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
                                        <h4>Tổng tiền: {totalPrice}.000VND</h4>
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
    </div>
  );
};

export default BookDetails;
