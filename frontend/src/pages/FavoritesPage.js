import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Divider,
  Paper,
  Rating,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CompareArrows as CompareArrowsIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Sample favorite products data (will be replaced with actual data from localStorage or API)
const sampleFavorites = [
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
  }
];

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    // In a real application, this would fetch from localStorage or an API
    setFavorites(sampleFavorites);
    
    // Initialize compare list from localStorage
    const storedCompareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    setCompareList(storedCompareList);
  }, []);

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(product => product.id !== id));
    // In a real application, also update localStorage or make API call
  };

  const handleToggleCompare = (productId) => {
    let updatedCompareList;
    
    if (compareList.includes(productId)) {
      updatedCompareList = compareList.filter(id => id !== productId);
    } else {
      if (compareList.length < 4) { // Limit comparison to 4 items
        updatedCompareList = [...compareList, productId];
      } else {
        alert('You can compare up to 4 products at a time');
        return;
      }
    }
    
    setCompareList(updatedCompareList);
    // Update localStorage
    localStorage.setItem('compareList', JSON.stringify(updatedCompareList));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Favorites</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Your Favorite Products
      </Typography>

      {favorites.length > 0 ? (
        <>
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
              <Box>
                <Typography variant="subtitle1">
                  {compareList.length} {compareList.length === 1 ? 'item' : 'items'} selected for comparison
                </Typography>
              </Box>
              <Button 
                variant="contained"
                color="primary"
                startIcon={<CompareArrowsIcon />}
                component={RouterLink}
                to="/compare"
              >
                Compare Products
              </Button>
            </Paper>
          )}

          <Grid container spacing={3}>
            {favorites.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      variant="contained"
                      component={RouterLink}
                      to={`/products/${product.id}`}
                    >
                      View Details
                    </Button>
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleToggleCompare(product.id)}
                        sx={{ mr: 1 }}
                      >
                        <CompareArrowsIcon color={compareList.includes(product.id) ? 'primary' : 'inherit'} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFavorite(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            You don't have any favorites yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Browse products and click the heart icon to add items to your favorites.
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

export default FavoritesPage;
