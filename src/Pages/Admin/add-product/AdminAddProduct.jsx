import React from 'react';
import './AdminAddProduct.scss';

const AdminAddProduct = () => {
	return (
		<div className="admin-add-product-container">
			<h2 className="section-title">Thông tin cơ bản</h2>

			<div className="form-container">
				<div className="form-group">
					<label htmlFor="product-name">Tên sản phẩm</label>
					<input type="text" id="product-name" placeholder="Tên sản phẩm" />
				</div>

				<div className="form-group-container">
					<div className="form-group">
						<label htmlFor="product-price">Giá</label>
						<input type="text" id="product-price" placeholder="Giá" />
					</div>
					<div className="form-group">
						<label htmlFor="product-availability">Khả dụng</label>
						<input
							type="text"
							id="product-availability"
							placeholder="Khả dụng"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="product-category">Danh mục</label>
						<input type="text" id="product-category" placeholder="Danh mục" />
					</div>
				</div>

				<h2 className="section-title">Chi tiết</h2>
				<div className="form-group">
					<label htmlFor="product-description">Mô tả sản phẩm</label>
					<textarea
						id="product-description"
						placeholder="Mô tả sản phẩm"
					></textarea>
				</div>

				<h2 className="section-title">Ảnh</h2>
				<div className="image-upload-container">
					<input type="file" id="product-image" />
					<button className="upload-btn">Chọn ảnh</button>
				</div>

				<div className="form-actions">
					<button className="submit-btn">Lưu sản phẩm</button>
				</div>
			</div>
		</div>
	);
};

export default AdminAddProduct;
