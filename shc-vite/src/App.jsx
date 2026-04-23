import { useState } from 'react';
import MainPage from './pages/MainPage.jsx';
import BoardDetailPage from './pages/BoardDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import BoardListPage from './pages/BoardListPage.jsx';
import Header from './components/Header.jsx';


export default function App() {
  const [page, setPage] = useState("MainPage");
  const [isLogin, setIsLogin] = useState(false);
  const [category, setCategory] = useState("");

  const login = () => { setIsLogin(true); setPage("MainPage"); }
  const logout = () => { setIsLogin(false); setPage("MainPage"); }
  const navigate = (category) => { setCategory(category); setPage("BoardListPage"); }

  const renderPage = () => {
    switch (page) {
      case "MainPage":
        return <MainPage setPage={setPage} />
      case "CartPage":
        return <CartPage setPage={setPage} />
      case "LoginPage":
        return <LoginPage login={login} setPage={setPage} />
      case "RegisterPage":
        return <RegisterPage setPage={setPage} />
      case "ProductListPage":
        return <ProductListPage setPage={setPage} />
      case "ProductDetailPage":
        return <ProductDetailPage setPage={setPage} />
      case "BoardListPage":
        return <BoardListPage navigate={navigate} setPage={setPage} />
      case "BoardDetailPage":
        return <BoardDetailPage setPage={setPage} />
      default: break;
    }
  }

  return (
    <>
      <Header isLogin={isLogin} logout={logout} setPage={setPage} page={page} category={category} navigate={navigate} />
      {renderPage()}
    </>
  );
}
