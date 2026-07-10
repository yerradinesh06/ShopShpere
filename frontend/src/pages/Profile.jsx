import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { User, Key, ShoppingBag, Calendar, CreditCard, ChevronRight } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, updateProfile } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Orders list state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/profile');
      return;
    }

    setName(userInfo.name);
    setEmail(userInfo.email);

    // Fetch previous orders
    const fetchMyOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await fetch(`${API_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data || []);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError(null);

    if (password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }

    setLoadingUpdate(true);
    try {
      const updateData = { name, email };
      if (password) updateData.password = password;

      await updateProfile(updateData);
      setUpdateSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setUpdateError(err.message || 'Profile update failed');
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '30px' }}>
        My <span className="gradient-text">Account</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }} className="profile-layout">
        
        {/* Left Side: Update Profile details */}
        <aside className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          height: 'fit-content',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--accent)" /> User Credentials
          </h3>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {updateSuccess && (
              <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>Profile updated successfully!</p>
            )}
            {updateError && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>{updateError}</p>
            )}

            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ padding: '10px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ padding: '10px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (optional)</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ padding: '10px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                style={{ padding: '10px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <button type="submit" disabled={loadingUpdate} className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.85rem', marginTop: '10px' }}>
              {loadingUpdate ? 'Updating...' : 'Update Account'}
            </button>
          </form>
        </aside>

        {/* Right Side: Order history */}
        <section>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
            Order <span className="gradient-text">History</span>
          </h2>

          {loadingOrders ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Loading order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/shop')} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Visit Shop
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div key={order._id} className="glass-card" style={{
                  padding: '20px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  {/* Left Info */}
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--accent)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'monospace' }}>ID: {order._id.substring(0, 12)}...</span>
                        <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CreditCard size={13} /> ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <button
                    onClick={() => navigate(`/orders/track?id=${order._id}`)}
                    className="btn-secondary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Track Shipment <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
