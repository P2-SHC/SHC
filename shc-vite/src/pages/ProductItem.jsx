import React from 'react'
import Badge from '../components/Badge'

function ProductItem({ product, navigate }) {
    return (
        <div>
            <button className="product-list-card" onClick={() => { navigate("ProductDetailPage") }}>
                <div className="product-list-card__img">🍃</div>
                <p className="product-list-card__category">{product.keyword}</p>
                <p className="product-list-card__name">{product.title}</p>
                <div className="product-list-card__footer">
                    <span className="product-list-card__price">{product.price}원</span>
                    <Badge />
                </div>
            </button>
        </div>
    )
}

export default ProductItem