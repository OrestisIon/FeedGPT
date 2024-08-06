import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { MaterialUIControllerProvider } from "context";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MaterialUIControllerProvider>
      <BrowserRouter>
        <App />
        </BrowserRouter>

      </MaterialUIControllerProvider>

  </React.StrictMode>
)
