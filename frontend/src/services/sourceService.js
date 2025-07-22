import api from './api';

// Source related API calls
const sourceService = {
  // Get all sources
  async getSources() {
    const response = await api.get('/api/v1/sources');
    return response.data;
  },

  // Get a specific source by ID
  async getSourceById(id) {
    const response = await api.get(`/api/v1/sources/${id}`);
    return response.data;
  },

  // Check scraping task status
  async getScrapingStatus(taskId) {
    const response = await api.get(`/api/v1/scraping/status/${taskId}`);
    return response.data;
  }
};

export default sourceService;
