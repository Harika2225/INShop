import api from './api';

// Source related API calls - Database functionality commented out as per requirement
const sourceService = {
  // Get all sources
  async getSources() {
    // Database functionality commented out as per requirement
    // const response = await api.get('/api/v1/sources');
    // return response.data;
    return []; // Return empty array while database is not in use
  },

  // Get a specific source by ID
  async getSourceById(id) {
    // Database functionality commented out as per requirement
    // const response = await api.get(`/api/v1/sources/${id}`);
    // return response.data;
    return null; // Return null while database is not in use
  },

  // Check scraping task status
  async getScrapingStatus(taskId) {
    // Database functionality commented out as per requirement
    // const response = await api.get(`/api/v1/scraping/status/${taskId}`);
    // return response.data;
    return { status: 'completed' }; // Return dummy status while database is not in use
  }
};

export default sourceService;
