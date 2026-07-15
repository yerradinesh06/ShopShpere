import { API_URL } from '../context/AuthContext';

// Helper to get authorization header
const getAuthHeader = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (e) {
      console.error('Error parsing user info for token', e);
      return {};
    }
  }
  return {};
};

export const api = {
  // Generic request handler
  request: async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  },

  // Auth requests
  auth: {
    login: (email, password) =>
      api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (name, email, password) =>
      api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    getProfile: () =>
      api.request('/auth/profile', {
        method: 'GET',
      }),
    updateProfile: (profileData) =>
      api.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  // Product requests
  products: {
    list: (queryParams = '') => api.request(`/products${queryParams}`),
    get: (id) => api.request(`/products/${id}`),
    create: (productData) =>
      api.request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),
    update: (id, productData) =>
      api.request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      }),
    delete: (id) =>
      api.request(`/products/${id}`, {
        method: 'DELETE',
      }),
    createReview: (id, reviewData) =>
      api.request(`/products/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      }),
  },

  // Order requests
  orders: {
    create: (orderData) =>
      api.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    list: () => api.request('/orders'),
    listMy: () => api.request('/orders/myorders'),
    get: (id) => api.request(`/orders/${id}`),
    updateStatus: (id, status) =>
      api.request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  // Admin dashboard requests
  admin: {
    getStats: () => api.request('/admin/stats'),
  },
};
