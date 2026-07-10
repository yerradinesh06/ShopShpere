import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartQty, removeFromCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const { userInfo } = useAuth();

  const handleCheckout = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '20px',
        padding: '80px 0'
      }}>
        <div style={{
          background: 'var(--bg-tertiary)',
          padding: '24px',
          borderRadius: '50%',
          color: 'var(--text-muted)'
        }}>
          <ShoppingBag size={48} />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Your Cart is <span className="gradient-text">Empty</span></h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '360px' }}>
          Explore our trending catalog products and add them to your cart to experience premium design layouts.
        </p>
        <Link to="/shop" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '30px' }}>
        Shopping <span className="gradient-text">Cart</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }} className="cart-layout">
        
        {/* Left Side: Cart Items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cartItems.map((item) => (
            <div key={item.product} className="glass-card" style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              border: '1px solid var(--border)'
            }} className="cart-item-row">
              {/* Product Thumbnail */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-tertiary)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Title & Brand */}
              <div style={{ flex: 1, minWidth: '150px' }}>
                <Link to={`/product/${item.product}`} style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }} className="cart-item-title">
                  {item.name}
                </Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Unit Price: ${item.price.toFixed(2)}
                </div>
              </div>

              {/* Quantity Changer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px' }}>
                <button
                  disabled={item.qty <= 1}
                  onClick={() => updateCartQty(item.product, item.qty - 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>{item.qty}</span>
                <button
                  disabled={item.qty >= item.countInStock}
                  onClick={() => updateCartQty(item.product, item.qty + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Price multiplication */}
              <div style={{ fontWeight: 700, fontSize: '1rem', width: '90px', textAlign: 'right', fontFamily: 'var(--font-heading)' }}>
                ${(item.price * item.qty).toFixed(2)}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeFromCart(item.product)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="cart-delete-btn"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <aside className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          height: 'fit-content',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Order Summary</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items Total</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Est. Tax (15%)</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${taxPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping Fee</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {shippingPrice === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            {shippingPrice > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-4px' }}>
                Add ${(150 - itemsPrice).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Total Balance</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '14px', gap: '8px', marginTop: '10px' }}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </aside>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
          .cart-item-row {
            flex-wrap: wrap;
            gap: 15px !important;
          }
        }
        .cart-item-title:hover {
          color: var(--accent) !important;
        }
        .cart-delete-btn:hover {
          color: var(--danger) !important;
          background-color: var(--danger-bg);
        }
      `}</style>
    </div>
  );
};

export default CartPage;
