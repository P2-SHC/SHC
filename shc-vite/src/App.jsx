import { useState } from 'react';
import MainPage from './pages/MainPage.jsx';
import BoardListPage from './pages/BoardListPage.jsx';
import BoardDetailPage from './pages/BoardDetailPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  const [page, setPage] = useState(() => ({ name: localStorage.getItem('shc-page') || 'main', params: {} }));
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('shc-logged-in') === 'true');

  const navigate = (name, params = {}) => {
    setPage({ name, params });
    localStorage.setItem('shc-page', name);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const onLogin = (user) => { setIsLoggedIn(true); localStorage.setItem('shc-logged-in', 'true'); navigate('main'); };
  const onLogout = () => { setIsLoggedIn(false); localStorage.removeItem('shc-logged-in'); navigate('main'); };

  const onNavClick = (name) => navigate(name);
  const onPostClick = (post) => navigate('board-detail', { id: post?.id, category: post?.category || 'recipe' });
  const onProductClick = (product) => navigate('product-detail', { id: product?.id });
  const onCartClick = () => navigate('cart');
  const onBack = (fallback) => navigate(typeof fallback === 'string' ? fallback : 'main');

  const common = {
    navigate,
    isLoggedIn,
    onNavClick,
    onPostClick,
    onProductClick,
    onCart: onCartClick,
    onBack,
    onLogout
  };

  switch (page.name) {
    case 'main':
      return <MainPage {...common} />;
    case 'recipe':
    case 'lifestyle':
    case 'exercise':
      return <BoardListPage {...common} category={page.name} />;
    case 'board-detail':
      return <BoardDetailPage {...common} params={page.params} />;
    case 'products':
      return <ProductListPage {...common} />;
    case 'product-detail':
      return <ProductDetailPage {...common} params={page.params} />;
    case 'cart':
      return <CartPage {...common} />;
    case 'login':
      return <LoginPage {...common} onLogin={onLogin} />;
    case 'register':
      return <RegisterPage {...common} onLogin={onLogin} />;
    default:
      return <MainPage {...common} />;
  }
}
