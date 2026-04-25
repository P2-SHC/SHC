import { LocationProvider } from './components/LocationContext.jsx';
import { useState, useContext } from 'react';
import MainPage from './pages/MainPage.jsx';
import BoardDetailPage from './pages/BoardDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import BoardListPage from './pages/BoardListPage.jsx';
import Header from './components/Header.jsx';
import { UserContext } from './components/UserContext.jsx';
import products from './data/product.json'


export default function App() {
  const { currentUser, logout: userLogout } = useContext(UserContext);
  const isLogin = !!currentUser;

  const [page, setPage] = useState("MainPage");
  const [category, setCategory] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [productId, setProductId] = useState("");
  const [from, setFrom] = useState("");
  const [fromPostId, setFromPostId] = useState(null);

  const navigate = (pageName, params = {}) => {
    setPage(pageName);
    setSelectedPostId(params.postId ?? null);
    setCategory(params.category ?? "");
    setProductId(params.productId ?? "");
    setFrom(params.from ?? "");
    setFromPostId(params.fromPostId ?? null);
  }

  const logout = () => {
    userLogout();
    navigate("MainPage");
  }

  const renderPage = () => {
    switch (page) {
      case "MainPage":
        return <MainPage navigate={navigate} />
      case "CartPage":
        return <CartPage navigate={navigate} />
      case "LoginPage":
        return <LoginPage navigate={navigate} />
      case "RegisterPage":
        return <RegisterPage navigate={navigate} />
      case "ProductListPage":
        return <ProductListPage navigate={navigate} />
      case "ProductDetailPage":
        const selectedProduct = products.find((product) => product.id === productId);
        return <ProductDetailPage navigate={navigate} product={selectedProduct} from={from} fromPostId={fromPostId} />
      case "BoardListPage":
        return <BoardListPage navigate={navigate} category={category} />
      case "BoardDetailPage":
        return <BoardDetailPage navigate={navigate} postId={selectedPostId} />
      default: break;
    }
  }

  return (
    <>
      <Header isLogin={isLogin} logout={logout} page={page} category={category} navigate={navigate} />
      <LocationProvider>
        {renderPage()}
      </LocationProvider>
    </>
  );
}
