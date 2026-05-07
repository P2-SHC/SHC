import { useState, useContext } from 'react';
import { UserContext } from '../components/UserContext.jsx';
import { CartContext } from '../components/CartContext.jsx';
import { ProductContext } from '../components/ProductContext.jsx';
import { useTranslation } from 'react-i18next';
import './CheckoutPage.css';


export default function CheckoutPage({ navigate, orderItems, fromCart }) {
  const { t } = useTranslation();
  const { currentUser } = useContext(UserContext);
  const { removeFromCart } = useContext(CartContext);
  const { decreaseStock, getStock } = useContext(ProductContext);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [memo, setMemo] = useState('');
  const [payMethod, setPayMethod] = useState('card');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = totalPrice >= 30000 ? 0 : 3000;

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = t('checkout.error_name');
    if (!phone.trim()) next.phone = t('checkout.error_phone');
    if (!address.trim()) next.address = t('checkout.error_address');
    if (!agreed) next.agreed = t('checkout.error_agreed');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePayment = () => {
    if (!validate()) return;

    // 재고 사전 검증 (전체 통과 후 차감)
    for (const item of orderItems) {
      const stock = getStock(item.id);
      if (stock < item.quantity) {
        alert(t('checkout.stock_error', { title: item.title, count: stock }));
        return;
      }
    }

    // 검증 통과 후 일괄 차감
    orderItems.forEach(item => decreaseStock(item.id, item.quantity));

    if (fromCart) {
      orderItems.forEach(item => removeFromCart(item.id));
    }

    alert(t('checkout.success_msg'));
    navigate('MainPage');
  };

  const PAY_METHODS = [
    { value: 'card',     label: t('checkout.pay_methods.card') },
    { value: 'transfer', label: t('checkout.pay_methods.transfer') },
    { value: 'kakao',    label: t('checkout.pay_methods.kakao') },
    { value: 'naver',    label: t('checkout.pay_methods.naver') },
    { value: 'phone',    label: t('checkout.pay_methods.phone') },
  ];

  const SidebarSummary = () => (
    <div className="co-sidebar-card">
      <h3 className="co-sidebar-title">{t('checkout.section_items')}</h3>
      <ul className="co-sidebar-list">
        {orderItems.map(item => (
          <li className="co-sidebar-item" key={item.id}>
            <img className="co-sidebar-img" src={item.image} alt={item.title} />
            <div className="co-sidebar-info">
              <p className="co-sidebar-name">{item.title}</p>
              <p className="co-sidebar-qty">{item.quantity}{t('product_detail.qty_unit', '개')}</p>
            </div>
            <p className="co-sidebar-price">{(item.price * item.quantity).toLocaleString()}{t('board.currency')}</p>
          </li>
        ))}
      </ul>
      <div className="co-sidebar-divider" />
      <div className="co-sidebar-row">
        <span>{t('checkout.product_price')}</span>
        <span>{totalPrice.toLocaleString()}{t('board.currency')}</span>
      </div>
      <div className="co-sidebar-row">
        <span>{t('checkout.shipping_fee')} <span className="co-shipping-note">{t('checkout.shipping_free_note')}</span></span>
        <span className={shippingFee === 0 ? 'co-free' : ''}>
          {shippingFee === 0 ? t('checkout.free') : `${shippingFee.toLocaleString()}${t('board.currency')}`}
        </span>
      </div>
      <div className="co-sidebar-row co-sidebar-row--total">
        <span>{t('checkout.final_amount')}</span>
        <span>{(totalPrice + shippingFee).toLocaleString()}{t('board.currency')}</span>
      </div>
      <button className="co-pay-btn" onClick={handlePayment}>
        {t('checkout.pay_btn', { amount: (totalPrice + shippingFee).toLocaleString() })}
      </button>
    </div>
  );

  return (
    <div className="co-page">
      <header className="co-header">
        <h1 className="co-header-title">{t('checkout.title')}</h1>
      </header>

      <div className="co-body">
        <main className="co-main">

          {/* 배송지 */}
          <section className="co-section">
            <h2 className="co-section-title">{t('checkout.section_delivery')}</h2>
            <div className="co-card">
              <div className="co-field">
                <label className="co-label">{t('checkout.label_name')}</label>
                <input
                  className={`co-input${errors.name ? ' co-input--err' : ''}`}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('checkout.placeholder_name')}
                />
                {errors.name && <p className="co-err-msg">{errors.name}</p>}
              </div>
              <div className="co-field">
                <label className="co-label">{t('checkout.label_phone')}</label>
                <input
                  className={`co-input${errors.phone ? ' co-input--err' : ''}`}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={t('checkout.placeholder_phone')}
                />
                {errors.phone && <p className="co-err-msg">{errors.phone}</p>}
              </div>
              <div className="co-field">
                <label className="co-label">{t('checkout.label_address')}</label>
                <input
                  className={`co-input${errors.address ? ' co-input--err' : ''}`}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder={t('checkout.placeholder_address')}
                />
                {errors.address && <p className="co-err-msg">{errors.address}</p>}
              </div>
              <div className="co-field">
                <label className="co-label">{t('checkout.label_memo')} <span className="co-label-opt">{t('checkout.label_opt')}</span></label>
                <select className="co-input co-select" value={memo} onChange={e => setMemo(e.target.value)}>
                  <option value="">{t('checkout.memo_placeholder')}</option>
                  <option value="door">{t('checkout.memo_door')}</option>
                  <option value="office">{t('checkout.memo_office')}</option>
                  <option value="call">{t('checkout.memo_call')}</option>
                  <option value="direct">{t('checkout.memo_direct')}</option>
                </select>
              </div>
            </div>
          </section>

          {/* 주문상품 */}
          <section className="co-section">
            <h2 className="co-section-title">{t('checkout.section_items')}</h2>
            <div className="co-card">
              {orderItems.map(item => (
                <div className="co-product" key={item.id}>
                  <img className="co-product-img" src={item.image} alt={item.title} />
                  <div className="co-product-info">
                    <p className="co-product-name">{item.title}</p>
                    <p className="co-product-qty">{item.quantity}{t('product_detail.qty_unit', '개')}</p>
                  </div>
                  <p className="co-product-price">{(item.price * item.quantity).toLocaleString()}{t('board.currency')}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 결제수단 */}
          <section className="co-section">
            <h2 className="co-section-title">{t('checkout.section_payment')}</h2>
            <div className="co-card">
              <div className="co-pay-methods">
                {PAY_METHODS.map(m => (
                  <label
                    key={m.value}
                    className={`co-pay-method${payMethod === m.value ? ' co-pay-method--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value={m.value}
                      checked={payMethod === m.value}
                      onChange={() => setPayMethod(m.value)}
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* 최종 확인 */}
          <section className="co-section">
            <h2 className="co-section-title">{t('checkout.section_confirm')}</h2>
            <div className="co-card">
              <div className="co-confirm-row">
                <span>{t('checkout.product_price')}</span>
                <span>{totalPrice.toLocaleString()}{t('board.currency')}</span>
              </div>
              <div className="co-confirm-row">
                <span>{t('checkout.shipping_fee')} <span className="co-shipping-note">{t('checkout.shipping_free_note')}</span></span>
                <span className={shippingFee === 0 ? 'co-free' : ''}>
                  {shippingFee === 0 ? t('checkout.free') : `${shippingFee.toLocaleString()}${t('board.currency')}`}
                </span>
              </div>
              <div className="co-confirm-row co-confirm-row--total">
                <span>{t('checkout.final_amount')}</span>
                <span>{(totalPrice + shippingFee).toLocaleString()}{t('board.currency')}</span>
              </div>
              <label className={`co-agree${errors.agreed ? ' co-agree--err' : ''}`}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <span>{t('checkout.agree_text')}</span>
              </label>
              {errors.agreed && <p className="co-err-msg">{errors.agreed}</p>}
            </div>
          </section>

          {/* 모바일용 결제 버튼 */}
          <button className="co-pay-btn co-pay-btn--mobile" onClick={handlePayment}>
            {(totalPrice + shippingFee).toLocaleString()}{t('board.currency')} {t('checkout.pay_btn', { amount: '' }).replace('{{amount}}', '').trim()}
          </button>
        </main>

        {/* 우측 사이드바 */}
        <aside className="co-sidebar">
          <SidebarSummary />
        </aside>
      </div>
    </div>
  );
}
