import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

import { ProductProvider } from './components/ProductContext.jsx';

createRoot(document.getElementById('root')).render(
  <ProductProvider>
    <App />
  </ProductProvider>
);
