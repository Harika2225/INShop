import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  Card,
  CardMedia,
  Alert,
  Rating,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Sample products data (will be replaced with actual data from API or localStorage)
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
    type: 'Boxer',
    material: '100% Cotton',
    fit: 'Regular',
    pattern: 'Solid',
    rise: 'Mid Rise',
    occasion: 'Casual',
    care: 'Machine wash',
    features: [
      'Made from 100% premium cotton',
      'Elastic waistband for comfortable fit',
      'Breathable fabric',
      'Machine washable',
    ],
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
    type: 'Brief',
    material: '95% Cotton, 5% Elastane',
    fit: 'Regular',
    pattern: 'Solid',
    rise: 'Mid Rise',
    occasion: 'Casual',
    care: 'Machine wash cold',
    features: [
      'Pack of 3 briefs',
      'Cotton blend fabric',
      'Tagless design for added comfort',
      'Reinforced stitching',
    ],
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
    type: 'Trunk',
    material: '70% Bamboo Fiber, 30% Cotton',
    fit: 'Slim',
    pattern: 'Solid',
    rise: 'Low Rise',
    occasion: 'Casual',
    care: 'Machine wash cold, gentle cycle',
    features: [
      'Made from sustainable bamboo fiber',
      'Anti-bacterial and moisture-wicking',
      'Super soft and comfortable',
      'Eco-friendly packaging',
    ],
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
    type: 'Brief',
    material: '100% Organic Cotton',
    fit: 'Regular',
    pattern: 'Solid',
    rise: 'Mid Rise',
    occasion: 'Casual',
    care: 'Machine wash cold',
    features: [
      'Made from GOTS certified organic cotton',
      'No harmful chemicals or dyes',
      'Eco-friendly production',
      'Soft and breathable',
    ],
  }
];

const ComparisonPage = () => {
  const [compareList, setCompareList] = useState([]);
  const [productsToCompare, setProductsToCompare] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // In a real application, this would fetch from localStorage or an API
    // Get compare list from localStorage
    const storedCompareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    setCompareList(storedCompareList);
    
    // Get favorites from localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    
    // For this example, we'll filter the sample products
    if (storedCompareList.length > 0) {
      const filteredProducts = sampleProducts.filter(product => 
        storedCompareList.includes(product.id)
      );
      setProductsToCompare(filteredProducts);
    }
  }, []);

  const handleRemoveFromComparison = (id) => {
    const updatedCompareList = compareList.filter(itemId => itemId !== id);
    setCompareList(updatedCompareList);
    setProductsToCompare(productsToCompare.filter(product => product.id !== id));
    
    // Update localStorage
    localStorage.setItem('compareList', JSON.stringify(updatedCompareList));
  };

  const handleToggleFavorite = (id) => {
    let updatedFavorites;
    
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(itemId => itemId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    
    setFavorites(updatedFavorites);
    
    // Update localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const getMinPrice = () => {
    if (productsToCompare.length === 0) return null;
    const minPriceProduct = productsToCompare.reduce((min, product) => 
      product.price < min.price ? product : min, productsToCompare[0]);
    return minPriceProduct.id;
  };
  
  const getMaxRating = () => {
    if (productsToCompare.length === 0) return null;
    const maxRatingProduct = productsToCompare.reduce((max, product) => 
      product.rating > max.rating ? product : max, productsToCompare[0]);
    return maxRatingProduct.id;
  };

  const minPriceId = getMinPrice();
  const maxRatingId = getMaxRating();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Compare Products</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Product Comparison
      </Typography>

      {productsToCompare.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          {/* Product Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {productsToCompare.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.name}
                    />
                    {product.id === minPriceId && (
                      <Chip 
                        label="Best Price" 
                        color="success" 
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10
                        }}
                      />
                    )}
                    {product.id === maxRatingId && (
                      <Chip 
                        label="Top Rated" 
                        color="primary" 
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: product.id === minPriceId ? 40 : 10,
                          left: 10
                        }}
                      />
                    )}
                    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                      <IconButton
                        onClick={() => handleToggleFavorite(product.id)}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.8)',
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
                  <Box sx={{ p: 2, flexGrow: 1 }}>
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
                  </Box>
                  <Divider />
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      variant="contained"
                      component={RouterLink}
                      to={`/products/${product.id}`}
                    >
                      View Details
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFromComparison(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Comparison Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Feature</TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id} sx={{ fontWeight: 'medium' }}>
                      {product.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Brand */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Brand
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.brand}</TableCell>
                  ))}
                </TableRow>
                
                {/* Price */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Price
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell 
                      key={product.id} 
                      sx={product.id === minPriceId ? { 
                        color: 'success.main', 
                        fontWeight: 'bold' 
                      } : {}}
                    >
                      ₹{product.price}
                      {product.id === minPriceId && " (Best Price)"}
                    </TableCell>
                  ))}
                </TableRow>
                
                {/* Rating */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Rating
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell 
                      key={product.id}
                      sx={product.id === maxRatingId ? { 
                        fontWeight: 'bold' 
                      } : {}}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={product.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {product.rating} ({product.reviews} reviews)
                          {product.id === maxRatingId && " (Top Rated)"}
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
                
                {/* Source */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Source
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.source}</TableCell>
                  ))}
                </TableRow>
                
                {/* Type */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Type
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.type}</TableCell>
                  ))}
                </TableRow>
                
                {/* Material */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Material
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.material}</TableCell>
                  ))}
                </TableRow>
                
                {/* Fit */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Fit
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.fit}</TableCell>
                  ))}
                </TableRow>
                
                {/* Pattern */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Pattern
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.pattern}</TableCell>
                  ))}
                </TableRow>
                
                {/* Rise */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Rise
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.rise}</TableCell>
                  ))}
                </TableRow>
                
                {/* Occasion */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Occasion
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.occasion}</TableCell>
                  ))}
                </TableRow>
                
                {/* Care Instructions */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Care Instructions
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>{product.care}</TableCell>
                  ))}
                </TableRow>
                
                {/* Features */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ bgcolor: 'background.default', fontWeight: 'medium' }}>
                    Features
                  </TableCell>
                  {productsToCompare.map(product => (
                    <TableCell key={product.id}>
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No products selected for comparison
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Browse products and click the compare icon to add items for comparison.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/products"
          >
            Browse Products
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default ComparisonPage;
