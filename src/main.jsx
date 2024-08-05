import React from 'react';
import ReactDOM from 'react-dom/client';
import { pageRoutes } from './controller/PageController'
import { RouterProvider } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={pageRoutes}/>
  </React.StrictMode>
);