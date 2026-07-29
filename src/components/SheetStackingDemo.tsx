import { useEffect, useState } from 'react';
import { Sheet } from './Sheet';
import { Button } from './Button';
import { QuantityStepper } from './QuantityStepper';
import { CART_PRODUCTS, INITIAL_QUANTITIES, PLACEHOLDER_HERO } from '../data/cartProducts';
import './SheetStackingDemo.css';

type StackState = 'condensed' | 'expanded' | null;

const EXPAND_MS = 300;

const money = (value: number) =>
  `$${value.toFixed(2)}`;

export function SheetStackingDemo() {
  const [isCartOpen,      setIsCartOpen]      = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [cartStack,       setCartStack]       = useState<StackState>(null);
  const [quantities,      setQuantities]      = useState<Record<string, number>>(INITIAL_QUANTITIES);

  const isDetailsOpen = activeProductId !== null;

  // Cart condenses behind the product sheet, then expands back on its return.
  useEffect(() => {
    if (isDetailsOpen && isCartOpen) {
      setCartStack('condensed');
    } else if (!isDetailsOpen && cartStack === 'condensed') {
      setCartStack('expanded');
      const t = setTimeout(() => setCartStack(null), EXPAND_MS);
      return () => clearTimeout(t);
    }
  }, [isDetailsOpen, isCartOpen]);

  const closeCart = () => {
    setActiveProductId(null);
    setCartStack(null);
    setIsCartOpen(false);
  };

  // 0 removes the line entirely — the stepper emits it when decrementing past 1.
  const setQuantity = (id: string, next: number) => {
    setQuantities((prev) => {
      if (next <= 0) {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const lines      = CART_PRODUCTS.filter((p) => (quantities[p.id] ?? 0) > 0);
  const itemCount  = lines.reduce((sum, p) => sum + quantities[p.id], 0);
  const cartTotal  = lines.reduce((sum, p) => sum + p.price * quantities[p.id], 0);

  const activeProduct = CART_PRODUCTS.find((p) => p.id === activeProductId) ?? null;
  const activeQty     = activeProductId ? quantities[activeProductId] ?? 0 : 0;

  return (
    <div className="ssd">
      <Button label="View interaction" onClick={() => setIsCartOpen(true)} />

      {/* ── Sheet 1: cart ──────────────────────────────────────────────────── */}
      <Sheet
        isOpen={isCartOpen}
        onClose={closeCart}
        title="Cart"
        stackState={cartStack}
        footer={
          <div className="ssd__cart-footer">
            <div className="ssd__cart-summary">
              <div>
                <p className="ssd__cart-total-label">Est total</p>
                <p className="ssd__cart-total-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
              <p className="ssd__cart-total-value">{money(cartTotal)}</p>
            </div>
            <Button label="Checkout" disabled={lines.length === 0} />
          </div>
        }
      >
        {lines.length === 0 ? (
          <p className="ssd__cart-empty">
            Your cart is empty. Somewhere, a conversion funnel is crying.
          </p>
        ) : (
          <div className="ssd__cart-list">
            {lines.map((product) => {
              const qty = quantities[product.id];
              return (
                <div key={product.id} className="ssd__cart-line">
                  {/* Image and name both open the product sheet — the whole point
                      of the pattern is that neither navigates away from the cart. */}
                  <button
                    className="ssd__cart-media"
                    type="button"
                    onClick={() => setActiveProductId(product.id)}
                    aria-label={`View ${product.name}`}
                    tabIndex={-1}
                  >
                    <span className="ssd__cart-thumb" aria-hidden="true" />
                  </button>

                  <div className="ssd__cart-body">
                    <button
                      className="ssd__cart-name"
                      type="button"
                      onClick={() => setActiveProductId(product.id)}
                    >
                      {product.name}
                    </button>
                    <div className="ssd__cart-row">
                      <QuantityStepper
                        value={qty}
                        size="sm"
                        label={product.name}
                        onChange={(next) => setQuantity(product.id, next)}
                      />
                      <span className="ssd__cart-price">{money(product.price * qty)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Sheet>

      {/* ── Sheet 2: product details, stacked on the cart ──────────────────── */}
      <Sheet
        isOpen={isDetailsOpen}
        onClose={() => setActiveProductId(null)}
        title={activeProduct?.name}
        variant="floating"
        footer={
          activeProduct && (
            activeQty > 0 ? (
              <div className="ssd__details-actions">
                <Button
                  label="Remove"
                  variant="destructive"
                  onClick={() => setQuantity(activeProduct.id, 0)}
                />
                <QuantityStepper
                  value={activeQty}
                  label={activeProduct.name}
                  className="ssd__details-stepper"
                  onChange={(next) => setQuantity(activeProduct.id, next)}
                />
              </div>
            ) : (
              <Button label="Add to cart" onClick={() => setQuantity(activeProduct.id, 1)} />
            )
          )
        }
      >
        {activeProduct && (
          <div className="ssd__details">
            <div className="ssd__hero">
              <img src={PLACEHOLDER_HERO} alt="" className="ssd__hero-img" />
            </div>
            <div className="ssd__details-info">
              <p className="ssd__details-price">{money(activeProduct.price)}</p>
              <p className="ssd__details-name">{activeProduct.name}</p>
              <p className="ssd__details-blurb">{activeProduct.blurb}</p>
              <ul className="ssd__details-features">
                {activeProduct.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="ssd__details-section">
                <h3 className="ssd__details-heading">Instructions</h3>
                <p className="ssd__details-blurb">{activeProduct.instructions}</p>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
