import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth, API_URL } from '../context/AuthContext';
import { Star, ShoppingCart, Heart, Shield, RotateCcw, AlertTriangle, Send } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      if (response.ok) {
        setProduct(data);
      } else {
        setError(data.message || 'Product not found');
      }
    } catch (err) {
      setError('Connection failed. Unable to fetch details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;

    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      const response = await fetch(`${API_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json();

      if (response.ok) {
        setReviewSuccess(true);
        setComment('');
        // Reload details
        fetchProduct();
      } else {
        setReviewError(data.message || 'Review failed');
      }
    } catch (err) {
      setReviewError('Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', fontSize: '1.2rem', marginBottom: '20px' }}>{error || 'Product not found'}</p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      
      {/* Back button */}
      <Link to="/shop" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '30px', fontSize: '0.9rem' }}>
        ← Back to Catalog
      </Link>

      {/* Main product display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '60px' }} className="product-details-grid">
        
        {/* Left Side: Product Image */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          height: '460px'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)'
            }}
          />
        </div>

        {/* Right Side: Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.brand} • {product.category}
            </span>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginTop: '8px', lineHeight: '1.2' }}>
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(product.rating) ? 'var(--warning)' : 'none'}
                    color="var(--warning)"
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.numReviews} customer reviews)</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />

          {/* Pricing and Stock */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              ${product.price.toFixed(2)}
            </span>

            {product.countInStock > 0 ? (
              <span className="badge badge-success">In Stock ({product.countInStock})</span>
            ) : (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1rem' }}>
            {product.description}
          </p>

          {/* Action Section */}
          {product.countInStock > 0 && (
            <div className="glass-panel" style={{
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Qty Selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {Array.from({ length: product.countInStock }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => addToCart(product, qty)}
                  className="btn-primary"
                  style={{ flex: 1, gap: '8px', padding: '14px' }}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    width: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  className="detail-wishlist-btn"
                >
                  <Heart
                    size={20}
                    color={isInWishlist(product._id) ? 'var(--danger)' : 'var(--text-primary)'}
                    fill={isInWishlist(product._id) ? 'var(--danger)' : 'none'}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }} className="guarantees-grid">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Shield size={16} color="var(--accent)" />
              <span>1 Year Official Warranty</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <RotateCcw size={16} color="var(--accent)" />
              <span>30 Days Free Return</span>
            </div>
          </div>

        </div>
      </div>

      {/* Product Reviews Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }} className="reviews-grid">
        
        {/* Left Side: Reviews List */}
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
            Customer <span className="gradient-text">Reviews</span>
          </h2>

          {product.reviews.length === 0 ? (
            <div className="glass-card" style={{ padding: '30px', textAlign: 'center', border: '1px dashed var(--border)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {product.reviews.map((rev) => (
                <div key={rev._id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rev.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < rev.rating ? 'var(--warning)' : 'none'}
                        color="var(--warning)"
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Write Review Form */}
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
            Write a <span className="gradient-text">Review</span>
          </h2>

          {userInfo ? (
            <form onSubmit={handleReviewSubmit} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {reviewSuccess && (
                <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                  Review submitted successfully!
                </p>
              )}

              {reviewError && (
                <p style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {reviewError}
                </p>
              )}

              {/* Rating selection */}
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>

              {/* Comment */}
              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea
                  required
                  placeholder="Share your experience using this product..."
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                disabled={reviewLoading}
                type="submit"
                className="btn-primary"
                style={{ width: 'fit-content', gap: '8px', padding: '10px 20px', fontSize: '0.85rem' }}
              >
                <Send size={15} /> {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>

            </form>
          ) : (
            <div className="glass-card" style={{ padding: '30px', textAlign: 'center', border: '1px dashed var(--border)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                You must be signed in to leave reviews on products.
              </p>
              <Link to="/login" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Sign In Now
              </Link>
            </div>
          )}

        </div>

      </section>

      <style>{`
        @media (max-width: 768px) {
          .product-details-grid, .reviews-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .product-details-grid div:first-child {
            height: 320px !important;
          }
        }
        .detail-wishlist-btn:hover {
          background-color: var(--border) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
