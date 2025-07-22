/**
 * Task Service
 * 
 * Provides functionality to interact with the task status API endpoints
 * Used for monitoring background tasks like scraping jobs
 */
import api from './api';

/**
 * Get the status of a specific task
 * 
 * @param {string} taskId - ID of the task to check
 * @returns {Promise<Object>} - Task status information
 */
export const getTaskStatus = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task status for ${taskId}:`, error);
    throw error;
  }
};

/**
 * List all tasks, optionally filtered by type and status
 * 
 * @param {Object} options - Filter options
 * @param {string} options.taskType - Optional task type filter
 * @param {string} options.status - Optional status filter
 * @param {number} options.limit - Maximum number of tasks to return (default: 10)
 * @returns {Promise<Array>} - List of task status objects
 */
export const listTasks = async (options = {}) => {
  try {
    const { taskType, status, limit = 10 } = options;
    
    const params = {};
    if (taskType) params.task_type = taskType;
    if (status) params.status = status;
    if (limit) params.limit = limit;
    
    const response = await api.get('/tasks', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching task list:', error);
    throw error;
  }
};

/**
 * Get all active scraping tasks
 * 
 * @returns {Promise<Array>} - List of active scraping tasks
 */
export const getActiveScrapingTasks = async () => {
  try {
    const response = await api.get('/tasks/scraping/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active scraping tasks:', error);
    throw error;
  }
};

/**
 * Poll a task status until it completes or fails
 * 
 * @param {string} taskId - ID of the task to poll
 * @param {number} interval - Polling interval in milliseconds (default: 2000)
 * @param {number} timeout - Maximum polling time in milliseconds (default: 60000)
 * @param {Function} onUpdate - Callback function to handle status updates
 * @returns {Promise<Object>} - Final task status
 */
export const pollTaskStatus = async (
  taskId, 
  interval = 2000, 
  timeout = 60000, 
  onUpdate = null
) => {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const status = await getTaskStatus(taskId);
        
        // Call the update callback if provided
        if (onUpdate) {
          onUpdate(status);
        }
        
        // If task completed or failed, resolve with final status
        if (status.status === 'completed' || status.status === 'failed') {
          return resolve(status);
        }
        
        // Check if we've exceeded the timeout
        if (Date.now() - startTime > timeout) {
          return reject(new Error(`Task polling timed out after ${timeout}ms`));
        }
        
        // Schedule next check
        setTimeout(checkStatus, interval);
        
      } catch (error) {
        reject(error);
      }
    };
    
    // Start polling
    checkStatus();
  });
};

export default {
  getTaskStatus,
  listTasks,
  getActiveScrapingTasks,
  pollTaskStatus
};
