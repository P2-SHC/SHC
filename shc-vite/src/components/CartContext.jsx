import React, { createContext, useState, useEffect, useContext } from 'react';
import { ProductContext } from './ProductContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const { getStock } = useContext(ProductContext);
    
    // 1. localStorage에서 장바구니 데이터 로드
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('shc_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. 장바구니 변경 시 localStorage 동기화
    useEffect(() => {
        localStorage.setItem('shc_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * 장바구니에 상품 추가
     * @param {object} product - 추가할 상품 객체
     * @param {number} quantity - 추가할 수량
     */
    const addToCart = (product, quantity) => {
        const currentStock = getStock(product.id);
        
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            const currentCartQty = existingItem ? existingItem.quantity : 0;
            const totalRequestedQty = currentCartQty + quantity;

            // 재고 검증
            if (totalRequestedQty > currentStock) {
                alert(`죄송합니다. 재고가 부족합니다. (현재 재고: ${currentStock}개 / 장바구니 담긴 수량: ${currentCartQty}개)`);
                return prevItems;
            }

            if (existingItem) {
                // 이미 있으면 수량 합산
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // 없으면 새로 추가
                return [...prevItems, { ...product, quantity }];
            }
        });
        
        return true; // 성공 시 true 반환
    };

    /**
     * 장바구니에서 특정 상품 제거
     * @param {number} productId 
     */
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    /**
     * 장바구니 내 상품 수량 변경
     * @param {number} productId 
     * @param {number} newQuantity 
     */
    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const currentStock = getStock(productId);
        if (newQuantity > currentStock) {
            alert(`현재 주문 가능한 최대 수량은 ${currentStock}개입니다.`);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    /**
     * 장바구니 비우기
     */
    const clearCart = () => {
        setCartItems([]);
    };

    // 장바구니 총 금액 계산
    const cartTotalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    // 장바구니 총 아이템 개수 계산 (품목 수)
    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateCartQuantity, 
            clearCart,
            cartTotalPrice,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}
