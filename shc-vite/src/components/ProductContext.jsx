import React, { createContext, useState, useEffect } from 'react';
import initialProducts from '../data/product.json';

// 상품 및 재고 관리를 위한 Context 생성
export const ProductContext = createContext();

export function ProductProvider({ children }) {
    // 1. 초기 데이터 로드 (localStorage 확인 -> 없으면 JSON 사용)
    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('shc_products');
        return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    });

    // 2. 상태가 변경될 때마다 localStorage에 저장 (데이터 영속성)
    useEffect(() => {
        localStorage.setItem('shc_products', JSON.stringify(products));
    }, [products]);

    /**
     * 재고 차감 함수 (Transaction-safe)
     * @param {number} productId - 상품 ID
     * @param {number} amount - 차감할 수량
     * @returns {boolean} - 성공 여부
     */
    const decreaseStock = (productId, amount) => {
        let success = false;

        setProducts(prevProducts => {
            const newProducts = prevProducts.map(product => {
                if (product.id === productId) {
                    // 재고 확인
                    if (product.quantity >= amount) {
                        success = true;
                        return { ...product, quantity: product.quantity - amount };
                    } else {
                        alert(`재고가 부족합니다. (현재 재고: ${product.quantity}개)`);
                        return product;
                    }
                }
                return product;
            });
            return newProducts;
        });

        return success;
    };

    /**
     * 특정 상품의 실시간 재고 확인 함수
     * @param {number} productId 
     */
    const getStock = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.quantity : 0;
    };

    return (
        <ProductContext.Provider value={{ products, decreaseStock, getStock }}>
            {children}
        </ProductContext.Provider>
    );
}
