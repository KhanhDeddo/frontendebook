import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./home.scss";
import { CardBook } from "../../../Components/User/Card/card";
import { fetchListBook } from "../../../Api/apiManageBook";

const Home = () => {
  const [books, setBooks] = useState([]); // State lưu danh sách sách
  const [error, setError] = useState(null); // State xử lý lỗi

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchListBook(); // Gọi API lấy dữ liệu sách
        setBooks(data);
      } catch (err) {
        setError(err.message); // Xử lý lỗi nếu API thất bại
      }
    };
    loadBooks();
  }, []);

  // Responsive setting cho Carousel
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  return (
    <div className="home-page">
      {error ? (
        <div className="error-message">Lỗi: {error}</div> // Hiển thị lỗi nếu có
      ) : (
        <>
          <div className="container slider">
            <div className="title-book">
              <span>Sách mới nổi bật</span>
            </div>
            <Carousel responsive={responsive}>
              {books.map((book) => (
                <CardBook
                  key={book.id} // ID sách
                  id={book.id}
                  title={book.title}
                  image={book.image_url}
                  price={book.price}
                />
              ))}
            </Carousel>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
