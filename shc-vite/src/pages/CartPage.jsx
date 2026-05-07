import './CartPage.css';
import { useContext, useState } from 'react';
import { CartContext } from '../components/CartContext.jsx';
import { ProductContext } from '../components/ProductContext.jsx';
import { useTranslation } from 'react-i18next';

export default function CartPage({ navigate, from, category, productId }) {
  const { t } = useTranslation();
  const { cartItems, removeFromCart, updateCartQuantity } = useContext(CartContext);
  const { decreaseStock, getStock } = useContext(ProductContext);
  const [checkedIds, setCheckedIds] = useState(() => cartItems.map(item => item.id));

  const toggleCheck = (id) => {
    setCheckedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedItems = cartItems.filter(item => checkedIds.includes(item.id));
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = () => {
    if (selectedItems.length === 0) {
      alert(t('cart.select_item_alert'));
      return;
    }
    navigate('CheckoutPage', {
      orderItems: selectedItems,
      fromCart: true,
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <button className="cart-back-btn" onClick={() => {
            if (from === "ProductDetailPage") navigate("ProductDetailPage", { productId: productId });
            else if (from === "BoardListPage") navigate("BoardListPage", { category: category });
            else if (from === "ProductListPage") navigate("ProductListPage");
            else if (from === "HealthRecommendPage") navigate("HealthRecommendPage");
            else if (from === "AlarmPage") navigate("AlarmPage");
            else navigate("MainPage");
          }}>
            {t('cart.back_btn')}
          </button>
          <h1 className="cart-title">{t('cart.title')}</h1>
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p className="cart-empty-text">{t('cart.empty_text')}</p>
            <button className="cart-empty-btn" onClick={() => navigate('ProductListPage')}>
              {t('cart.browse_products')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <button className="cart-back-btn" onClick={() => {
          if (from === "ProductDetailPage") navigate("ProductDetailPage", { productId: productId });
          else if (from === "BoardListPage") navigate("BoardListPage", { category: category });
          else if (from === "ProductListPage") navigate("ProductListPage");
          else if (from === "HealthRecommendPage") navigate("HealthRecommendPage");
          else if (from === "AlarmPage") navigate("AlarmPage");
          else navigate("MainPage");
        }}>
          {t('cart.back_btn')}
        </button>
        <h1 className="cart-title">{t('cart.title')}</h1>

        <div className="cart-list">
          {cartItems.map(item => {
            const stock = getStock(item.id);
            const isOutOfStock = stock <= 0;
            return (
              <div className="cart-item" key={item.id}>
                <input
                  type="checkbox"
                  checked={checkedIds.includes(item.id)}
                  onChange={() => toggleCheck(item.id)}
                  className="cart-item-checkbox"
                />
                <div className="cart-item-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.title}</div>
                  <div className="cart-item-price">{item.price.toLocaleString()}{t('board.currency')}</div>
                  {isOutOfStock && (
                    <div className="cart-item-stock-warn">{t('cart.out_of_stock')}</div>
                  )}
                </div>
                <div className="cart-qty-controls">
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >−</button>
                  <span className="cart-qty-value">{item.quantity}</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= stock}
                  >+</button>
                </div>
                <div className="cart-item-total">{(item.price * item.quantity).toLocaleString()}{t('board.currency')}</div>
                <button className="cart-item-remove" onClick={() => {
                  removeFromCart(item.id);
                  setCheckedIds(prev => prev.filter(id => id !== item.id));
                }}>✕</button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-row">
            <span className="cart-summary-label">{t('cart.summary_label')}</span>
            <span className="cart-summary-total">{totalPrice.toLocaleString()}{t('board.currency')}</span>
          </div>
          <button className="cart-submit-btn" onClick={handleOrder}>
            {t('cart.order_btn', { amount: totalPrice.toLocaleString() })}
          </button>
        </div>
      </div>
    </div>
  );
}
