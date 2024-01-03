import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import store from './Redux/store.ts';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={5000}                
        closeOnClick        
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />            
    </Provider >
  </React.StrictMode>,
)
