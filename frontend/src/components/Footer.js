import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton 
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Twitter as TwitterIcon, 
  Instagram as InstagramIcon, 
  GitHub as GitHubIcon 
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              INShop
            </Typography>
            <Typography variant="body2">
              Your one-stop destination for comparing and finding the best innerwear products across 
              multiple e-commerce platforms including Amazon, Flipkart, Myntra, and Ajio.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="GitHub">
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link 
                component={RouterLink} 
                to="/"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Home
              </Link>
              <Link 
                component={RouterLink} 
                to="/products?gender=men"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Men's Innerwear
              </Link>
              <Link 
                component={RouterLink} 
                to="/products?gender=women"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Women's Innerwear
              </Link>
              <Link 
                component={RouterLink} 
                to="/favorites"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Favorites
              </Link>
              <Link 
                component={RouterLink} 
                to="/compare"
                color="inherit"
                sx={{ display: 'block' }}
              >
                Compare Products
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Sources
            </Typography>
            <Box>
              <Link 
                href="https://www.amazon.com" 
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Amazon
              </Link>
              <Link 
                href="https://www.flipkart.com" 
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Flipkart
              </Link>
              <Link 
                href="https://www.myntra.com" 
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                Myntra
              </Link>
              <Link 
                href="https://www.ajio.com" 
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ display: 'block' }}
              >
                Ajio
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.2)', pt: 2 }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} INShop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
