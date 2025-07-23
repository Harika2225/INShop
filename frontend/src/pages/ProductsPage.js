import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Pagination,
  Button,
  IconButton,
  Chip,
  Divider,
  Paper,
  Rating,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CompareArrows as CompareArrowsIcon,
  FilterAlt as FilterAltIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import productService from '../services/productService';

// No static product data - all data is fetched from APIs

// Dynamic lists will be populated from API data
const sources = ['Amazon']; // Only Amazon source is active per requirements

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const genderParam = queryParams.get('gender');
  
  // State for filters
  const [gender, setGender] = useState(genderParam || 'all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [amazonProducts, setAmazonProducts] = useState([]);
  const [isLoadingAmazon, setIsLoadingAmazon] = useState(false);
  const amazonDirectUrl = 'https://www.amazon.in/s?i=apparel&rh=n%3A1968126031&s=popularity-rank&fs=true'; // Default to using the direct URL
  const [amazonPage, setAmazonPage] = useState(1);
  
  // Fetch products from Amazon
  const fetchAmazonProducts = useCallback(async () => {
    try {
      setIsLoadingAmazon(true);
      // Always use the direct URL approach with pagination
      const data = await productService.getAmazonProducts(
        null, // No search term, use direct URL
        gender !== 'all' ? gender : undefined,
        amazonPage,
        amazonDirectUrl
      );
      
      console.log(`Fetched Amazon products (page ${amazonPage})`, data);
      setAmazonProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching Amazon products:', error);
      setAmazonProducts([]);
    } finally {
      setIsLoadingAmazon(false);
    }
  }, [gender, amazonPage, amazonDirectUrl]);
  
  // Load initial data
  useEffect(() => {
    // Initialize with empty array since database functionality is not in use as per requirement
    setProducts([]);
    
    // Fetch Amazon products on page load
    fetchAmazonProducts();
  }, [fetchAmazonProducts]);
  
  // No need for search handlers as we're using direct URL approach

  // Apply filters
  useEffect(() => {
    let filtered = [...products];
    
    // Apply gender filter
    if (gender !== 'all') {
      filtered = filtered.filter(product => product.gender === gender);
    }
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }
    
    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(product => selectedTypes.includes(product.type));
    }
    
    // Apply source filter
    if (selectedSources.length > 0) {
      filtered = filtered.filter(product => selectedSources.includes(product.source));
    }
    
    // Apply price range filter
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(term) || 
          product.brand.toLowerCase().includes(term) ||
          product.type.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, gender, selectedBrands, selectedTypes, selectedSources, priceRange, sortBy, searchTerm]);
  
  // Handle pagination
  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage, 
    page * productsPerPage
  );

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
  
  // Handle filter change for brands
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };
  
  // Handle filter change for types
  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  // Handle filter change for sources
  const handleSourceChange = (source) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
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
                  onChange={(e) => setGender(e.target.value)}
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
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={2000}
                step={100}
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
            
            {/* Source Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Source</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {sources.map((source) => (
                  <FormControlLabel
                    key={source}
                    control={
                      <Checkbox 
                        checked={selectedSources.includes(source)}
                        onChange={() => handleSourceChange(source)}
                        size="small"
                      />
                    }
                    label={source}
                  />
                ))}
              </Box>
            </Box>
            
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => {
                setSelectedBrands([]);
                setSelectedTypes([]);
                setSelectedSources([]);
                setPriceRange([0, 2000]);
                setSearchTerm('');
              }}
            >
              Clear All Filters
            </Button>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Amazon Products Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Amazon Products - Inners
            </Typography>
            
            {isLoadingAmazon ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : amazonProducts.length > 0 && (
              <Grid container spacing={2}>
                {amazonProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`amazon-${product.id || index}`}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.image && product.image !== '' ? product.image : `https://via.placeholder.com/300x300/cccccc/333333?text=${encodeURIComponent('Product')}`}
                          alt={product.name || 'Product'}
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
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{ color: 'white' }}
                            aria-label="Go to Amazon"
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
                              ({product.reviews_count || 0})
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
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<LaunchIcon />}
                        >
                          View on Amazon
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) }
          </Paper>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          
          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination 
                count={totalPages} 
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
          
          {/* Amazon Products Pagination */}
          {amazonProducts.length > 0 && (
            <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <Pagination 
                count={10} /* Assuming 10 pages max - this could be dynamically set based on API response */
                page={amazonPage}
                onChange={(e, value) => {
                  setAmazonPage(value);
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
