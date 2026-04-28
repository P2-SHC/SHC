import { useState, useContext } from 'react';
import { UserContext } from '../components/UserContext.jsx';
import { CartContext } from '../components/CartContext.jsx';
import { ProductContext } from '../components/ProductContext.jsx';
import './CheckoutPage.css';


export default function CheckoutPage({ navigate, orderItems, fromCart }) {
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
    if (!name.trim()) next.name = '이름을 입력해주세요.';
    if (!phone.trim()) next.phone = '연락처를 입력해주세요.';
    if (!address.trim()) next.address = '주소를 입력해주세요.';
    if (!agreed) next.agreed = '구매조건 및 개인정보 처리방침에 동의해주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePayment = () => {
    if (!validate()) return;

    // 재고 사전 검증 (전체 통과 후 차감)
    for (const item of orderItems) {
      const stock = getStock(item.id);
      if (stock < item.quantity) {
        alert(`${item.title}의 재고가 부족합니다. (현재 재고: ${stock}개)`);
        return;
      }
    }

    // 검증 통과 후 일괄 차감
    orderItems.forEach(item => decreaseStock(item.id, item.quantity));

    if (fromCart) {
      orderItems.forEach(item => removeFromCart(item.id));
    }

    alert('결제가 완료되었습니다!');
    navigate('MainPage');
  };

  const PAY_METHODS = [
    { value: 'card',     label: '신용/체크카드' },
    { value: 'transfer', label: '계좌이체' },
    { value: 'kakao',    label: '카카오페이' },
    { value: 'naver',    label: '네이버페이' },
    { value: 'phone',    label: '휴대폰 결제' },
  ];

  const SidebarSummary = () => (
    <div className="co-sidebar-card">
      <h3 className="co-sidebar-title">주문 상품</h3>
      <ul className="co-sidebar-list">
        {orderItems.map(item => (
          <li className="co-sidebar-item" key={item.id}>
            <img className="co-sidebar-img" src={item.image} alt={item.title} />
            <div className="co-sidebar-info">
              <p className="co-sidebar-name">{item.title}</p>
              <p className="co-sidebar-qty">{item.quantity}개</p>
            </div>
            <p className="co-sidebar-price">{(item.price * item.quantity).toLocaleString()}원</p>
          </li>
        ))}
      </ul>
      <div className="co-sidebar-divider" />
      <div className="co-sidebar-row">
        <span>상품 금액</span>
        <span>{totalPrice.toLocaleString()}원</span>
      </div>
      <div className="co-sidebar-row">
        <span>배송비 <span className="co-shipping-note">3만원 이상 무료</span></span>
        <span className={shippingFee === 0 ? 'co-free' : ''}>
          {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
        </span>
      </div>
      <div className="co-sidebar-row co-sidebar-row--total">
        <span>최종 결제 금액</span>
        <span>{totalPrice.toLocaleString()}원</span>
      </div>
      <button className="co-pay-btn" onClick={handlePayment}>
        {totalPrice.toLocaleString()}원 결제하기
      </button>
    </div>
  );

  return (
    <div className="co-page">
      <header className="co-header">
        <h1 className="co-header-title">주문/결제</h1>
      </header>

      <div className="co-body">
        <main className="co-main">

          {/* 배송지 */}
          <section className="co-section">
            <h2 className="co-section-title">배송지</h2>
            <div className="co-card">
              <div className="co-field">
                <label className="co-label">받는 분</label>
                <input
                  className={`co-input${errors.name ? ' co-input--err' : ''}`}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
                {errors.name && <p className="co-err-msg">{errors.name}</p>}
              </div>
              <div className="co-field">
                <label className="co-label">연락처</label>
                <input
                  className={`co-input${errors.phone ? ' co-input--err' : ''}`}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                />
                {errors.phone && <p className="co-err-msg">{errors.phone}</p>}
              </div>
              <div className="co-field">
                <label className="co-label">주소</label>
                <input
                  className={`co-input${errors.address ? ' co-input--err' : ''}`}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="주소를 입력하세요"
                />
                {errors.address && <p className="co-err-msg">{errors.address}</p>}
              </div>
              <div className="co-field">
                <label className="co-label">배송 메모 <span className="co-label-opt">(선택)</span></label>
                <select className="co-input co-select" value={memo} onChange={e => setMemo(e.target.value)}>
                  <option value="">배송 메모를 선택해주세요</option>
                  <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                  <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                  <option value="부재 시 연락 주세요">부재 시 연락 주세요</option>
                  <option value="직접 받겠습니다">직접 받겠습니다</option>
                </select>
              </div>
            </div>
          </section>

          {/* 주문상품 */}
          <section className="co-section">
            <h2 className="co-section-title">주문상품</h2>
            <div className="co-card">
              {orderItems.map(item => (
                <div className="co-product" key={item.id}>
                  <img className="co-product-img" src={item.image} alt={item.title} />
                  <div className="co-product-info">
                    <p className="co-product-name">{item.title}</p>
                    <p className="co-product-qty">{item.quantity}개</p>
                  </div>
                  <p className="co-product-price">{(item.price * item.quantity).toLocaleString()}원</p>
                </div>
              ))}
            </div>
          </section>

          {/* 결제수단 */}
          <section className="co-section">
            <h2 className="co-section-title">결제수단</h2>
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
            <h2 className="co-section-title">최종 확인</h2>
            <div className="co-card">
              <div className="co-confirm-row">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="co-confirm-row">
                <span>배송비 <span className="co-shipping-note">3만원 이상 무료</span></span>
                <span className={shippingFee === 0 ? 'co-free' : ''}>
                  {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>
              <div className="co-confirm-row co-confirm-row--total">
                <span>최종 결제 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <label className={`co-agree${errors.agreed ? ' co-agree--err' : ''}`}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <span>구매조건 및 개인정보 처리방침에 동의합니다 (필수)</span>
              </label>
              {errors.agreed && <p className="co-err-msg">{errors.agreed}</p>}
            </div>
          </section>

          {/* 모바일용 결제 버튼 */}
          <button className="co-pay-btn co-pay-btn--mobile" onClick={handlePayment}>
            {totalPrice.toLocaleString()}원 결제하기
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
