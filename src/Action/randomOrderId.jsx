export const randomOrderIdZalopay = () => {
    // Lấy thời gian hiện tại
    const now = new Date();
    // Định dạng ngày thành yymmdd
    const formattedDate = now.toISOString().slice(2, 10).replace(/-/g, ''); // Lấy từ năm thứ 3, bỏ dấu `-`
    // Tạo một số ngẫu nhiên
    const transID = Math.floor(Math.random() * 1000000); // Số ngẫu nhiên từ 0 đến 999999
    // Kết hợp ngày và transID
    const appTransId = `${formattedDate}_${transID}`;
    return appTransId;
};