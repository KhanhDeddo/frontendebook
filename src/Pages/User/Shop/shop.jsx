import "./shop.scss";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ROUTER } from "../../../Routers/router";
import NavBar from "../../../Components/User/Navbar/navbar";
import { fetchListBook } from "../../../Api/apiManageBook";
import { CardBook } from "../../../Components/User/Card/card";

export const Shop = () => {
  const [books, setBooks] = useState([]); // State lưu danh sách sách
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state?.category || "");
  const [minPrice, setMinPrice] = useState(""); // Giá trị "Từ"
  const [maxPrice, setMaxPrice] = useState(""); // Giá trị "Đến"

  useEffect(() => {
    // Cập nhật searchTerm khi location.state thay đổi
    if (location.state?.category) {
      setSearchTerm(location.state.category.toLowerCase());
    }
  }, [location.state]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchListBook(); // Gọi API lấy dữ liệu sách
        setBooks(data);
      } catch (err) {
        console.error(err); // Xử lý lỗi nếu API thất bại
      }
    };
    loadBooks();
  }, []);

  const handleSearchChange = (e) => {
    // Loại bỏ khoảng trắng thừa và chuyển thành chữ thường
    setSearchTerm(e.target.value.trim().toLowerCase().replace(/\s+/g, " "));
  };
    // // Lọc các sách theo từ khóa tìm kiếm
    // const filteredBooks = books.filter((book) =>
    //   book.title.toLowerCase().includes(searchTerm)
    // );
    const [levelClassFilter, setLevelClassFilter] = useState(""); // Bộ lọc lớp
    const [levelSchoolFilter, setLevelSchoolFilter] = useState(""); // Bộ lọc cấp học
    
    const filteredBooks = books.filter((book) => {
      // Chuẩn hóa từ khóa tìm kiếm
      const normalizedSearchTerm = searchTerm.trim().toLowerCase().replace(/\s+/g, " ");
      
      // Chuẩn hóa dữ liệu sách
      const normalizedTitle = book.title.trim().toLowerCase().replace(/\s+/g, " ");
      const normalizedLevelClass = book.level_class.toString();
      const normalizedLevelSchool = book.level_school.trim().toLowerCase();
    
      // Kiểm tra điều kiện tìm kiếm
      const matchesSearch =
        normalizedTitle.includes(normalizedSearchTerm) || // Tìm kiếm theo tiêu đề
        normalizedLevelClass.includes(normalizedSearchTerm) || // Tìm kiếm theo lớp
        normalizedLevelSchool.includes(normalizedSearchTerm); // Tìm kiếm theo cấp học
    
      // Kiểm tra điều kiện lọc lớp
      const matchesClass =
        levelClassFilter === "" || normalizedLevelClass.includes(levelClassFilter);
    
      // Kiểm tra điều kiện lọc cấp học
      const matchesSchool =
        levelSchoolFilter === "" || normalizedLevelSchool === levelSchoolFilter.trim().toLowerCase();
    
      // Kiểm tra điều kiện lọc giá
      const matchesPrice =
        (minPrice === "" || book.price >= Number(minPrice)) &&
        (maxPrice === "" || book.price <= Number(maxPrice));
    
      // Kết hợp tất cả các điều kiện
      return matchesSearch && matchesClass && matchesSchool && matchesPrice;
    });
    

  return (
    <div className="container">
      <NavBar name="Danh sách sản phẩm" router={ROUTER.USER.PRODUCTS} search={searchTerm} />
      <div className="row products">
        <div className="col-lg-3">
          <div className="sidebar">
            <div className="sidebar-item">
              <h3>Tìm kiếm</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm sách..."
              />
            </div>
            <div className="sidebar-item">
              <h3>Lọc theo lớp</h3>
              <input
                type="text"
                placeholder="Nhập lớp..."
                value={levelClassFilter}
                onChange={(e) => setLevelClassFilter(e.target.value)} // Cập nhật bộ lọc lớp
              />
            </div>
            <div className="sidebar-item">
              <h3>Lọc theo cấp học</h3>
              <select
                value={levelSchoolFilter}
                onChange={(e) => setLevelSchoolFilter(e.target.value)} // Cập nhật bộ lọc cấp học
              >
                <option value="">Tất cả</option>
                <option value="Tiểu học">Tiểu học</option>
                <option value="Trung học cơ sở">Trung học cơ sở</option>
                <option value="Trung học phổ thông">Trung học phổ thông</option>
              </select>
            </div>
            <div className="sidebar-item">
              <h3>Mức giá</h3>
              <div className="price-range-wrap">
                <div>
                  <p>Từ:</p>
                  <input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)} // Lưu giá trị "Từ"
                  />
                </div>
                <div>
                  <p>Đến:</p>
                  <input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)} // Lưu giá trị "Đến"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9 list-products">
          <div>
            <h1>Danh sách sản phẩm</h1>
          </div>
          <div className="render">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <CardBook
                  key={book.id} // ID sách
                  id={book.id}
                  title={book.title}
                  image={book.image_url}
                  price={book.price}
                  width={187}
                  height={350}
                  width_img={"100%"}
                  height_img={260}
                  sizef={14}
                />
              ))
            ) : (
              <p style={{textAlign:"center"}}>Không có sách nào phù hợp với tìm kiếm của bạn.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
