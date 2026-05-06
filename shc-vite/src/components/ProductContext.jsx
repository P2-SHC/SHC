import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import koProducts from '../../public/data/product.json';
import enProducts from '../../public/data/productEn.json';
import jaProducts from '../../public/data/productJp.json';

// 상품 및 재고 관리를 위한 Context 생성
export const ProductContext = createContext();

export function ProductProvider({ children }) {
    const { i18n } = useTranslation();

    // 1. 초기 데이터 로드 (언어별 매핑)
    const getInitialProducts = () => {
        const lang = i18n.language.split('-')[0];
        let baseProducts = koProducts;
        if (lang === 'en') baseProducts = enProducts;
        else if (lang === 'ja') baseProducts = jaProducts;

        const savedProducts = localStorage.getItem('shc_products');
        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            // 언어 전환 시 제목/설명 등은 파일 데이터를 따르고, 수량(quantity) 등 상태 정보만 유지
            return baseProducts.map(p => {
                const saved = parsed.find(sp => sp.id === p.id);
                return saved ? { ...p, quantity: saved.quantity } : p;
            });
        }
        return baseProducts;
    };

    const [products, setProducts] = useState(getInitialProducts);

    // 언어 변경 시 제품 정보(텍스트) 업데이트
    useEffect(() => {
        setProducts(getInitialProducts());
    }, [i18n.language]);

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
