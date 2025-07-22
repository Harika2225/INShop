-- Create INShop Database
CREATE DATABASE IF NOT EXISTS inshop;

-- Connect to the database
\c inshop;

-- Create enum type for gender
CREATE TYPE gender_enum AS ENUM ('men', 'women', 'unisex');

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    gender gender_enum NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    material VARCHAR(255),
    fit VARCHAR(100),
    pattern VARCHAR(100),
    rise VARCHAR(100),
    occasion VARCHAR(100),
    care_instructions TEXT,
    features VARCHAR(255)[],
    available_sizes VARCHAR(20)[],
    available_colors VARCHAR(50)[],
    images VARCHAR(500)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sources table
CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    base_url VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    search_endpoint VARCHAR(255),
    product_endpoint VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product-Source association table
CREATE TABLE IF NOT EXISTS product_source (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    source_id INTEGER REFERENCES sources(id) ON DELETE CASCADE,
    source_product_id VARCHAR(255),
    source_url VARCHAR(500),
    price FLOAT,
    original_price FLOAT,
    in_stock BOOLEAN DEFAULT TRUE,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, source_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    source_id INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(255),
    rating FLOAT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    source_review_id VARCHAR(255),
    source_url VARCHAR(500),
    verified_purchase INTEGER DEFAULT 0,
    review_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial sources
INSERT INTO sources (name, base_url, logo_url, search_endpoint, product_endpoint)
VALUES
    ('Amazon', 'https://www.amazon.in', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', '/s?k=', '/dp/'),
    ('Flipkart', 'https://www.flipkart.com', 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png', '/search?q=', '/'),
    ('Myntra', 'https://www.myntra.com', 'https://constant.myntassets.com/web/assets/img/logo_myntra.png', '/:category/:keyword', '/:brand/:productName/:p/:id'),
    ('Ajio', 'https://www.ajio.com', 'https://assets.ajio.com/static/img/Ajio-Logo.svg', '/s/', '/p/')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, brand, gender, type, description, material, fit, pattern, rise, occasion, care_instructions, features, available_sizes, available_colors, images)
VALUES
    ('Premium Cotton Boxer', 'BrandX', 'men', 'Boxer', 'Premium quality cotton boxer for everyday comfort', '100% Cotton', 'Regular', 'Solid', 'Mid Rise', 'Casual', 'Machine wash', ARRAY['Made from 100% premium cotton', 'Elastic waistband for comfortable fit', 'Breathable fabric', 'Machine washable'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy Blue'], ARRAY['https://via.placeholder.com/500x500?text=Product+1']),
    
    ('Soft Touch Brief Pack', 'ComfortPlus', 'men', 'Brief', 'Pack of 3 briefs made from soft touch fabric', '95% Cotton, 5% Elastane', 'Regular', 'Solid', 'Mid Rise', 'Casual', 'Machine wash cold', ARRAY['Pack of 3 briefs', 'Cotton blend fabric', 'Tagless design for added comfort', 'Reinforced stitching'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Grey'], ARRAY['https://via.placeholder.com/500x500?text=Product+2']),
    
    ('Seamless Hipster', 'Elanica', 'women', 'Hipster', 'Seamless hipster panty for everyday comfort', '92% Nylon, 8% Spandex', 'Slim', 'Solid', 'Mid Rise', 'Casual', 'Hand wash', ARRAY['Seamless construction', 'No visible panty lines', 'Soft waistband', 'Breathable fabric'], ARRAY['XS', 'S', 'M', 'L'], ARRAY['Nude', 'Black', 'Pink'], ARRAY['https://via.placeholder.com/500x500?text=Product+3']),
    
    ('Wirefree T-shirt Bra', 'ComfortFit', 'women', 'Bra', 'Comfortable wirefree t-shirt bra for everyday wear', '85% Nylon, 15% Spandex', 'Regular', 'Solid', NULL, 'Casual', 'Hand wash cold', ARRAY['Wire-free cups', 'Seamless finish', 'Wide straps for comfort', 'Hook and eye closure'], ARRAY['32A', '32B', '34A', '34B', '36B'], ARRAY['Beige', 'Black', 'White'], ARRAY['https://via.placeholder.com/500x500?text=Product+4']);

-- Insert product-source associations with prices
INSERT INTO product_source (product_id, source_id, source_product_id, source_url, price, original_price)
VALUES
    (1, 1, 'B07XXX1', 'https://www.amazon.in/dp/B07XXX1', 599, 799),
    (1, 2, 'BOXPREMX', 'https://www.flipkart.com/boxpremx', 649, 799),
    (1, 3, 'brandx-premium-cotton-boxer-p-12345', 'https://www.myntra.com/brandx/premium-cotton-boxer/p/12345', 699, 899),
    
    (2, 1, 'B07XXX2', 'https://www.amazon.in/dp/B07XXX2', 499, 599),
    (2, 2, 'BRFSOFT3', 'https://www.flipkart.com/brfsoft3', 459, 599),
    
    (3, 3, 'elanica-seamless-hipster-p-23456', 'https://www.myntra.com/elanica/seamless-hipster/p/23456', 799, 999),
    (3, 4, '462751', 'https://www.ajio.com/p/462751', 749, 949),
    
    (4, 3, 'comfortfit-wirefree-bra-p-34567', 'https://www.myntra.com/comfortfit/wirefree-bra/p/34567', 899, 1099),
    (4, 4, '582943', 'https://www.ajio.com/p/582943', 849, 1099);

-- Insert sample reviews
INSERT INTO reviews (product_id, source_id, reviewer_name, rating, title, content, verified_purchase)
VALUES
    (1, 1, 'John D.', 4.5, 'Great comfortable boxer', 'Very comfortable for daily wear. Good quality cotton.', 2),
    (1, 2, 'Mike S.', 4.0, 'Good product', 'Comfortable fit but slightly expensive.', 2),
    
    (2, 1, 'Robert K.', 4.2, 'Value for money', 'Good quality briefs for the price. Would buy again.', 2),
    
    (3, 3, 'Sarah L.', 4.7, 'Best hipsters ever!', 'Super comfortable and truly seamless. Ordering more!', 2),
    (3, 4, 'Emily R.', 4.5, 'Great quality', 'Love the material and fit. No visible lines under clothes.', 1),
    
    (4, 3, 'Jessica M.', 4.8, 'Very comfortable', 'Best wirefree bra I have ever used. Perfect for everyday wear.', 2);
