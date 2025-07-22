import React, { useState, useEffect } from 'react';
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
  InputLabel,
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
  Rating
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CompareArrows as CompareArrowsIcon,
  FilterAlt as FilterAltIcon
} from '@mui/icons-material';

// Sample product data (will be replaced with API calls)
const sampleProducts = [
  {
    id: 1,
    name: 'Premium Cotton Boxer',
    image: 'https://via.placeholder.com/300x300?text=Product+1',
    brand: 'BrandX',
    price: 599,
    originalPrice: 799,
    source: 'Amazon',
    gender: 'men',
    rating: 4.5,
    reviews: 128,
    type: 'Boxer'
  },
  {
    id: 2,
    name: 'Soft Touch Brief Pack',
    image: 'https://via.placeholder.com/300x300?text=Product+2',
    brand: 'ComfortPlus',
    price: 499,
    originalPrice: 599,
    source: 'Flipkart',
    gender: 'men',
    rating: 4.2,
    reviews: 87,
    type: 'Brief'
  },
  {
    id: 3,
    name: 'Seamless Hipster',
    image: 'https://via.placeholder.com/300x300?text=Product+3',
    brand: 'Elanica',
    price: 799,
    originalPrice: 999,
    source: 'Myntra',
    gender: 'women',
    rating: 4.7,
    reviews: 154,
    type: 'Hipster'
  },
  {
    id: 4,
    name: 'Sports Underwear',
    image: 'https://via.placeholder.com/300x300?text=Product+4',
    brand: 'ActiveWear',
    price: 899,
    originalPrice: 1099,
    source: 'Ajio',
    gender: 'men',
    rating: 4.8,
    reviews: 92,
    type: 'Sports'
  },
  {
    id: 5,
    name: 'Cotton Bikini Pack',
    image: 'https://via.placeholder.com/300x300?text=Product+5',
    brand: 'LadyComfort',
    price: 699,
    originalPrice: 899,
    source: 'Amazon',
    gender: 'women',
    rating: 4.3,
    reviews: 67,
    type: 'Bikini'
  },
  {
    id: 6,
    name: 'Bamboo Fiber Trunk',
    image: 'https://via.placeholder.com/300x300?text=Product+6',
    brand: 'EcoWear',
    price: 799,
    originalPrice: 999,
    source: 'Myntra',
    gender: 'men',
    rating: 4.6,
    reviews: 41,
    type: 'Trunk'
  },
  {
    id: 7,
    name: 'Modal Thong',
    image: 'https://via.placeholder.com/300x300?text=Product+7',
    brand: 'Sleekfit',
    price: 499,
    originalPrice: 599,
    source: 'Ajio',
    gender: 'women',
    rating: 4.4,
    reviews: 38,
    type: 'Thong'
  },
  {
    id: 8,
    name: 'Organic Cotton Briefs',
    image: 'https://via.placeholder.com/300x300?text=Product+8',
    brand: 'GreenBasics',
    price: 599,
    originalPrice: 699,
    source: 'Flipkart',
    gender: 'men',
    rating: 4.2,
    reviews: 76,
    type: 'Brief'
  }
];

const brands = ['BrandX', 'ComfortPlus', 'Elanica', 'ActiveWear', 'LadyComfort', 'EcoWear', 'Sleekfit', 'GreenBasics'];
const sources = ['Amazon', 'Flipkart', 'Myntra', 'Ajio'];
const types = ['Boxer', 'Brief', 'Hipster', 'Sports', 'Bikini', 'Trunk', 'Thong'];

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
  
  // Load initial data
  useEffect(() => {
    // This would be replaced with an API call in a real application
    setProducts(sampleProducts);
  }, []);

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
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {brands.map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        size="small"
                      />
                    }
                    label={brand}
                  />
                ))}
              </Box>
            </Box>
            
            {/* Type Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Type</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {types.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox 
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        size="small"
                      />
                    }
                    label={type}
                  />
                ))}
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
        
        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h5">
                  {gender === 'men' ? "Men's Innerwear" : 
                   gender === 'women' ? "Women's Innerwear" : 
                   "All Innerwear Products"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredProducts.length} products found
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <TextField
                    placeholder="Search products"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mr: 2, width: { xs: '100%', sm: '200px' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl size="small" sx={{ width: { xs: '100%', sm: '180px' } }}>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="popularity">Popularity</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            
            {/* Active Filters */}
            {(selectedBrands.length > 0 || selectedTypes.length > 0 || selectedSources.length > 0 || searchTerm) && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedBrands.map(brand => (
                  <Chip 
                    key={`brand-${brand}`}
                    label={`Brand: ${brand}`}
                    onDelete={() => handleBrandChange(brand)}
                    size="small"
                  />
                ))}
                {selectedTypes.map(type => (
                  <Chip 
                    key={`type-${type}`}
                    label={`Type: ${type}`}
                    onDelete={() => handleTypeChange(type)}
                    size="small"
                  />
                ))}
                {selectedSources.map(source => (
                  <Chip 
                    key={`source-${source}`}
                    label={`Source: ${source}`}
                    onDelete={() => handleSourceChange(source)}
                    size="small"
                  />
                ))}
                {searchTerm && (
                  <Chip 
                    label={`Search: ${searchTerm}`}
                    onDelete={() => setSearchTerm('')}
                    size="small"
                  />
                )}
              </Box>
            )}
          </Box>
          
          {/* Compare bar if items are selected for comparison */}
          {compareList.length > 0 && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                mb: 3, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center' 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  {compareList.length} {compareList.length === 1 ? 'item' : 'items'} selected for comparison
                </Typography>
                {compareList.map(id => {
                  const product = products.find(p => p.id === id);
                  return (
                    <Chip 
                      key={id}
                      label={product?.name}
                      onDelete={() => handleToggleCompare(id)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  );
                })}
              </Box>
              <Button 
                variant="contained"
                color="primary"
                startIcon={<CompareArrowsIcon />}
                component="a"
                href="/compare"
              >
                Compare
              </Button>
            </Paper>
          )}
          
          {/* Product grid */}
          {displayedProducts.length > 0 ? (
            <Grid container spacing={3}>
              {displayedProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleFavorite(product.id);
                          }}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.8)',
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleCompare(product.id);
                          }}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.8)',
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
                        }}
                      >
                        <Typography variant="caption">
                          via {product.source}
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h3">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {product.brand} • {product.type}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={product.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({product.reviews})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                          ₹{product.price}
                        </Typography>
                        {product.originalPrice > product.price && (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through', mr: 1 }}
                            >
                              ₹{product.originalPrice}
                            </Typography>
                            <Typography variant="body2" color="error">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                            </Typography>
                          </>
                        )}
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        size="small"
                        href={`/products/${product.id}`}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">No products match your filters</Typography>
              <Typography variant="body2" color="text.secondary">
                Try changing your search criteria or clearing some filters
              </Typography>
            </Paper>
          )}
          
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductsPage;
