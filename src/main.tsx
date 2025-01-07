import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './output.css';

console.log('Starting application...'); // Debug log

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
