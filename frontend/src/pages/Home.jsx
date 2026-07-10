import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_URL } from '../context/AuthContext';
import {
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Truck,
  ShieldCheck,
  Headphones,
  Heart,
  Star
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products?pageSize=4`);
        const data = await response.json();
        if (response.ok) {
          setProducts(data.products || []);
        } else {
          setError(data.message || 'Failed to load products');
        }
      } catch (err) {
        setError('Connection error, running offline mock mode.');
        // Set sample mock data in case backend isn't started yet
        setProducts([
          {
            _id: 'mock1',
            name: 'Aura Sound Max Headphones',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
            category: 'Audio',
            brand: 'Aura',
            rating: 4.8,
            numReviews: 4,
            countInStock: 5
          },
          {
            _id: 'mock2',
            name: 'Chronos Watch S',
            price: 249.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
            category: 'Wearables',
            brand: 'Chronos',
            rating: 4.5,
            numReviews: 2,
            countInStock: 8
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Audio', icon: <Headphones size={24} />, desc: 'Headphones & Speakers' },
    { name: 'Wearables', icon: <TrendingUp size={24} />, desc: 'Smartwatches & Fitness' },
    { name: 'Accessories', icon: <Sparkles size={24} />, desc: 'Chargers, Keyboards & Docks' },
    { name: 'Lifestyle', icon: <ShoppingBag size={24} />, desc: 'Thermal Mugs & Home Tech' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
      
      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center',
        padding: '60px 0',
        minHeight: '80vh'
      }} className="hero-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--accent-glow)',
            color: 'var(--accent)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            width: 'fit-content'
          }}>
            <Sparkles size={14} /> ShopSphere Premium Collection
          </div>
          <h1 style={{
            fontSize: '3.8rem',
            lineHeight: '1.1',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            letterSpacing: '-0.04em'
          }} className="hero-title">
            Next Generation <span className="gradient-text">E-Commerce</span> Experience
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            lineHeight: '1.6',
            maxWidth: '520px'
          }}>
            Discover curated premium essentials for developers, creators, and technology pioneers. Elevate your everyday flow.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <Link to="/shop" className="btn-primary" style={{ gap: '8px' }}>
              Explore Shop <ArrowRight size={18} />
            </Link>
            <Link to="/orders/track" className="btn-secondary">
              Track Order
            </Link>
          </div>
        </div>

        {/* Hero Banner Image */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute',
            width: '380px',
            height: '380px',
            background: 'var(--accent-gradient)',
            filter: 'blur(80px)',
            opacity: 0.25,
            borderRadius: '50%',
            zIndex: 1
          }} />
          <img
            src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=80"
            alt="Premium Watch Hero"
            style={{
              width: '100%',
              maxWidth: '460px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--card-shadow)',
              zIndex: 2,
              position: 'relative',
              border: '1px solid var(--glass-border)'
            }}
          />
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '30px',
      }}>
        <div className="glass-card" style={{ padding: '30px', display: 'flex', gap: '18px', alignItems: 'center' }}>
          <div style={{ background: 'var(--accent-glow)', color: 'var(--accent)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Truck size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>Free Shipping</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Complimentary on all orders over $150</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '30px', display: 'flex', gap: '18px', alignItems: 'center' }}>
          <div style={{ background: 'var(--accent-glow)', color: 'var(--accent)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>Secure Payments</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SSL encrypted credit & debit processing</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '30px', display: 'flex', gap: '18px', alignItems: 'center' }}>
          <div style={{ background: 'var(--accent-glow)', color: 'var(--accent)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Headphones size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>Dedicated Support</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>24/7 expert merchant chat assistance</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Browse by <span className="gradient-text">Category</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Handcrafted design aesthetics for matching your layout needs.</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="glass-card"
              onClick={() => navigate(`/shop?category=${cat.name}`)}
              style={{
                padding: '30px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {cat.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '4px' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Featured <span className="gradient-text">Releases</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Our most popular smart gear and desktop hardware accessories.</p>
          </div>
          <Link to="/shop" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent)',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}>
            View Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid-products">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="glass-card" style={{ height: '380px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ flex: 1, backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', animation: 'shimmer 2s infinite' }} />
                <div style={{ height: '20px', width: '70%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }} />
                <div style={{ height: '15px', width: '40%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-products">
            {products.map((prod) => (
              <div key={prod._id} className="glass-card" style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative'
              }}>
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(prod)}
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'var(--transition)'
                  }}
                  className="wishlist-btn"
                >
                  <Heart
                    size={16}
                    color={isInWishlist(prod._id) ? 'var(--danger)' : 'var(--text-primary)'}
                    fill={isInWishlist(prod._id) ? 'var(--danger)' : 'none'}
                  />
                </button>

                {/* Product Image */}
                <div
                  onClick={() => navigate(`/product/${prod._id}`)}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-tertiary)',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'var(--transition)'
                    }}
                    className="product-card-img"
                  />
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{prod.category}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem' }}>
                      <Star size={13} fill="var(--warning)" color="var(--warning)" />
                      <span>{prod.rating}</span>
                    </div>
                  </div>
                  <h3
                    onClick={() => navigate(`/product/${prod._id}`)}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                    className="product-title-hover"
                  >
                    {prod.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      ${prod.price.toFixed(2)}
                    </span>
                    <button
                      disabled={prod.countInStock === 0}
                      onClick={() => addToCart(prod, 1)}
                      className="btn-primary"
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {prod.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Styled embeds */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            padding: 30px 0 !important;
          }
          .hero-grid div {
            align-items: center;
          }
          .hero-title {
            fontSize: 2.6rem !important;
          }
          .hero-grid img {
            max-width: 100% !important;
          }
        }
        .product-card-img:hover {
          transform: scale(1.05);
        }
        .product-title-hover:hover {
          color: var(--accent);
        }
        .wishlist-btn:hover {
          background-color: var(--bg-tertiary) !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default Home;
