/**
 * Local Storage Service
 * Handles storing and retrieving data from browser's localStorage
 */

const localStorageService = {
  // Favorites management
  getFavorites: () => {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  },

  addToFavorites: (productId) => {
    const favorites = localStorageService.getFavorites();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    return favorites;
  },

  removeFromFavorites: (productId) => {
    const favorites = localStorageService.getFavorites();
    const updatedFavorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    return updatedFavorites;
  },

  isFavorite: (productId) => {
    const favorites = localStorageService.getFavorites();
    return favorites.includes(productId);
  },

  // Compare list management
  getCompareList: () => {
    const compareList = localStorage.getItem('compareList');
    return compareList ? JSON.parse(compareList) : [];
  },

  addToCompareList: (productId, maxItems = 4) => {
    const compareList = localStorageService.getCompareList();
    if (!compareList.includes(productId)) {
      if (compareList.length >= maxItems) {
        return { 
          success: false, 
          message: `You can compare up to ${maxItems} products at a time`,
          data: compareList
        };
      }
      
      compareList.push(productId);
      localStorage.setItem('compareList', JSON.stringify(compareList));
    }
    return { success: true, data: compareList };
  },

  removeFromCompareList: (productId) => {
    const compareList = localStorageService.getCompareList();
    const updatedCompareList = compareList.filter(id => id !== productId);
    localStorage.setItem('compareList', JSON.stringify(updatedCompareList));
    return updatedCompareList;
  },

  clearCompareList: () => {
    localStorage.setItem('compareList', JSON.stringify([]));
    return [];
  },

  isInCompareList: (productId) => {
    const compareList = localStorageService.getCompareList();
    return compareList.includes(productId);
  },

  // Search history management
  getSearchHistory: () => {
    const searchHistory = localStorage.getItem('searchHistory');
    return searchHistory ? JSON.parse(searchHistory) : [];
  },

  addToSearchHistory: (query, maxItems = 10) => {
    if (!query || query.trim() === '') return;
    
    const searchHistory = localStorageService.getSearchHistory();
    // Remove if already exists (to move it to the top)
    const filteredHistory = searchHistory.filter(item => item.toLowerCase() !== query.toLowerCase());
    
    // Add to the beginning
    filteredHistory.unshift(query);
    
    // Limit the size
    const trimmedHistory = filteredHistory.slice(0, maxItems);
    
    localStorage.setItem('searchHistory', JSON.stringify(trimmedHistory));
    return trimmedHistory;
  },

  clearSearchHistory: () => {
    localStorage.setItem('searchHistory', JSON.stringify([]));
    return [];
  },

  // Recently viewed products
  getRecentlyViewed: () => {
    const recentlyViewed = localStorage.getItem('recentlyViewed');
    return recentlyViewed ? JSON.parse(recentlyViewed) : [];
  },

  addToRecentlyViewed: (productId, maxItems = 10) => {
    const recentlyViewed = localStorageService.getRecentlyViewed();
    
    // Remove if already exists (to move it to the top)
    const filteredRecent = recentlyViewed.filter(id => id !== productId);
    
    // Add to the beginning
    filteredRecent.unshift(productId);
    
    // Limit the size
    const trimmedRecent = filteredRecent.slice(0, maxItems);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(trimmedRecent));
    return trimmedRecent;
  }
};

export default localStorageService;
