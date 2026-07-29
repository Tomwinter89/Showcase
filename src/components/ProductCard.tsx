import { Button } from './Button';
import './ProductCard.css';

// Shared product image — Unsplash: skincare/lotion bottles on white
export const PRODUCT_IMAGE_URL =
  'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=640&h=480&fit=crop&q=80';

interface ProductCardProps {
  onViewDetails: () => void;
  onCheckStock:  () => void;
}

export function ProductCard({ onViewDetails, onCheckStock }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__image">
        <img
          src={PRODUCT_IMAGE_URL}
          alt="Nivea Rich Nourishing Body Lotion 400mL"
          className="product-card__img"
          loading="lazy"
        />
      </div>
      <div className="product-card__body">
        <p className="product-card__price">$66.99</p>
        <p className="product-card__name">
          Nivea Rich Nourishing Body Lotion 72hr Moisturiser For Dry Skin 400mL
        </p>
        <div className="product-card__actions">
          <Button label="View details" onClick={onViewDetails} />
          <button
            className="product-card__subtle-cta"
            type="button"
            onClick={onCheckStock}
          >
            Check stock
          </button>
        </div>
      </div>
    </article>
  );
}
