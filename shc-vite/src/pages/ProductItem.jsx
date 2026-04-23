import React from 'react'
import Badge from '../components/Badge'

function ProductItem({ product, navigate }) {
    return (
        <div>
            <button className="product-list-card" onClick={() => { navigate("ProductDetailPage", "", product.id) }}>
                <div className="product-list-card__img">🍃</div>
                <p className="product-list-card__category">{product.keyword.join(", ")}</p>
                <p className="product-list-card__name">{product.title}</p>
                <div className="product-list-card__footer">
                    <span className="product-list-card__price">{product.price.toLocaleString()}원</span>
                    <Badge />
                </div>
            </button>
        </div>
    )
}

export default ProductItem