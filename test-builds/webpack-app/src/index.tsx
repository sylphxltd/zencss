import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import 'silk.css';  // Virtual module → webpack CSS pipeline

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
