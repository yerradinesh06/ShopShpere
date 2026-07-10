import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_URL } from '../context/AuthContext';
import { Heart, Star, Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const Shop = () => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, wishlistItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const wishlistMode = searchParams.get('wishlist') === 'true';
  const categoryParam = searchParams.get('category') || 'All';
  const keywordParam = searchParams.get('keyword') || '';

  // Local filter states
  const [keyword, setKeyword] = useState(keywordParam);
  const [category, setCategory] = useState(categoryParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Data loading states
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync inputs with URL parameter updates
  useEffect(() => {
    setCategory(categoryParam);
    setKeyword(keywordParam);
  }, [categoryParam, keywordParam]);

  // Fetch from backend
  const fetchProducts = async () => {
    if (wishlistMode) {
      setProducts(wishlistItems);
      setPages(1);
      setPage(1);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const queryParts = [
        `pageNumber=${page}`,
        `category=${category === 'All' ? '' : encodeURIComponent(category)}`,
        `keyword=${encodeURIComponent(keyword)}`,
        `sortBy=${sortBy}`,
      ];
      if (minPrice) queryParts.push(`minPrice=${minPrice}`);
      if (maxPrice) queryParts.push(`maxPrice=${maxPrice}`);
      if (minRating) queryParts.push(`rating=${minRating}`);

      const response = await fetch(`${API_URL}/products?${queryParts.join('&')}`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
        setPages(data.pages || 1);
      } else {
        setError(data.message || 'Error fetching products');
      }
    } catch (err) {
      setError('Connection failed. Running offline mock mode.');
      // Local fallback simulation if backend offline
      setProducts(wishlistItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, page, sortBy, wishlistMode, wishlistItems.length]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ keyword, category, wishlist: wishlistMode ? 'true' : 'false' });
    fetchProducts();
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="animate-fade-in" style={{ padding: '30px 0' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>
            {wishlistMode ? 'My ' : 'Shop '}<span className="gradient-text">{wishlistMode ? 'Wishlist' : 'Products'}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {wishlistMode 
              ? 'Keep track of premium products you love' 
              : `Showing premium goods curated to elevate your design and layout workspace.`
            }
          </p>
        </div>

        {wishlistMode && (
          <button onClick={() => navigate('/shop')} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
            Back to Catalog
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px' }} className="shop-layout">
        
        {/* Left Filters Sidebar */}
        {!wishlistMode ? (
          <aside className="glass-panel" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                <Filter size={18} /> Filters
              </span>
              <button onClick={clearFilters} style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }} className="clear-btn">
                <RefreshCw size={12} /> Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search catalog..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
              <button type="submit" style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}>
                <Search size={16} />
              </button>
            </form>

            {/* Category Select */}
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>Category</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['All', 'Audio', 'Wearables', 'Accessories', 'Lifestyle'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    style={{
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      color: category === cat ? 'var(--accent)' : 'var(--text-secondary)',
                      fontWeight: category === cat ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '4px 0',
                      transition: 'var(--transition)'
                    }}
                    className="filter-category-item"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>Price Range ($)</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem'
                  }}
                />
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>Min Rating</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => {
                      setMinRating(minRating === stars.toString() ? '' : stars.toString());
                      setPage(1);
                    }}
                    style={{
                      background: minRating === stars.toString() ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                      border: `1px solid ${minRating === stars.toString() ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flex: 1,
                      justifyContent: 'center',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span>{stars}</span>
                    <Star size={12} fill="var(--warning)" color="var(--warning)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Filters */}
            <button onClick={fetchProducts} className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}>
              Apply Filters
            </button>
          </aside>
        ) : (
          <aside className="glass-panel" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            height: 'fit-content',
            border: '1px solid var(--border)'
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Wishlisted products are stored locally in your browser storage. You can add them to the cart directly or click on their details to learn more.
            </p>
          </aside>
        )}

        {/* Right Product Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Sorting Header */}
          {!wishlistMode && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {products.length} Products Found
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="newest">Newest Releases</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>
          )}

          {/* Catalog Loading/Results */}
          {loading ? (
            <div className="grid-products">
              {[1, 2, 3, 6].map(n => (
                <div key={n} className="glass-card" style={{ height: '360px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ flex: 1, backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', animation: 'shimmer 2s infinite' }} />
                  <div style={{ height: '20px', width: '60%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }} />
                  <div style={{ height: '15px', width: '30%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          ) : error && products.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>
              <button onClick={fetchProducts} className="btn-secondary">Retry Loading</button>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card" style={{ padding: '80px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '16px' }}>
                {wishlistMode ? 'Your wishlist is empty.' : 'No products found matching the criteria.'}
              </p>
              {!wishlistMode && (
                <button onClick={clearFilters} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Product Grid */}
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
                        zIndex: 10
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
                        height: '220px',
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
                          fontSize: '0.95rem',
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
                        <span style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                          ${prod.price.toFixed(2)}
                        </span>
                        <button
                          disabled={prod.countInStock === 0}
                          onClick={() => addToCart(prod, 1)}
                          className="btn-primary"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
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

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    className="page-btn"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      style={{
                        background: page === n ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                        border: `1px solid ${page === n ? 'var(--accent)' : 'var(--border)'}`,
                        color: page === n ? 'white' : 'var(--text-primary)',
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'var(--transition)'
                      }}
                      className="page-btn"
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    disabled={page === pages}
                    onClick={() => setPage(p => Math.min(p + 1, pages))}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    className="page-btn"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
        }
        .filter-category-item:hover {
          color: var(--accent) !important;
          padding-left: 2px;
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
        .clear-btn:hover {
          color: var(--text-primary) !important;
        }
        .page-btn:hover:not(:disabled) {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
        }
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Shop;
