import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Slider,

  Pagination,
  Button,
  IconButton,
  Divider,
  Paper,
  Rating,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CompareArrows as CompareArrowsIcon,
  FilterAlt as FilterAltIcon,
  Launch as LaunchIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import productService from '../services/productService';

// No static product data - all data is fetched from APIs

// Dynamic lists will be populated from API data

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const genderParam = queryParams.get('gender');
  
  // State for filters
  const [gender, setGender] = useState(genderParam || 'all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [amazonProducts, setAmazonProducts] = useState([]);
  const [flipkartProducts, setFlipkartProducts] = useState([]);
  const [isLoadingAmazon, setIsLoadingAmazon] = useState(false);
  const [isLoadingFlipkart, setIsLoadingFlipkart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [failedImages, setFailedImages] = useState(new Set());
  // Default search terms for when no search query is provided
  const defaultSearchTerms = useMemo(() => ({
    men: 'men innerwear',
    women: 'women innerwear'
  }), []);
  // Get amazonPage from URL or default to 1
  const amazonPageParam = parseInt(queryParams.get('amazonPage')) || 1;
  const [amazonPage, setAmazonPage] = useState(amazonPageParam);
  
  // Shuffle array function helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch products from Amazon
  const fetchAmazonProducts = useCallback(async () => {
    try {
      setIsLoadingAmazon(true);
      const menProducts = [];
      const womenProducts = [];
      
      // Determine which genders to fetch based on gender filter
      const fetchMen = gender === 'men' || gender === 'all';
      const fetchWomen = gender === 'women' || gender === 'all';
      
      // Determine search term to use
      const searchTerm = currentSearchTerm.trim();
      
      // Fetch men's products if needed
      if (fetchMen) {
        const menSearchTerm = searchTerm || defaultSearchTerms.men;
        console.log(`Fetching Amazon products for gender: men, search term: ${menSearchTerm}`);
        const menData = await productService.getAmazonProducts(
          menSearchTerm, // Use dynamic search term
          'men', // Pass the specific gender
          amazonPage,
          null // No direct URL, use search term instead
        );
        
        if (Array.isArray(menData)) {
          // Tag each product with gender='men' to help with filtering
          const taggedMenData = menData.map(product => ({
            ...product,
            gender: 'men'
          }));
          menProducts.push(...taggedMenData);
        }
      }
      
      // Fetch women's products if needed
      if (fetchWomen) {
        const womenSearchTerm = searchTerm || defaultSearchTerms.women;
        console.log(`Fetching Amazon products for gender: women, search term: ${womenSearchTerm}`);
        const womenData = await productService.getAmazonProducts(
          womenSearchTerm, // Use dynamic search term
          'women', // Pass the specific gender
          amazonPage,
          null // No direct URL, use search term instead
        );
        
        if (Array.isArray(womenData)) {
          // Tag each product with gender='women' to help with filtering
          const taggedWomenData = womenData.map(product => ({
            ...product,
            gender: 'women'
          }));
          womenProducts.push(...taggedWomenData);
        }
      }
      
      // Combine and shuffle products
      const allProducts = [...menProducts, ...womenProducts];
      const shuffledProducts = shuffleArray(allProducts);
      
      setAmazonProducts(shuffledProducts);
    } catch (error) {
      console.error('Error fetching Amazon products:', error);
      setAmazonProducts([]);
    } finally {
      setIsLoadingAmazon(false);
    }
  }, [gender, amazonPage, currentSearchTerm, defaultSearchTerms]);

  // Fetch products from Flipkart
  const fetchFlipkartProducts = useCallback(async () => {
    try {
      setIsLoadingFlipkart(true);
      const menProducts = [];
      const womenProducts = [];
      
      // Determine which genders to fetch based on gender filter
      const fetchMen = gender === 'men' || gender === 'all';
      const fetchWomen = gender === 'women' || gender === 'all';
      
      // Determine search term to use
      const searchTerm = currentSearchTerm.trim();
      
      // Fetch men's products if needed
      if (fetchMen) {
        const menSearchTerm = searchTerm || defaultSearchTerms.men;
        console.log(`Fetching Flipkart products for gender: men, search term: ${menSearchTerm}`);
        const menData = await productService.getFlipkartProducts(
          menSearchTerm, // Use dynamic search term
          'men' // Pass the specific gender
        );
        
        if (Array.isArray(menData)) {
          // Tag each product with gender='men' to help with filtering
          const taggedMenData = menData.map(product => ({
            ...product,
            gender: 'men'
          }));
          menProducts.push(...taggedMenData);
        }
      }
      
      // Fetch women's products if needed
      if (fetchWomen) {
        const womenSearchTerm = searchTerm || defaultSearchTerms.women;
        console.log(`Fetching Flipkart products for gender: women, search term: ${womenSearchTerm}`);
        const womenData = await productService.getFlipkartProducts(
          womenSearchTerm, // Use dynamic search term
          'women' // Pass the specific gender
        );
        
        if (Array.isArray(womenData)) {
          // Tag each product with gender='women' to help with filtering
          const taggedWomenData = womenData.map(product => ({
            ...product,
            gender: 'women'
          }));
          womenProducts.push(...taggedWomenData);
        }
      }
      
      // Combine and shuffle products
      const allProducts = [...menProducts, ...womenProducts];
      const shuffledProducts = shuffleArray(allProducts);
      
      setFlipkartProducts(shuffledProducts);
    } catch (error) {
      console.error('Error fetching Flipkart products:', error);
      setFlipkartProducts([]);
    } finally {
      setIsLoadingFlipkart(false);
    }
  }, [gender, currentSearchTerm, defaultSearchTerms]);
  
  // Validate product URL
  const validateProductUrl = (product) => {
    const url = product.source_url || product.url;
    if (!url) return false;
    
    // Check if URL is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle image error
  const handleImageError = (event, product) => {
    const target = event.target;
    
    // Track this image as failed
    setFailedImages(prev => new Set(prev).add(product.id));
    
    // Provide source-specific fallback images with better text
    if (product.source === 'Flipkart') {
      const productName = product.name ? product.name.slice(0, 10) : 'Product';
      target.src = `https://placehold.co/400x400/2874f0/ffffff?text=${encodeURIComponent(productName)}`;
    } else if (product.source === 'Amazon') {
      const productName = product.name ? product.name.slice(0, 10) : 'Product';
      target.src = `https://placehold.co/400x400/ff9900/ffffff?text=${encodeURIComponent(productName)}`;
    } else {
      const productName = product.name ? product.name.slice(0, 10) : 'Product';
      target.src = `https://placehold.co/400x400/cccccc/333333?text=${encodeURIComponent(productName)}`;
    }
    
    target.onerror = null; // Prevent infinite loop
  };

  // Load initial data
  useEffect(() => {
    // Fetch Amazon products on page load
    fetchAmazonProducts();
    // Fetch Flipkart products on page load
    fetchFlipkartProducts();
  }, [fetchAmazonProducts, fetchFlipkartProducts]);

  // Create combined products array with 50/50 distribution
  const combinedProducts = useMemo(() => {
    const amazonCount = Math.min(amazonProducts.length, 25); // Limit to 25 Amazon products
    const flipkartCount = Math.min(flipkartProducts.length, 25); // Limit to 25 Flipkart products
    
    const amazonSlice = amazonProducts.slice(0, amazonCount);
    const flipkartSlice = flipkartProducts.slice(0, flipkartCount);
    
    // Interleave products for 50/50 distribution
    const combined = [];
    const maxLength = Math.max(amazonSlice.length, flipkartSlice.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < amazonSlice.length) {
        combined.push(amazonSlice[i]);
      }
      if (i < flipkartSlice.length) {
        combined.push(flipkartSlice[i]);
      }
    }
    
    return shuffleArray(combined);
  }, [amazonProducts, flipkartProducts]);
  
  // Handle search submission
  const handleSearch = () => {
    setCurrentSearchTerm(searchQuery);
    setAmazonPage(1); // Reset to page 1 when searching
    
    // Update URL with new search term for persistence across reloads
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('search', searchQuery);
    newParams.set('amazonPage', 1);
    // Update URL without full page reload
    window.history.pushState({}, '', `${window.location.pathname}?${newParams}`);
    
    // Fetch products from both sources
    fetchAmazonProducts();
    fetchFlipkartProducts();
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };
  
  // Handle toggle compare
  const handleToggleCompare = (productId) => {
    if (compareList.includes(productId)) {
      setCompareList(compareList.filter(id => id !== productId));
    } else {
      if (compareList.length < 4) { // Limit comparison to 4 items
        setCompareList([...compareList, productId]);
      } else {
        alert('You can compare up to 4 products at a time');
      }
    }
  };
  

  

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          {/* Search Bar */}
          <Box sx={{ p: 2, mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Filter UI Components - Left Sidebar */}
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
              <FilterAltIcon sx={{ ml: 1, verticalAlign: 'middle' }} />
            </Typography>
            
            {/* Gender Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Gender</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={gender}
                  onChange={(e) => {
                    const newGender = e.target.value;
                    setGender(newGender);
                    
                    // Update URL based on gender selection
                    const newParams = new URLSearchParams(location.search);
                    if (newGender === 'all') {
                      // Remove gender parameter when 'All' is selected
                      newParams.delete('gender');
                    } else {
                      // Set gender parameter for men or women
                      newParams.set('gender', newGender);
                    }
                    
                    // Update URL without reloading the page
                    navigate(`/products?${newParams.toString()}`, { replace: true });
                  }}
                  displayEmpty
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="men">Men</MenuItem>
                  <MenuItem value="women">Women</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue, activeThumb) => {
                  // If activeThumb is 0, user is changing min value
                  // If activeThumb is 1 or undefined, user is changing max value
                  const updatedRange = [...priceRange];
                  
                  if (activeThumb === 0) {
                    // Explicitly changing minimum
                    updatedRange[0] = newValue[0];
                    updatedRange[1] = Math.max(updatedRange[1], newValue[0]); // Ensure max >= min
                  } else {
                    // By default, adjust the maximum
                    updatedRange[1] = newValue[1];
                    // Keep the minimum as is
                  }
                  
                  setPriceRange(updatedRange);
                  
                  // Update URL with price range
                  const newParams = new URLSearchParams(location.search);
                  newParams.set('minPrice', updatedRange[0]);
                  newParams.set('maxPrice', updatedRange[1]);
                  navigate(`/products?${newParams.toString()}`, { replace: true });
                }}
                valueLabelDisplay="auto"
                min={0}
                max={2000}
                step={50}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">₹{priceRange[0]}</Typography>
                <Typography variant="body2">₹{priceRange[1]}</Typography>
              </Box>
            </Box>
            
            {/* Brand Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Brand</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', color: 'text.secondary' }}>
                <Typography variant="body2">Brands will appear when products are loaded</Typography>
              </Box>
            </Box>
            
            {/* Type Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Type</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', color: 'text.secondary' }}>
                <Typography variant="body2">Product types will appear when products are loaded</Typography>
              </Box>
            </Box>
            
            
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => {
                setPriceRange([0, 2000]);
              }}
            >
              Clear All Filters
            </Button>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Combined Products Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Products - Amazon & Flipkart
            </Typography>
            
            {(isLoadingAmazon || isLoadingFlipkart) ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : combinedProducts.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Showing {combinedProducts.length} products from Amazon and Flipkart {gender !== 'all' ? `(${gender}'s only)` : ''}
                </Typography>
                <Grid container spacing={2}>
                {/* Filter by price and display combined products */}
                {combinedProducts
                  .filter(product => {
                    // Apply price filter
                    const price = Number(product.price);
                    return (!isNaN(price) && price >= priceRange[0] && price <= priceRange[1]);
                  })
                  .map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`${product.source}-${product.id}-${index}`}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={
                            product.image && 
                            product.image !== '' && 
                            !product.image.startsWith('data:') &&
                            !failedImages.has(product.id) 
                              ? product.image 
                              : product.source === 'Flipkart'
                                ? `https://placehold.co/400x400/2874f0/ffffff?text=${encodeURIComponent(product.name ? product.name.slice(0, 15) : 'Flipkart Product')}`
                                : product.source === 'Amazon'
                                  ? `https://placehold.co/400x400/ff9900/ffffff?text=${encodeURIComponent(product.name ? product.name.slice(0, 15) : 'Amazon Product')}`
                                  : `https://placehold.co/400x400/cccccc/333333?text=${encodeURIComponent(product.name ? product.name.slice(0, 15) : 'Product')}`
                          }
                          alt={product.name || 'Product'}
                          onError={(e) => handleImageError(e, product)}
                        />
                        {/* Favorite and Compare buttons */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            p: 1,
                          }}
                        >
                          <IconButton
                            onClick={() => handleToggleFavorite(product.id)}
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.7)',
                              mb: 1,
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            }}
                            size="small"
                          >
                            {favorites.includes(product.id) ? (
                              <FavoriteIcon color="error" />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </IconButton>
                          <IconButton
                            onClick={() => handleToggleCompare(product.id)}
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.7)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            }}
                            size="small"
                          >
                            <CompareArrowsIcon color={compareList.includes(product.id) ? 'primary' : 'inherit'} />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            bgcolor: 'rgba(0, 0, 0, 0.54)',
                            color: 'white',
                            padding: '5px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography variant="caption">
                            via {product.source}
                          </Typography>
                          <IconButton
                            href={validateProductUrl(product) ? (product.source_url || product.url) : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{ color: 'white' }}
                            aria-label={`Go to ${product.source}`}
                            disabled={!validateProductUrl(product)}
                          >
                            <LaunchIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h3">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {product.brand} • {product.type || 'Innerwear'}
                        </Typography>
                        {product.rating > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={product.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({product.rating_count || 0})
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                            ₹{product.price}
                          </Typography>
                          {product.original_price > 0 && product.original_price > product.price && (
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: 'line-through', mr: 1 }}
                              >
                                ₹{product.original_price}
                              </Typography>
                              <Typography variant="body2" color="error">
                                {Math.round((1 - product.price / product.original_price) * 100)}% off
                              </Typography>
                            </>
                          )}
                        </Box>
                      </CardContent>
                      <Divider />
                      <Box sx={{ p: 1 }}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          size="small"
                          href={validateProductUrl(product) ? (product.source_url || product.url) : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<LaunchIcon />}
                          disabled={!validateProductUrl(product)}
                        >
                          View on {product.source}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              </Box>
            ) }
          </Paper>
        </Grid>

        {/* Pagination */}
        <Grid item xs={12} md={9}>
          {combinedProducts.length > 0 && (
            <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <Pagination 
                count={400} 
                page={amazonPage}
                onChange={(e, value) => {
                  setAmazonPage(value);
                  // Update URL with new page number for persistence across reloads
                  const newParams = new URLSearchParams(window.location.search);
                  newParams.set('amazonPage', value);
                  // Update URL without full page reload
                  window.history.pushState({}, '', `${window.location.pathname}?${newParams}`);
                  // Scroll to top for better UX
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductsPage;
