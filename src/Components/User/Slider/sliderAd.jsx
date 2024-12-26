import React from 'react';
import Slider from 'react-slick';
import { Image } from 'antd';

export const AuToSlider = ({ arrImages }) => {
    var setttings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Slider {...setttings}>
            {arrImages.map((image, index) => (
                <div key={index}>
                    <Image 
                        src={image} 
                        alt="slider" 
                        preview={false}
                        width="100%" 
                        style={{
                            borderRadius: "10px", // Bo góc 10px
                            width: "100%",        // Chiều rộng 100%
                            height: "385px",      // Chiều cao cố định
                            // objectFit: "cover"    // Giữ tỉ lệ ảnh
                        }}
                    />
                </div>
            ))}
        </Slider>
    );
};
