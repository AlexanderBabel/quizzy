import React from 'react';
import ReactDOM from 'react-dom/client';
import { IoProvider } from 'socket.io-react-hook';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <IoProvider>
      <App />
    </IoProvider>
  </React.StrictMode>
);

