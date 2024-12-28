import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Thêm Provider
import store from './Redux/store'; // Import store từ Redux
import RenderRouter from './Routers/renderRouter';
import './Style/style.scss';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của Toastify

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <RenderRouter />
      <ToastContainer /> {/* Thêm ToastContainer vào đây */}
    </BrowserRouter>
  </Provider>
);
