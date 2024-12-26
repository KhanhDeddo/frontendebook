import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./card.scss";
import { ROUTER } from "../../../Routers/router";


const { Meta } = Card;

export const CardBook = ({ id, title, image, price,width=210,height=400,sizef=20,width_img=210,height_img=300 }) => {
  const navigate = useNavigate(); // Điều hướng khi nhấn vào CardBook
  const idbook = id
  const handleCardClick = () => {
    const targetUrl = ROUTER.USER.PRODUCTDETAIL.replace(":id", idbook); // Thay :id bằng giá trị thực
    navigate(targetUrl); // Điều hướng đến URL đã thay thế
  };  

  return (
    <Card
      hoverable
      style={{ width: width,height:height }}
      cover={<img alt="book" src={image} width={width_img} height={height_img} />}
      onClick={handleCardClick} // Gắn sự kiện click
    >
      <div className="title" style={{fontSize:sizef}}>
        <Meta title={title}/>
        <span>Giá: 
          <span className="card-price"> {price}.000 VND</span>
        </span>
      </div>
    </Card>
  );
};
