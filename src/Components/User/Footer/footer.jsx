import { Link } from "react-router-dom"
import "./footer.scss"
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineMail, AiOutlineTwitter } from "react-icons/ai"
const Footer = () => {
    return(
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-mb-6 col-sm-12">
                        <div className="footer-about">
                            <h1 className="footer-about-logo">EBook</h1>
                            <ul>
                                <li>Địa chỉ: Đại Kim, Hoàng Mai, Hà Nội</li>
                                <li>Phone: 0345755059</li>
                                <li>Email: ebook@thanglong.edu.vn</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6 col-mb-6 col-sm-12">
                        <div className="footer-widget">
                            <h3>Cửa hàng</h3>
                            <ul>
                                <li>
                                    <Link to = "">Liên hệ</Link>
                                </li>
                                <li>
                                    <Link to = "">Thông tin về chúng tôi</Link>
                                </li>
                                
                                <li>
                                    <Link to = "">Sản phẩm kinh doanh</Link>
                                </li>
                                
                            </ul>
                            <ul>
                                <li>
                                    <Link to = "">Thông tin tài khoản</Link>
                                </li>
                                <li>
                                    <Link to = "">Giỏ hàng</Link>
                                </li>
                                <li>
                                    <Link to = "">Danh sách ưa thích</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-mb-12 col-sm-12">
                        <div className="footer-widget">
                            <h3>Khuyến mãi & ưu đãi</h3>
                            <p>Đăng ký nhận thông tin tại đây</p>
                            <form action="/">
                                <div className="input-group">
                                    <input input="text" placeholder="Nhập email"/>
                                    <button stype="submit" className="button-submit" >Đăng ký</button>
                                </div>
                                <div className="footer-widget-social">
                                    <div><AiOutlineFacebook/></div>
                                    <div><AiOutlineInstagram/></div>
                                    <div><AiOutlineTwitter/></div>
                                    <div><AiOutlineMail/></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer