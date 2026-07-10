import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShoppingBag,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Heart,
  LogOut,
  Sliders,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const { cartItems, wishlistItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border)',
      transition: 'var(--transition)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '75px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--accent-glow)'
          }}>
            <ShoppingBag size={20} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '-0.03em'
          }}>
            Shop<span className="gradient-text">Sphere</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link to="/" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-secondary)', transition: 'var(--transition)' }} className="nav-hover">Home</Link>
          <Link to="/shop" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-secondary)', transition: 'var(--transition)' }} className="nav-hover">Shop</Link>
          <Link to="/orders/track" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-secondary)', transition: 'var(--transition)' }} className="nav-hover">Track Order</Link>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Switcher */}
          <button onClick={toggleTheme} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }} className="icon-button">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Wishlist Link */}
          <Link to="/shop?wishlist=true" style={{ position: 'relative', padding: '8px', display: 'flex', alignItems: 'center' }} title="Wishlist">
            <Heart size={20} color={wishlistItems.length > 0 ? 'var(--danger)' : 'var(--text-primary)'} fill={wishlistItems.length > 0 ? 'var(--danger)' : 'none'} />
            {wishlistItems.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: 'var(--danger)',
                color: 'white',
                fontSize: '0.65rem',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <Link to="/cart" style={{ position: 'relative', padding: '8px', display: 'flex', alignItems: 'center' }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge-pulse" style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: 'var(--accent)',
                color: 'white',
                fontSize: '0.65rem',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 0 8px var(--accent)'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown / Login */}
          {userInfo ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                  fontSize: '0.85rem'
                }}
              >
                <User size={15} />
                <span>{userInfo.name.split(' ')[0]}</span>
                <ChevronDown size={12} />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                  />
                  <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '45px',
                    right: 0,
                    width: '180px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--card-shadow)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 99
                  }}>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'var(--transition)'
                      }}
                      className="dropdown-item"
                    >
                      <User size={14} /> My Profile
                    </Link>

                    {userInfo.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'var(--transition)'
                        }}
                        className="dropdown-item"
                      >
                        <Sliders size={14} /> Admin Area
                      </Link>
                    )}

                    <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: '4px 0' }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        textAlign: 'left',
                        padding: '10px 12px',
                        width: '100%',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                      className="dropdown-item"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              Sign In
            </Link>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-toggle"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 199
            }}
          />
          <div className="glass-panel" style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '280px',
            zIndex: 200,
            boxShadow: 'var(--card-shadow)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderLeft: '1px solid var(--border)',
            animation: 'slideInRight 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
                Shop<span className="gradient-text">Sphere</span>
              </span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Shop</Link>
              <Link to="/orders/track" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Track Order</Link>
              {userInfo && (
                <>
                  <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>My Profile</Link>
                  {userInfo.isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--accent)' }}>Admin Dashboard</Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Internal Custom Nav Hover Styles */}
      <style>{`
        .nav-hover:hover {
          color: var(--accent) !important;
        }
        .icon-button:hover {
          background-color: var(--bg-tertiary) !important;
        }
        .dropdown-item:hover {
          background-color: var(--border) !important;
        }
        .mobile-toggle {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
