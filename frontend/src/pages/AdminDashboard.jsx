import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Eye,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders

  // Dashboard Stats States
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products manager States
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

  // Form states for Product CRUD
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodStock, setProdStock] = useState('');

  // Orders manager States
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    // Auth security check
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    fetchStats();
    fetchProducts();
    fetchOrders();
  }, [userInfo, navigate]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const data = await response.json();
      if (response.ok) setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${API_URL}/products?pageSize=100`);
      const data = await response.json();
      if (response.ok) setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const data = await response.json();
      if (response.ok) setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Create Product Submit
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          name: prodName,
          price: Number(prodPrice),
          description: prodDesc,
          image: prodImage || 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=80',
          brand: prodBrand,
          category: prodCat,
          countInStock: Number(prodStock)
        })
      });

      if (response.ok) {
        setCreatingProduct(false);
        clearProductForm();
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Product triggers
  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdPrice(product.price);
    setProdDesc(product.description);
    setProdImage(product.image);
    setProdBrand(product.brand);
    setProdCat(product.category);
    setProdStock(product.countInStock);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          name: prodName,
          price: Number(prodPrice),
          description: prodDesc,
          image: prodImage,
          brand: prodBrand,
          category: prodCat,
          countInStock: Number(prodStock)
        })
      });

      if (response.ok) {
        setEditingProduct(null);
        clearProductForm();
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (response.ok) {
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Delivery Status
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearProductForm = () => {
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdImage('');
    setProdBrand('');
    setProdCat('');
    setProdStock('');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      
      {/* Top dashboard header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>
            Admin <span className="gradient-text">Console</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, administrator. Manage inventory databases and check customer revenues.</p>
        </div>

        {/* Tab switch buttons */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'overview' ? 'var(--accent-gradient)' : 'none',
              color: activeTab === 'overview' ? 'white' : 'var(--text-primary)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Overview Stats
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'products' ? 'var(--accent-gradient)' : 'none',
              color: activeTab === 'products' ? 'white' : 'var(--text-primary)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Products CRUD
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'orders' ? 'var(--accent-gradient)' : 'none',
              color: activeTab === 'orders' ? 'white' : 'var(--text-primary)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Fulfillment Orders
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS & DYNAMIC CHARTS */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {loadingStats ? (
            <p>Loading overview analytics...</p>
          ) : !stats ? (
            <p>No statistics records found.</p>
          ) : (
            <>
              {/* Stats Numbers Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                
                <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'var(--accent-glow)', color: 'var(--accent)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TOTAL REVENUE</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
                      ${stats.totalRevenue.toFixed(2)}
                    </h3>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TOTAL ORDERS</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
                      {stats.totalOrders}
                    </h3>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>BUYER CUSTOMERS</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
                      {stats.totalUsers}
                    </h3>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>LOW STOCK ALERTS</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
                      {stats.lowStockAlerts.length}
                    </h3>
                  </div>
                </div>

              </div>

              {/* Dynamic SVG / HTML Charts Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="admin-charts-grid">
                
                {/* Chart 1: Category Sales */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
                    Sales Revenue by <span className="gradient-text">Category</span>
                  </h3>
                  
                  {stats.categoryBreakdown.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No category sales data recorded.</p>
                  ) : (
                    <div className="chart-bar-container">
                      {stats.categoryBreakdown.map((cat, idx) => {
                        const maxVal = Math.max(...stats.categoryBreakdown.map(c => c.revenue), 1);
                        const pctHeight = Math.max(10, (cat.revenue / maxVal) * 100);
                        return (
                          <div key={idx} className="chart-bar-wrapper">
                            <div className="chart-bar" style={{ height: `${pctHeight}%` }}>
                              <div className="chart-bar-tooltip">${cat.revenue.toFixed(2)}</div>
                            </div>
                            <span className="chart-label" title={cat.category}>{cat.category}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Chart 2: Monthly Trends */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
                    Monthly <span className="gradient-text">Revenue Trends</span>
                  </h3>

                  {stats.monthlySales.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No sales trends data recorded.</p>
                  ) : (
                    <div className="chart-bar-container">
                      {stats.monthlySales.map((month, idx) => {
                        const maxVal = Math.max(...stats.monthlySales.map(m => m.revenue), 1);
                        const pctHeight = Math.max(10, (month.revenue / maxVal) * 100);
                        return (
                          <div key={idx} className="chart-bar-wrapper">
                            <div className="chart-bar" style={{ height: `${pctHeight}%`, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                              <div className="chart-bar-tooltip">${month.revenue.toFixed(2)} ({month.orders} orders)</div>
                            </div>
                            <span className="chart-label">{month.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Low Stock Checklist & Top Selling Products */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }} className="admin-charts-grid">
                
                {/* Low Stock Alerts */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <AlertTriangle size={18} color="var(--warning)" /> Inventory Warning Levels
                  </h3>

                  {stats.lowStockAlerts.length === 0 ? (
                    <p style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✓ All catalog product stock counts are healthy.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {stats.lowStockAlerts.map((prod) => (
                        <div key={prod._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{prod.name}</span>
                          <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Only {prod.countInStock} Left</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top Selling Products */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={18} color="var(--success)" /> Top Performing Products
                  </h3>

                  {stats.topSellingProducts.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No orders registered yet to compile performance metrics.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {stats.topSellingProducts.map((prod, idx) => (
                        <div key={prod._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px', fontSize: '0.85rem' }}>
                          <span><strong>#{idx + 1}</strong> {prod.name}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{prod.qty} sold (${prod.revenue.toFixed(2)})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD & FORM EDITOR */}
      {activeTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Create Button trigger */}
          {!creatingProduct && !editingProduct && (
            <button onClick={() => setCreatingProduct(true)} className="btn-primary" style={{ gap: '6px', alignSelf: 'flex-start', padding: '10px 20px', fontSize: '0.85rem' }}>
              <Plus size={16} /> Add Catalog Product
            </button>
          )}

          {/* Creation / Edit Form Overlay */}
          {(creatingProduct || editingProduct) && (
            <form
              onSubmit={creatingProduct ? handleCreateProduct : handleUpdateProduct}
              className="glass-panel animate-fade-in"
              style={{
                padding: '30px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
                  {creatingProduct ? 'Add New Product' : 'Edit Catalog Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setCreatingProduct(false);
                    setEditingProduct(null);
                    clearProductForm();
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="admin-charts-grid">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input required type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input required type="number" step="0.01" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="admin-charts-grid">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input required type="text" placeholder="Audio, Wearables..." value={prodCat} onChange={(e) => setProdCat(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input required type="text" placeholder="Brand Name" value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="admin-charts-grid">
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input type="text" placeholder="https://..." value={prodImage} onChange={(e) => setProdImage(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Count</label>
                  <input required type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea required rows={4} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className="form-input" style={{ resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setCreatingProduct(false);
                    setEditingProduct(null);
                    clearProductForm();
                  }}
                  className="btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>
                  {creatingProduct ? 'Save Product' : 'Update Details'}
                </button>
              </div>
            </form>
          )}

          {/* Catalog Products Table */}
          {loadingProducts ? (
            <p>Loading database items...</p>
          ) : (
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', overflowX: 'auto', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }} className="admin-table">
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>IMAGE</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>NAME</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>CATEGORY</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>PRICE</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>STOCK</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{prod.name}</td>
                      <td style={{ padding: '12px 20px', color: 'var(--text-secondary)' }}>{prod.category}</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>${prod.price.toFixed(2)}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span className={`badge ${prod.countInStock > 5 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                          {prod.countInStock}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', height: '65px' }}>
                        <button onClick={() => startEditProduct(prod)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '6px' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(prod._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '6px' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <p>Loading shipment orders...</p>
          ) : orders.length === 0 ? (
            <p>No transactions found in records.</p>
          ) : (
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', overflowX: 'auto', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }} className="admin-table">
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>ORDER ID</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>CUSTOMER</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>DATE</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>TOTAL</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600 }}>STATUS</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>UPDATE MILESTONE</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '14px 20px', fontFamily: 'monospace' }}>{order._id.substring(0, 10)}...</td>
                      <td style={{ padding: '14px 20px', fontWeight: 500 }}>{order.user ? order.user.name : 'Unknown User'}</td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 20px', fontWeight: 700 }}>${order.totalPrice.toFixed(2)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .admin-charts-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        .admin-table th, .admin-table td {
          border-bottom: 1px solid var(--border);
        }
        .admin-table tbody tr:hover {
          background-color: var(--bg-tertiary);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
