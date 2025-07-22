import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  Card,
  CardContent,
  Rating,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CompareArrows as CompareArrowsIcon,
  ShoppingCart as ShoppingCartIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import productService from '../services/productService';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const productId = parseInt(id);
  
  // State variables
  const [product, setProduct] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  // All useEffect hooks must be at the top level, before any conditional returns
  useEffect(() => {
    // Fetch product data from API
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Fetch product details from API
        const productData = await productService.getProductById(productId);
        setProduct(productData);
        
        if (productData) {
          // Set defaults if available
          if (productData.availableSizes && productData.availableSizes.length > 0) {
            setSelectedSize(productData.availableSizes[0]);
          }
          if (productData.availableColors && productData.availableColors.length > 0) {
            setSelectedColor(productData.availableColors[0]);
          }
          
          // Fetch similar products if available
          if (productData.similarProducts && productData.similarProducts.length > 0) {
            try {
              // Here we would make additional API calls to fetch similar products
              // For now, just set an empty array
              setSimilarProducts([]);
            } catch (error) {
              console.error('Error fetching similar products:', error);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product data');
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId]);

  // Display loading and error states
  if (loading) {
    return (
      <Container sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading product details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button component={RouterLink} to="/products" variant="contained">
          Back to Products
        </Button>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleNextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const handlePrevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const toggleCompare = () => {
    setIsCompare(!isCompare);
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Product not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/products" underline="hover" color="inherit">
          Products
        </Link>
        <Link
          component={RouterLink}
          to={`/products?gender=${product.gender}`}
          underline="hover"
          color="inherit"
        >
          {product.gender === 'men' ? "Men's" : "Women's"} Innerwear
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {/* Product Details */}
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ position: 'relative', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ position: 'relative', paddingTop: '100%' }}>
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '20px'
                  }}
                />
              )}
              
              {/* Image navigation buttons */}
              {product.images && product.images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                    }}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                    }}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Paper>
          
          {/* Thumbnail images */}
          {product.images && product.images.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {product.images.map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 60,
                    height: 60,
                    border: index === currentImageIndex ? '2px solid' : '1px solid',
                    borderColor: index === currentImageIndex ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>
        
        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>Brand:</Typography>
            <Typography variant="body1" fontWeight="medium">{product.brand}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {product.rating} ({product.reviews} reviews)
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" color="primary" sx={{ mr: 1 }}>
              ₹{product.price}
            </Typography>
            {product.originalPrice > product.price && (
              <>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through', mr: 1 }}
                >
                  ₹{product.originalPrice}
                </Typography>
                <Typography variant="body1" color="error">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </Typography>
              </>
            )}
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          
          {/* Size selection */}
          <Typography variant="subtitle1" gutterBottom>
            Size
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {product.availableSizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </Box>
          
          {/* Color selection */}
          <Typography variant="subtitle1" gutterBottom>
            Color
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {product.availableColors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </Button>
            ))}
          </Box>
          
          {/* Source info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Available on:
            </Typography>
            <Link href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
              {product.source}
            </Link>
          </Box>
          
          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              sx={{ flexGrow: 1 }}
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Now
            </Button>
            <Button
              variant={isFavorite ? 'contained' : 'outlined'}
              color={isFavorite ? 'secondary' : 'primary'}
              onClick={toggleFavorite}
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            >
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant={isCompare ? 'contained' : 'outlined'}
              color="primary"
              onClick={toggleCompare}
              startIcon={<CompareArrowsIcon />}
            >
              {isCompare ? 'Comparing' : 'Compare'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Product tabs: Details, Specifications, Reviews, Price Comparison */}
      <Box sx={{ width: '100%', mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="product tabs">
            <Tab label="Features" id="product-tab-0" />
            <Tab label="Specifications" id="product-tab-1" />
            <Tab label="Reviews" id="product-tab-2" />
            <Tab label="Price Comparison" id="product-tab-3" />
          </Tabs>
        </Box>
        
        {/* Features Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Product Features</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {product.features.map((feature, index) => (
              <Typography component="li" key={index} sx={{ mb: 1 }}>
                {feature}
              </Typography>
            ))}
          </Box>
        </TabPanel>
        
        {/* Specifications Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Product Specifications</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableBody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell component="th" sx={{ fontWeight: 'medium', width: '30%' }}>
                      {key}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
          
          {product && product.reviews ? (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1">
                  Average Rating: {product.rating || 0} out of 5
                </Typography>
                <Rating value={product.rating || 0} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {typeof product.reviews === 'number' ? `Based on ${product.reviews} reviews` : 'No reviews yet'}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* If we had review data objects, we would map through them here */}
              <Typography variant="body2" color="text.secondary">
                Detailed review data not available at this time.
              </Typography>
            </>
          ) : (
            <Typography>No reviews yet for this product.</Typography>
          )}
        </TabPanel>
        
        {/* Price Comparison Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Price Comparison</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Original Price</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product && product.source ? (
                  <TableRow key={product.id}>
                    <TableCell>{product.source}</TableCell>
                    <TableCell>₹{product.price?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      {product.originalPrice ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          ₹{product.originalPrice.toLocaleString()}
                        </Typography>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {product.price && product.originalPrice ? 
                        `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {product.inStock !== undefined ? (
                        product.inStock ? (
                          <Typography color="success.main">In Stock</Typography>
                        ) : (
                          <Typography color="error">Out of Stock</Typography>
                        )
                      ) : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={product.inStock === false}
                        href={product.sourceUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography align="center">No price comparison data available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Similar Products
          </Typography>
          <Grid container spacing={3}>
            {similarProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }} component={RouterLink} to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                      alt={product.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.brand}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" color="primary">
                        ₹{product.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        via {product.source}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetailPage;
