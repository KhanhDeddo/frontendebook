import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import  RenderRouter  from './Routers/renderRouter';
import './Style/style.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <RenderRouter/>
  </BrowserRouter>
);
