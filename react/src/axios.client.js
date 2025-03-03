// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Service functions for products
export const productService = {
  // Get all products with optional type filter
  getAllProducts: async (type = null) => {
    try {
      const params = {};
      if (type) {
        params.type = type;
      }
      
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  // Get product details by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }
};

// Service functions for orders
export const orderService = {
  // Create a new order
  createOrder: async (orderData, orderItems) => {
    try {
      const payload = {
        order: orderData,
        items: orderItems
      };
      
      const response = await api.post('/orders', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // Get all orders with pagination and optional date filtering
  getOrders: async (page = 1, limit = 10, startDate = null, endDate = null) => {
    try {
      const params = { page, limit };
      
      if (startDate) {
        params.start_date = startDate;
      }
      
      if (endDate) {
        params.end_date = endDate;
      }
      
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  
  // Get order details by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get sales summary by date range
  getSalesSummary: async (startDate, endDate) => {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const response = await api.get('/sales/summary', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales summary:', error);
      throw error;
    }
  }
};

export default {
  productService,
  orderService
};