import { useState } from 'react';
import MainPage from './pages/MainPage.jsx';
import BoardDetailPage from './pages/BoardDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import BoardListPage from './pages/BoardListPage.jsx';


export default function App() {
  const [page, setPage] = useState("MainPage");


  const renderPage = () => {
    switch (page) {
      case "MainPage":
        return <MainPage setPage={setPage} />
        break;
      case "CartPage":
        return <CartPage setPage={setPage} />
        break;
      case "LoginPage":
        return <LoginPage setPage={setPage} />
        break;
      case "RegisterPage":
        return <RegisterPage setPage={setPage} />
        break;
      case "ProductListPage":
        return <ProductListPage setPage={setPage} />
        break;
      case "ProductDetailPage":
        return <ProductDetailPage setPage={setPage} />
        break;
      case "BoardListPage":
        return <BoardListPage setPage={setPage} />
        break;
      case "BoardDetailPage":
        return <BoardDetailPage setPage={setPage} />
        break;
      default: break;
    }
  }

  return (
    <>
      {renderPage()}
    </>
  );
}
