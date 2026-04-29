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
import HealthRecommendPage from './pages/HealthRecommendPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import AlarmPage from './pages/AlarmPage.jsx';
import Header from './components/Header.jsx';
import AlarmNotifier from './components/AlarmNotifier.jsx';
import { UserContext } from './components/UserContext.jsx';
import products from './data/product.json'
import ScrollToTop from './components/ScrollToTop.jsx';


export default function App() {
  const { currentUser, logout: userLogout } = useContext(UserContext);
  const isLogin = !!currentUser;

  const [page, setPage] = useState("MainPage");
  const [weatherIcon, setWeatherIcon] = useState("01d");
  const [category, setCategory] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [productId, setProductId] = useState("");
  const [from, setFrom] = useState("");
  const [fromPostId, setFromPostId] = useState(null);
  const [healthSavedState, setHealthSavedState] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [fromCart, setFromCart] = useState(false);

  const navigate = (pageName, params = {}) => {
    setPage(pageName);
    if (params.postId !== undefined) setSelectedPostId(params.postId);
    if (params.category !== undefined) setCategory(params.category);
    if (params.productId !== undefined) setProductId(params.productId);
    if (pageName !== page) setFrom(params.from ?? page);
    if (params.fromPostId !== undefined) setFromPostId(params.fromPostId);
    if (params.orderItems !== undefined) setOrderItems(params.orderItems);
    if (params.fromCart !== undefined) setFromCart(params.fromCart);
  }

  const logout = async () => {
    await userLogout();
    navigate("MainPage");
  }

  const renderPage = () => {
    switch (page) {
      case "MainPage":
        return <MainPage navigate={navigate} weatherIcon={weatherIcon} onWeatherLoad={setWeatherIcon} />
      case "CartPage":
        return <CartPage navigate={navigate} from={from} category={category} productId={productId} />
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
        return <BoardDetailPage navigate={navigate} postId={selectedPostId} from={from} />
      case "HealthRecommendPage":
        return <HealthRecommendPage navigate={navigate} savedState={healthSavedState} onSaveState={setHealthSavedState} />
      case "CheckoutPage":
        return <CheckoutPage navigate={navigate} orderItems={orderItems} fromCart={fromCart} />
      case "AlarmPage":
        return <AlarmPage navigate={navigate} />
      default: break;
    }
  }

  return (
    <>
      <Header isLogin={isLogin} logout={logout} page={page} category={category} navigate={navigate} weatherIcon={weatherIcon} onWeatherChange={setWeatherIcon} />
      <LocationProvider>
        {renderPage()}
      </LocationProvider>
      <AlarmNotifier />
      {["MainPage", "CartPage", "HealthRecommendPage", "BoardListPage", "BoardDetailPage", "ProductListPage", "ProductDetailPage"].includes(page) && (
        <ScrollToTop />
      )}
    </>
  );
}
