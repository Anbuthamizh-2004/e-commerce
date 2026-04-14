import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Products
export const getProducts = () => API.get('/products');
export const getFeaturedProducts = () => API.get('/products/featured');
export const getProductsByCategory = (id) => API.get(`/products/category/${id}`);
export const searchProducts = (q) => API.get(`/products/search?q=${q}`);
export const getProduct = (id) => API.get(`/products/${id}`);

// Categories
export const getCategories = () => API.get('/categories');

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (productId, quantity = 1) => API.post('/cart', { productId, quantity });
export const updateCartItem = (productId, quantity) => API.put(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete('/cart');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders');
export const getOrder = (id) => API.get(`/orders/${id}`);

// Admin
export const getAllOrders = () => API.get('/orders/admin/all');
export const updateOrderStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export default API;
