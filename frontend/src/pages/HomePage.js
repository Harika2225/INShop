import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Container,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Sample featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Premium Cotton Boxer',
    image: 'https://via.placeholder.com/300x300?text=Product+1',
    brand: 'BrandX',
    price: 599,
    source: 'Amazon'
  },
  {
    id: 2,
    name: 'Soft Touch Brief Pack',
    image: 'https://via.placeholder.com/300x300?text=Product+2',
    brand: 'ComfortPlus',
    price: 499,
    source: 'Flipkart'
  },
  {
    id: 3,
    name: 'Seamless Hipster',
    image: 'https://via.placeholder.com/300x300?text=Product+3',
    brand: 'Elanica',
    price: 799,
    source: 'Myntra'
  },
  {
    id: 4,
    name: 'Sports Underwear',
    image: 'https://via.placeholder.com/300x300?text=Product+4',
    brand: 'ActiveWear',
    price: 899,
    source: 'Ajio'
  }
];

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          position: 'relative', 
          bgcolor: 'primary.main', 
          color: 'white', 
          mb: 4, 
          p: { xs: 3, md: 6 },
          borderRadius: 2
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Find Your Perfect Innerwear
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Compare prices and styles from Amazon, Flipkart, Myntra, and Ajio — all in one place.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={RouterLink}
                to="/products"
                sx={{ mt: 2 }}
              >
                Browse Products
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box 
              sx={{ 
                height: 300, 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h4">
                INShop
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card 
              sx={{ 
                height: 200, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              component={RouterLink}
              to="/products?gender=men"
              style={{ textDecoration: 'none' }}
            >
              <CardMedia
                component="img"
                height="100%"
                image="https://via.placeholder.com/600x300?text=Men's+Innerwear"
                alt="Men's Innerwear"
                sx={{ opacity: 0.7 }}
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h4" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Men's Innerwear
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card 
              sx={{ 
                height: 200, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              component={RouterLink}
              to="/products?gender=women"
              style={{ textDecoration: 'none' }}
            >
              <CardMedia
                component="img"
                height="100%"
                image="https://via.placeholder.com/600x300?text=Women's+Innerwear"
                alt="Women's Innerwear"
                sx={{ opacity: 0.7 }}
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h4" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Women's Innerwear
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {featuredProducts.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card 
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                component={RouterLink}
                to={`/products/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.brand}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
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
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary"
            component={RouterLink}
            to="/products"
            size="large"
          >
            View All Products
          </Button>
        </Box>
      </Box>

      {/* Shopping Sites Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          We Compare Across
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {['Amazon', 'Flipkart', 'Myntra', 'Ajio'].map((site) => (
            <Grid item key={site} xs={6} sm={3}>
              <Paper
                elevation={2}
                sx={{ 
                  p: 3, 
                  height: 100, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6">{site}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
