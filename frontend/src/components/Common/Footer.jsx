import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Globe, MessageSquare, Share2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      paddingTop: '60px',
      paddingBottom: '30px',
      marginTop: '80px',
      color: 'var(--text-secondary)',
      transition: 'var(--transition)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{
                background: 'var(--accent-gradient)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={16} color="white" />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-primary)'
              }}>
                Shop<span className="gradient-text">Sphere</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              A premium, highly-scalable e-commerce platform delivering high-fidelity digital shopping solutions for tech enthusiasts globally.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" className="social-icon" title="Website"><Globe size={18} /></a>
              <a href="#" className="social-icon" title="Community"><MessageSquare size={18} /></a>
              <a href="#" className="social-icon" title="Share"><Share2 size={18} /></a>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1rem', fontWeight: 600 }}>Quick Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><Link to="/shop?category=Audio" className="footer-link">Premium Audio</Link></li>
              <li><Link to="/shop?category=Wearables" className="footer-link">Smart Wearables</Link></li>
              <li><Link to="/shop?category=Accessories" className="footer-link">Tech Accessories</Link></li>
              <li><Link to="/shop?category=Lifestyle" className="footer-link">Lifestyle Goods</Link></li>
            </ul>
          </div>

          {/* Quick Support Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1rem', fontWeight: 600 }}>Customer Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><Link to="/orders/track" className="footer-link">Track Order Delivery</Link></li>
              <li><a href="#" className="footer-link">Return & Replacement</a></li>
              <li><a href="#" className="footer-link">Terms & Service Agreement</a></li>
              <li><a href="#" className="footer-link">Secure Checkout Guides</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1rem', fontWeight: 600 }}>Contact Info</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} /> 123 Tech Lane, Silicon Valley, CA
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} /> +1 (555) 019-2834
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> support@shopsphere.com
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', marginBottom: '30px' }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          gap: '15px'
        }}>
          <span>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</span>
          <span>Designed with premium MERN stack architecture.</span>
        </div>
      </div>

      <style>{`
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          transition: var(--transition);
        }
        .social-icon:hover {
          color: var(--accent);
          border-color: var(--accent);
          background-color: var(--bg-tertiary);
          transform: translateY(-2px);
        }
        .footer-link {
          color: var(--text-secondary);
          transition: var(--transition);
        }
        .footer-link:hover {
          color: var(--accent);
          padding-left: 4px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
