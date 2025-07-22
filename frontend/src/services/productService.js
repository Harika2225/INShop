import api from './api';

// Product related API calls
const productService = {
  // Get all products with optional filters
  async getProducts(params = {}) {
    const response = await api.get('/api/v1/products', { params });
    return response.data;
  },

  // Get a specific product by ID
  async getProductById(id) {
    const response = await api.get(`/api/v1/products/${id}`);
    return response.data;
  },

  // Search products by query
  async searchProducts(query, params = {}) {
    const response = await api.get(`/api/v1/products/search/${query}`, { params });
    return response.data;
  },

  // Filter products by criteria
  async filterProducts(filters) {
    const response = await api.get('/api/v1/products', { params: filters });
    return response.data;
  },

  // Get products from Amazon
  async getAmazonProducts(query, gender) {
    const response = await api.get(`/api/v1/scraping/amazon/${query}`, {
      params: { gender }
    });
    return response.data;
  },

  // Get products from Flipkart
  async getFlipkartProducts(query, gender) {
    const response = await api.get(`/api/v1/scraping/flipkart/${query}`, {
      params: { gender }
    });
    return response.data;
  },

  // Get products from Myntra
  async getMyntraProducts(query, gender) {
    const response = await api.get(`/api/v1/scraping/myntra/${query}`, {
      params: { gender }
    });
    return response.data;
  },

  // Get products from Ajio
  async getAjioProducts(query, gender) {
    const response = await api.get(`/api/v1/scraping/ajio/${query}`, {
      params: { gender }
    });
    return response.data;
  },

  // Search across all sources
  async searchAllSources(query, gender) {
    const response = await api.get(`/api/v1/scraping/search/${query}`, {
      params: { gender }
    });
    return response.data;
  },

  // Refresh product data
  async refreshProductData(productId) {
    const response = await api.post(`/api/v1/scraping/product/refresh/${productId}`);
    return response.data;
  }
};

export default productService;
