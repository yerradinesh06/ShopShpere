import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth, API_URL } from '../context/AuthContext';
import { CreditCard, Check, ShieldCheck, MapPin, ClipboardList, ArrowLeft, ArrowRight } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, saveShippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { userInfo } = useAuth();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Success animation

  // Step 1: Shipping States
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  // Step 2: Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Order submission states
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) return;
    saveShippingAddress({ address, city, postalCode, country });
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) return;
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setOrderError(null);

    const orderData = {
      orderItems: cartItems,
      shippingAddress: { address, city, postalCode, country },
      paymentMethod: 'Stripe',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();

      if (response.ok) {
        setPlacedOrder(data);
        clearCart();
        setStep(4);
      } else {
        setOrderError(data.message || 'Failed to place order');
      }
    } catch (err) {
      setOrderError('Connection failed. Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper formatting for Card Input
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0', maxWidth: '800px' }}>
      
      {/* Checkout Step indicators */}
      {step < 4 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '50px',
          position: 'relative'
        }}>
          {/* Connector bar */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '10%',
            right: '10%',
            height: '2px',
            backgroundColor: 'var(--border)',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '10%',
            width: step === 1 ? '0%' : step === 2 ? '40%' : '80%',
            height: '2px',
            backgroundColor: 'var(--accent)',
            zIndex: 1,
            transition: 'var(--transition)'
          }} />

          {/* Step 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: step >= 1 ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: step >= 1 ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid var(--border)'
            }}>
              {step > 1 ? <Check size={18} /> : '1'}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Shipping</span>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: step >= 2 ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: step >= 2 ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid var(--border)'
            }}>
              {step > 2 ? <Check size={18} /> : '2'}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Payment</span>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: step >= 3 ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: step >= 3 ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid var(--border)'
            }}>
              3
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Review</span>
          </div>
        </div>
      )}

      {/* STEP 1: Shipping Address Form */}
      {step === 1 && (
        <form onSubmit={handleShippingSubmit} className="glass-card animate-fade-in" style={{ padding: '30px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="var(--accent)" /> Shipping Address
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                required
                placeholder="123 Tech Lane"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  required
                  placeholder="Silicon Valley"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  required
                  placeholder="94025"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                required
                placeholder="United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: 'fit-content', gap: '8px', alignSelf: 'flex-end', marginTop: '10px' }}>
              Continue to Payment <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Payment Info & Mock Credit Card */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Card Mockup Visualizer */}
          <div className="animate-fade-in" style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            color: 'white',
            aspectRatio: '1.586/1',
            width: '100%',
            maxWidth: '380px',
            margin: '0 auto',
            position: 'relative',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '30px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px' }} title="Smart Chip Mock" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 'bold', fontStyle: 'italic', opacity: 0.8 }}>
                ShopSphere Pay
              </span>
            </div>

            {/* Middle Row (Number) */}
            <div style={{
              fontSize: '1.3rem',
              letterSpacing: '3px',
              fontFamily: 'monospace',
              margin: '20px 0'
            }}>
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '2px' }}>Cardholder</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {cardName || 'JOHN DOE'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '2px' }}>Expiry</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                  {cardExpiry || 'MM/YY'}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="glass-card" style={{ padding: '30px', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={22} color="var(--accent)" /> Credit Card Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Expiration Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV Code</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ gap: '6px' }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn-primary" style={{ gap: '6px' }}>
                  Review Order <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Review Order Items & Prices */}
      {step === 3 && (
        <div className="glass-card animate-fade-in" style={{ padding: '30px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={22} color="var(--accent)" /> Review Your Order
          </h2>

          {orderError && (
            <div className="glass-panel badge-danger" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', border: '1px solid var(--danger)' }}>
              {orderError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Shipping Summary */}
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px', color: 'var(--text-primary)' }}>Shipping Destination</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {address}, {city}, {postalCode}, {country}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px', color: 'var(--text-primary)' }}>Payment Method</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Stripe Gateway (Card ending in {cardNumber.substring(cardNumber.length - 4)})
              </p>
            </div>

            {/* Items review */}
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Items Checklist</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item) => (
                  <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>{item.name} <strong style={{ color: 'var(--text-muted)' }}>× {item.qty}</strong></span>
                    <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />

            {/* Balance Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>VAT (15%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '4px' }}>
                <span>Final Total Balance</span>
                <span style={{ fontFamily: 'var(--font-heading)' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button disabled={submitting} type="button" onClick={() => setStep(2)} className="btn-secondary" style={{ gap: '6px' }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button
                disabled={submitting}
                onClick={handlePlaceOrder}
                className="btn-primary"
                style={{ gap: '8px', padding: '12px 28px' }}
              >
                {submitting ? 'Authorizing Payment...' : 'Place Secure Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Success animation screen */}
      {step === 4 && (
        <div className="glass-card animate-fade-in" style={{
          padding: '60px 40px',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          {/* Animated checkmark icon */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px var(--success-bg)',
            border: '2px solid var(--success)',
            animation: 'pulseGlow 2s infinite'
          }}>
            <ShieldCheck size={44} />
          </div>

          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
              Order <span className="gradient-text">Authorized!</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Thank you for your purchase. We have successfully authorized your payment. Your package is currently being prepared for routing.
            </p>
          </div>

          {placedOrder && (
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '12px 24px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 500,
              fontFamily: 'monospace'
            }}>
              Order ID: {placedOrder._id}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <button onClick={() => navigate(`/orders/track?id=${placedOrder?._id || ''}`)} className="btn-primary">
              Track Order Status
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Back to Home
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
