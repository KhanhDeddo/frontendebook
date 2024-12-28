import "./header.scss";
import { Link, useLocation } from "react-router-dom";
import { SlUser } from "react-icons/sl";
import { MdOutlineAttachEmail } from "react-icons/md";
import { FaGithub, FaGoogle, FaFacebookMessenger, FaFacebookSquare } from "react-icons/fa";
import { AiOutlineMenu, AiOutlinePhone, AiOutlineShoppingCart } from "react-icons/ai";
import { useEffect, useState } from "react";
import logo from "../../../Asset/logo.png";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "../../../Routers/router";
import { AuToSlider } from "../Slider/sliderAd";
import { fetchListCartItemByUser } from "../../../Api/apiManageCart";



const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Lấy thông tin người dùng từ localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Chuyển đổi chuỗi JSON thành đối tượng
    }
  }, [location]);

  const [searchValue, setSearchValue] = useState("");
  const handleNavigation = (category) => {
    navigate(ROUTER.USER.PRODUCTS, { state:{category} });
  };

  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategory, setIsShowCategory] = useState(isHome);
  useEffect(() => {
    const isHomePage = location.pathname.length <= 1;
    setIsHome(isHomePage);
    setIsShowCategory(isHomePage);
  }, [location]);

  const [menus] = useState([
    {
      name: "Trang chủ",
      path: ROUTER.USER.HOME,
    },
    {
      name: "Cửa hàng",
      path: ROUTER.USER.PRODUCTS,
    },
    {
      name: "Sản phẩm",
      path: "",
      child: [
        { name: "Tiểu học", path: "" },
        { name: "Trung học cơ sở", path: "" },
        { name: "Trung học phổ thông", path: "" },
        { name: "Đại học", path: "" },
      ],
    },
    {
      name: "Đơn hàng",
      path: ROUTER.USER.ORDERS,
    },
    {
      name: "Liên hệ",
      path: "",
    },
  ]);
  const [bookCategory] = useState([{ name: "Ngữ văn"},{ name: "Vật lý"},{ name: "Toán"},
                                   { name: "Lịch sử"},{ name: "Tiếng anh"},{ name: "Địa lý"},
                                   { name: "Hóa học"},{ name: "Hội họa"},{ name: "Âm nhạc"},
                                   { name: "GDCD"},
  ]);
  const sliders = [
    "https://theme.hstatic.net/200000845405/1001223012/14/home_slider_image_2.jpg?v=369",
    "https://theme.hstatic.net/200000845405/1001223012/14/home_slider_image_1.jpg?v=369",
    "https://book365.vn/upload/resize_cache/uf/5f2/950_290_1/u8o6rq84711k2t5i2jnrn4vumfw1xh8v.png",
    "https://bookfun.vn/wp-content/uploads/2024/06/top-10-cuon-sach-hay-nen-doc.png.webp",
  ];


  const [listCartItem, setListCartItem] = useState([]);
  const [error, setError] = useState(null);

  const loadListCartItem = async (userId) => {
    try {
        const data = await fetchListCartItemByUser(userId);
        setListCartItem(data);
    } catch (err) {
        setError(err.message);
    }
};

useEffect(() => {
    if (user) {
        loadListCartItem(user.user_id);
    }
}, [user]);

  const total = listCartItem.reduce(
    (sum, item) => sum + Number(item.price_at_purchase),
    0
  );
  // // Hàm callback để cập nhật giỏ hàng
  // const onCartUpdated = () => {
  //   loadListCart(); // Tải lại danh sách giỏ hàng
  // };
  // // <BookDetails onCartUpdated={onCartUpdated} />

  // Hiển thị lỗi nếu có
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 header-top-left">
              <ul>
                <li>
                  <MdOutlineAttachEmail />
                  <span>ebook@thanglong.edu.vn</span>
                </li>
                <li>
                  <span>Miễn phí ship đơn từ 100000d</span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 header-top-right">
              <ul>
                <li>
                  <Link to={""}>
                    <FaGithub />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <FaFacebookMessenger />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <FaFacebookSquare />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <FaGoogle />
                  </Link>
                </li>
                <li>
                  {user ? (
                    <Link to={ROUTER.USER.PROFILE}>
                      <SlUser />
                      <span>{user.user_name}</span>
                    </Link>
                  ) : (
                    <Link to={ROUTER.USER.LOGIN}>
                      <SlUser />
                      <span>Đăng nhập</span>
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header-logo">
              <Link to={ROUTER.USER.HOME}>
                <img src={logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
                EBook
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <nav className="header-menu">
              <ul>
                {menus.map((menu, key_menu) => (
                  <li key={key_menu} className={key_menu === 0 ? "active" : ""}>
                    <Link to={menu.path}>{menu.name}</Link>
                    {menu.child && (
                      <ul className="header-menu-dropdown">
                        {menu.child.map((childItem, childKey) => (
                          <li key={`${key_menu}-${childKey}`} >
                            <Link to={childItem.path}>{childItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="header-cart">
              <div className="header-cart-price">
                <span>{total}.000 đ</span>
              </div>
              <ul>
                <li>
                  <Link to={ROUTER.USER.SHOPCART} style={{ color: "#1c1c1c" }}>
                    <AiOutlineShoppingCart />
                    <span>{listCartItem.length}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row hero-categories-container">
          <div className="col-lg-3">
            <div className="hero-categories">
              <div className="hero-categories-all" onClick={() => setIsShowCategory(!isShowCategory)}>
                <AiOutlineMenu />
                <span>Danh sách sản phẩm</span>
              </div>
              <ul className={isShowCategory ? "" : "display"}>
                {bookCategory.map((menu, key_menu) => (
                  <li key={key_menu}>
                    <label onClick={() => handleNavigation(menu.name)}>{menu.name}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-search-form">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchValue("")
                  handleNavigation(searchValue);
                }}
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit" className="site-btn">
                  Tìm kiếm
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="hero-search-phone">
              <div className="hero-search-phone-icon">
                <AiOutlinePhone />
              </div>
              <div className="hero-search-phone-text">
                <p>0345.755.059</p>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
        {isHome && (
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-9">
              <div className="hero-search-slider">
                <AuToSlider arrImages={sliders} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
