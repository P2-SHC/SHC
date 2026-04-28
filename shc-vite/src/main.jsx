import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

import { ProductProvider } from './components/ProductContext.jsx';
import { CartProvider } from './components/CartContext.jsx';
import { UserProvider } from './components/UserContext.jsx';
import { FontSizeProvider } from './components/FontSizeContext.jsx';

createRoot(document.getElementById('root')).render(
  <FontSizeProvider>
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  </FontSizeProvider>
);
