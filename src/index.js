import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Thêm Provider
import store from './Redux/store';// Import store từ Redux
import RenderRouter from './Routers/renderRouter';
import './Style/style.scss';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}> {/* Bọc toàn bộ app trong Provider */}
    <BrowserRouter>
      <RenderRouter />
    </BrowserRouter>
  </Provider>
);
