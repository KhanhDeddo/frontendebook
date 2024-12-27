import React, { useEffect, useState } from 'react';
import './AdminStatistics.scss';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchListBook } from '../../../Api/apiManageBook';
import { fetcListOrder } from '../../../Api/apiManageOrder';
import { fetchListUser } from '../../../Api/apiManageUser';
// Đăng ký các thành phần cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminStatistics = () => {
  const [view, setView] = useState("all"); // Trạng thái lọc dữ liệu ("all", "month", "day")
  const [listBook, setListBook] = useState([]);
  const [listOrder, setListOrder] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [listOrderFinish, setListOrderFinish] = useState([]);
  const [listBookDangBan, setListBookDangBan] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm được chọn
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Tháng được chọn
  const [dataYear, setDataYear] = useState([]);
  const [dataMonth, setDataMonth] = useState([]);
  const [dataDay, setDataDay] = useState([]);

  // Load dữ liệu sách và đơn hàng
  useEffect(() => {
    const loadData = async () => {
      const dataBook = await fetchListBook();
      const dataOrder = await fetcListOrder();
      const dataUser = await fetchListUser();
      setListBook(dataBook);
      setListOrder(dataOrder);
      setListUser(dataUser)
    };
    loadData();
  }, []);

  // Lọc đơn hàng "Hoàn thành"
  useEffect(() => {
    setListOrderFinish(
      listOrder.filter((order) => order.status === "Hoàn thành")
    );
    setListBookDangBan(
      listBook.filter((book) => book.status_book === "Đang bán")
    )
  }, [listBook,listOrder]);

  // Lọc dữ liệu theo năm
  // haha
  useEffect(() => {
    const filterOrdersByYear = () => {
      const filteredOrders = listOrderFinish.filter((order) => {
        const orderDate = new Date(order.order_date); // Chuyển đổi order_date thành kiểu Date
        return orderDate.getFullYear() === parseInt(selectedYear); // So khớp năm
      });
      setDataYear(filteredOrders);
    };
    filterOrdersByYear();
  }, [listOrderFinish, selectedYear]);

  // Lọc dữ liệu theo tháng
  useEffect(() => {
    const filterOrdersByMonth = () => {
      const filteredOrders = dataYear.filter((order) => {
        const orderDate = new Date(order.order_date);
        return orderDate.getMonth() + 1 === parseInt(selectedMonth); // So khớp tháng
      });
      setDataMonth(filteredOrders);
    };
    filterOrdersByMonth();
  }, [dataYear, selectedMonth]);

  // Lọc dữ liệu theo ngày
  useEffect(() => {
    const filterOrdersByDay = () => {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Số ngày trong tháng
      const dailyData = Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1; // Ngày 1-31
        const dailyOrders = dataMonth.filter((order) => {
          const orderDate = new Date(order.order_date);
          return orderDate.getDate() === day; // So khớp ngày
        });
        return {
          day: day,
          revenue: dailyOrders.reduce((sum, order) => sum + order.total_price, 0), // Tổng doanh thu
        };
      });
      setDataDay(dailyData);
    };
    filterOrdersByDay();
  }, [dataMonth]);

  const [dataQuarter, setDataQuarter] = useState([]);
  useEffect(() => {
    const calculateQuarterData = () => {
      const quarterlyData = [0, 0, 0, 0]; // Q1, Q2, Q3, Q4
      dataYear.forEach((order) => {
        const orderDate = new Date(order.order_date);
        const month = orderDate.getMonth() + 1;
        const revenue = order.total_price; // Chuyển sang nghìn VND

        if (month >= 1 && month <= 3) quarterlyData[0] += revenue; // Q1
        else if (month >= 4 && month <= 6) quarterlyData[1] += revenue; // Q2
        else if (month >= 7 && month <= 9) quarterlyData[2] += revenue; // Q3
        else if (month >= 10 && month <= 12) quarterlyData[3] += revenue; // Q4
      });
      setDataQuarter(quarterlyData);
    };
    calculateQuarterData();
  }, [dataYear]);
  // Dữ liệu biểu đồ
  const chartData =
    view === "all"
      ? {
          labels: Array.from({ length: 12 }, (_, i) => `${i + 1}`), // Trục X là các tháng
          datasets: [
            {
              label: "Doanh thu (Nghìn VND)",
              data: Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const monthlyOrders = dataYear.filter((order) => {
                  const orderDate = new Date(order.order_date);
                  return orderDate.getMonth() + 1 === month;
                });
                return monthlyOrders.reduce(
                  (sum, order) => sum + order.total_price,
                  0
                ); // Đổi sang nghìn VND
              }),
              backgroundColor: "rgba(4, 0, 255, 0.6)",
              borderColor: "rgba(4, 0, 255, 0.6)",
              borderWidth: 1,
            },
          ],
        }
      : view === "month"
      ? {
          labels: dataDay.map((item) => `${item.day}`), // Trục X là các ngày
          datasets: [
            {
              label: "Doanh thu (Nghìn VND)",
              data: dataDay.map((item) => item.revenue), // Đổi sang nghìn VND
              backgroundColor: "rgba(4, 0, 255, 0.6)",
              borderColor: "rgba(4, 0, 255, 0.6)",
              borderWidth: 1,
            },
          ],
        }
        : view === "quarter"
        ? {
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [
              {
                label: "Doanh thu (Nghìn VND)",
                data: dataQuarter,
                backgroundColor: "rgba(4, 0, 255, 0.6)",
                borderColor: "rgba(4, 0, 255, 0.6)",
                borderWidth: 1,
              },
            ],
          }
        : {};

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        position: "bottom",
        text:
          view === "all"
            ? `Thống kê doanh thu năm ${selectedYear}`
            : view === "month"
            ? `Thống kê doanh thu tháng ${selectedMonth}/${selectedYear}`
            : `Thống kê doanh thu trong ngày`,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Doanh thu (Nghìn VND)",
        },
      },
    },
  };

  return (
    <div className="statistics">
      <div className="row">
        <div className="col-lg-9 bar-chart">
          <Bar data={chartData} options={options} />
        </div>
        <div className="col-lg-3 thong-ke">
          <div className="thong-ke-option">
            <h3>Tổng doanh thu</h3>
            <h2>
              {dataYear.reduce((sum, order) => sum + order.total_price, 0)}.000 đ
            </h2>
          </div>
          <div className="thong-ke-option">
            <h3>Tổng đơn hàng</h3>
            <h2>{listOrder.length}</h2>
          </div>
          <div className="thong-ke-option">
            <h3>Tổng sản phẩm</h3>
            <h2>{listBook.length}</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 button-statistics">
          <div className="btn-stt-option">
            <button onClick={() => setView("all")} className="btn btn-primary">
              Thống kê theo năm
            </button>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              placeholder="Nhập vào năm"
            />
          </div>
          <div className="btn-stt-option">
            <button onClick={() => setView("month")} className="btn btn-secondary">
              Thống kê theo tháng
            </button>
            <input
              type="number"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              placeholder="Nhập vào tháng"
            />
          </div>
          <div className="btn-stt-option">
            <button onClick={() => setView("quarter")} className="btn btn-success">
              Thống kê quý
            </button>
          </div>
        </div>
        <div className='col-lg-9 thong-ke2'>
          <div className="thong-ke-option">
            <h3>Tổng Người dùng</h3>
            <h2>
              {listUser.length}
            </h2>
          </div>
          <div className="thong-ke-option">
            <h3>Tổng đơn hàng thành công</h3>
            <h2>{dataYear.length}</h2>
          </div>
          <div className="thong-ke-option">
            <h3>Tổng sản phẩm đang bán</h3>
            <h2>{listBookDangBan.length}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
