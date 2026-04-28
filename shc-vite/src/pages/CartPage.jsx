import './CartPage.css';
import { useContext, useState } from 'react';
import { CartContext } from '../components/CartContext.jsx';
import { ProductContext } from '../components/ProductContext.jsx';

export default function CartPage({ navigate }) {
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
      alert('주문할 상품을 선택해주세요.');
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
          <h1 className="cart-title">장바구니</h1>
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p className="cart-empty-text">장바구니가 비어있습니다.</p>
            <button className="cart-empty-btn" onClick={() => navigate('ProductListPage')}>
              상품 둘러보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">장바구니</h1>

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
                  <div className="cart-item-price">{item.price.toLocaleString()}원</div>
                  {isOutOfStock && (
                    <div className="cart-item-stock-warn">품절</div>
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
                <div className="cart-item-total">{(item.price * item.quantity).toLocaleString()}원</div>
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
            <span className="cart-summary-label">선택 상품 합계</span>
            <span className="cart-summary-total">{totalPrice.toLocaleString()}원</span>
          </div>
          <button className="cart-submit-btn" onClick={handleOrder}>
            {totalPrice.toLocaleString()}원 주문하기
          </button>
        </div>
      </div>
    </div>
  );
}
