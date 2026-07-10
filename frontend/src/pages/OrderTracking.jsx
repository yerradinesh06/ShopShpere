import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { Search, PackageCheck, Send, CheckCircle, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';

const OrderTracking = () => {
  const { userInfo } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdParam = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(orderIdParam);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`${API_URL}/orders/${idToFetch}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      setError('Connection failed. Unable to retrieve order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdParam && userInfo) {
      fetchOrderDetails(orderIdParam);
    }
  }, [orderIdParam, userInfo]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setSearchParams({ id: orderId.trim() });
    fetchOrderDetails(orderId.trim());
  };

  const getStatusIndex = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
        Track <span className="gradient-text">Delivery</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Verify transit metrics and check real-time routing milestones of your packages.
      </p>

      {/* Auth Gate Warning */}
      {!userInfo ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Please sign in to your merchant buyer account to track your orders.
          </p>
          <a href="/login?redirect=/orders/track" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Sign In to Track
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Tracking Search Input */}
          <form onSubmit={handleSearchSubmit} className="glass-panel" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              required
              placeholder="Paste your Order ID here (e.g. order_1_...)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ gap: '8px', padding: '12px 24px', fontSize: '0.85rem', flexShrink: 0 }}>
              <Search size={16} /> Track Status
            </button>
          </form>

          {/* Loading details */}
          {loading && (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Searching tracking records...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="glass-panel badge-danger" style={{ padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--danger)', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Tracking Results Visualizer */}
          {order && (
            <div className="glass-card animate-fade-in" style={{ padding: '30px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              {/* Order Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORDER REFERENCE</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'monospace', marginTop: '2px' }}>{order._id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CURRENT MILESTONE</span>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: order.status === 'Delivered' ? 'var(--success)' : 'var(--accent)',
                    marginTop: '2px'
                  }}>
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Graphical tracking milestones map */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
                padding: '0 10px'
              }}>
                {/* Connection line background */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '8%',
                  right: '8%',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 1
                }} />
                {/* Completed connection line bar */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '8%',
                  width: `${(getStatusIndex(order.status) - 1) * 28}%`,
                  height: '2px',
                  backgroundColor: 'var(--success)',
                  zIndex: 1,
                  transition: 'var(--transition)'
                }} />

                {/* Milestone 1: Paid */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: getStatusIndex(order.status) >= 1 ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                    color: getStatusIndex(order.status) >= 1 ? 'var(--success)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${getStatusIndex(order.status) >= 1 ? 'var(--success)' : 'var(--border)'}`,
                    boxShadow: getStatusIndex(order.status) >= 1 ? '0 0 10px var(--success-bg)' : 'none'
                  }}>
                    <ShieldCheck size={18} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Payment Paid</span>
                </div>

                {/* Milestone 2: Processing */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: getStatusIndex(order.status) >= 2 ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                    color: getStatusIndex(order.status) >= 2 ? 'var(--success)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${getStatusIndex(order.status) >= 2 ? 'var(--success)' : 'var(--border)'}`,
                    boxShadow: getStatusIndex(order.status) >= 2 ? '0 0 10px var(--success-bg)' : 'none'
                  }}>
                    <ShoppingBag size={18} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Processing</span>
                </div>

                {/* Milestone 3: Shipped */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: getStatusIndex(order.status) >= 3 ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                    color: getStatusIndex(order.status) >= 3 ? 'var(--success)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${getStatusIndex(order.status) >= 3 ? 'var(--success)' : 'var(--border)'}`,
                    boxShadow: getStatusIndex(order.status) >= 3 ? '0 0 10px var(--success-bg)' : 'none'
                  }}>
                    <Truck size={18} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Shipped</span>
                </div>

                {/* Milestone 4: Delivered */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: getStatusIndex(order.status) >= 4 ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                    color: getStatusIndex(order.status) >= 4 ? 'var(--success)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${getStatusIndex(order.status) >= 4 ? 'var(--success)' : 'var(--border)'}`,
                    boxShadow: getStatusIndex(order.status) >= 4 ? '0 0 10px var(--success-bg)' : 'none'
                  }}>
                    <PackageCheck size={18} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Delivered</span>
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />

              {/* Order Item List & Shipping Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="track-details-row">
                
                {/* Shipping Location info */}
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '10px' }}>Delivery Address</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>

                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '20px', marginBottom: '10px' }}>Payment Method</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Secure card payment ({order.paymentMethod})
                  </p>
                </div>

                {/* Items summary */}
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '12px' }}>Items Summary</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>{item.name} <strong style={{ color: 'var(--text-muted)' }}>× {item.qty}</strong></span>
                        <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: '6px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      <span>Amount Paid</span>
                      <span style={{ fontFamily: 'var(--font-heading)' }}>${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .track-details-row {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderTracking;
