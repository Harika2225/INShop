import api from './api';

// Product related API calls - Database functionality commented out as per requirement
const productService = {
  // Get all products with optional filters
  async getProducts(params = {}) {
    // Database functionality commented out as per requirement
    // const response = await api.get('/api/v1/products', { params });
    // return response.data;
    return []; // Return empty array while database is not in use
  },

  // Get a specific product by ID
  async getProductById(id) {
    // Database functionality commented out as per requirement
    // const response = await api.get(`/api/v1/products/${id}`);
    // return response.data;
    return null; // Return null while database is not in use
  },

  // Search products by query
  async searchProducts(query, params = {}) {
    // Database functionality commented out as per requirement
    // const response = await api.get(`/api/v1/products/search/${query}`, { params });
    // return response.data;
    return []; // Return empty array while database is not in use
  },

  // Filter products by criteria
  async filterProducts(filters) {
    // Database functionality commented out as per requirement
    // const response = await api.get('/api/v1/products', { params: filters });
    // return response.data;
    return []; // Return empty array while database is not in use
  },

  // Get products from Amazon
  async getAmazonProducts(query, gender) {
    // Re-enabling this API call as requested for Amazon scraping
    try {
      const response = await api.get(`/api/v1/scraping/amazon/${query}`, {
        params: { gender }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Amazon products:', error);
      return []; // Return empty array on error
    }
  },

  // Get products from Flipkart
  async getFlipkartProducts(query, gender) {
    // Database functionality commented out as per requirement
    // const response = await api.get(`/api/v1/scraping/flipkart/${query}`, {
    //   params: { gender }
    // });
    // return response.data;
    return []; // Return empty array while database is not in use
  },

  // Get products from Myntra
  async getMyntraProducts(query, gender) {
    // Database functionality commented out as per requirement
    // const response = await api.get(`/api/v1/scraping/myntra/${query}`, {
    //   params: { gender }
    // });
    // return response.data;
    return []; // Return empty array while database is not in use
  },

  // Get products from Ajio
  async getAjioProducts(query, gender) {
    // Database functionality commented out as per requirement
    // const response = await api.get(`/api/v1/scraping/ajio/${query}`, {
    //   params: { gender }
    // });
    // return response.data;
    return []; // Return empty array while database is not in use
  },

  // Search across all sources
  async searchAllSources(query, gender) {
    // Database functionality commented out as per requirement
    // const response = await api.get(`/api/v1/scraping/search/${query}`, {
    //   params: { gender }
    // });
    // return response.data;
    return []; // Return empty array while database is not in use
  },

  // Refresh product data
  async refreshProductData(productId) {
    // Database functionality commented out as per requirement
    // const response = await api.post(`/api/v1/scraping/product/refresh/${productId}`);
    // return response.data;
    return null; // Return null while database is not in use
  }
};

export default productService;
