import requests
import time
import re
import json
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from fake_useragent import UserAgent
from app.models.product import Product, GenderEnum
from app.models.source import Source
from app.schemas.product import ProductCreate, ProductFilter
from app.config import settings
from app.services.product_service import create_product, get_product_by_id

# Initialize fake user agent generator
ua = UserAgent()

def get_random_user_agent():
    """Get a random user agent to avoid detection"""
    return ua.random

def make_request(url: str, timeout: int = settings.REQUEST_TIMEOUT):
    """Make HTTP request with error handling and rate limiting"""
    headers = {
        'User-Agent': get_random_user_agent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        
        # Rate limiting to avoid being blocked
        time.sleep(settings.SCRAPING_RATE_LIMIT)
        
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def scrape_amazon(query: str, gender: Optional[GenderEnum] = None, db: Session = None):
    """Scrape Amazon for innerwear products"""
    # Build the search URL
    search_term = f"{gender.value if gender else ''} innerwear {query}".strip()
    encoded_search = search_term.replace(' ', '+')
    url = f"{settings.AMAZON_URL}/s?k={encoded_search}"
    
    # Make request
    html_content = make_request(url)
    if not html_content:
        return []
    
    # Parse the HTML
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Find product containers
    product_containers = soup.select('div[data-component-type="s-search-result"]')
    
    products = []
    source = db.query(Source).filter(Source.name == "Amazon").first()
    
    for container in product_containers:
        try:
            # Extract product data
            asin = container.get('data-asin')
            if not asin:
                continue
            
            # Title
            title_element = container.select_one('h2 a span')
            title = title_element.text.strip() if title_element else ""
            
            # Brand (usually part of title or separate)
            brand = extract_brand_from_title(title)
            
            # Price
            price_element = container.select_one('.a-price-whole')
            price_fraction = container.select_one('.a-price-fraction')
            price = 0
            if price_element:
                price = float(price_element.text.replace(',', ''))
                if price_fraction:
                    price += float(f"0.{price_fraction.text}")
            
            # Original price
            original_price_element = container.select_one('.a-text-price span')
            original_price = None
            if original_price_element:
                original_price_text = original_price_element.text.strip()
                original_price_match = re.search(r'[\d,]+', original_price_text)
                if original_price_match:
                    original_price = float(original_price_match.group().replace(',', ''))
            
            # URL
            url_element = container.select_one('h2 a')
            product_url = settings.AMAZON_URL + url_element.get('href') if url_element else None
            
            # Image
            img_element = container.select_one('img')
            image_url = img_element.get('src') if img_element else None
            
            # Rating
            rating_element = container.select_one('.a-icon-star-small')
            rating = None
            if rating_element:
                rating_text = rating_element.text.strip()
                rating_match = re.search(r'([\d.]+)', rating_text)
                if rating_match:
                    rating = float(rating_match.group(1))
            
            # Type - try to identify from title
            product_type = identify_innerwear_type(title, gender)
            
            # Create product dict
            product_data = {
                "id": asin,
                "name": title,
                "brand": brand,
                "gender": gender.value if gender else "unisex",
                "type": product_type,
                "price": price,
                "original_price": original_price,
                "source": "Amazon",
                "source_url": product_url,
                "image": image_url,
                "rating": rating
            }
            
            products.append(product_data)
        except Exception as e:
            print(f"Error parsing Amazon product: {e}")
    
    return products

def scrape_flipkart(query: str, gender: Optional[GenderEnum] = None, db: Session = None, task_id: str = None):
    """Scrape Flipkart for innerwear products"""
    # Build the search URL
    search_term = f"{gender.value if gender else ''} innerwear {query}".strip()
    encoded_search = search_term.replace(' ', '+')
    url = f"{settings.FLIPKART_URL}/search?q={encoded_search}"
    
    # Make request
    html_content = make_request(url)
    if not html_content:
        return []
    
    # Parse the HTML
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Find product containers - Flipkart typically uses divs with specific classes for product cards
    product_containers = soup.select('div._1AtVbE div._13oc-S')
    
    products = []
    source = db.query(Source).filter(Source.name == "Flipkart").first()
    
    for container in product_containers:
        try:
            # Extract product data
            # Extract product link which contains product ID
            link_element = container.select_one('a._1fQZEK')
            if not link_element:
                link_element = container.select_one('a._2rpwqI')
                
            if not link_element:
                continue
                
            product_url = 'https://www.flipkart.com' + link_element.get('href')
            
            # Extract product ID from URL
            product_id_match = re.search(r'pid=([\w\d]+)', product_url)
            product_id = product_id_match.group(1) if product_id_match else f"flipkart_{time.time()}"
            
            # Title
            title_element = container.select_one('div._4rR01T')
            if not title_element:
                title_element = container.select_one('a.s1Q9rs')
                
            title = title_element.text.strip() if title_element else ""
            
            # Brand (usually part of title or separate)
            brand = extract_brand_from_title(title)
            
            # Price
            price_element = container.select_one('div._30jeq3')
            price = 0
            if price_element:
                price_text = price_element.text.strip()
                price_match = re.search(r'[\d,]+', price_text)
                if price_match:
                    price = float(price_match.group().replace(',', ''))
            
            # Original price
            original_price_element = container.select_one('div._3I9_wc')
            original_price = None
            if original_price_element:
                original_price_text = original_price_element.text.strip()
                original_price_match = re.search(r'[\d,]+', original_price_text)
                if original_price_match:
                    original_price = float(original_price_match.group().replace(',', ''))
            
            # Image
            img_element = container.select_one('img._396cs4')
            if not img_element:
                img_element = container.select_one('img._2r_T1I')
                
            image_url = img_element.get('src') if img_element else None
            
            # Rating
            rating_element = container.select_one('div._3LWZlK')
            rating = None
            if rating_element:
                try:
                    rating = float(rating_element.text.strip())
                except ValueError:
                    pass
            
            # Rating count
            rating_count_element = container.select_one('span._2_R_DZ')
            rating_count = 0
            if rating_count_element:
                count_text = rating_count_element.text
                count_match = re.search(r'([\d,]+)\s+ratings', count_text)
                if count_match:
                    rating_count = int(count_match.group(1).replace(',', ''))
            
            # Determine product type
            product_type = identify_innerwear_type(title, gender)
            
            # Create product dict
            product_data = {
                "id": product_id,
                "name": title,
                "brand": brand,
                "gender": gender.value if gender else "unisex",
                "type": product_type,
                "price": price,
                "original_price": original_price,
                "source": "Flipkart",
                "source_url": product_url,
                "image": image_url,
                "rating": rating,
                "rating_count": rating_count
            }
            
            products.append(product_data)
            
            # If we have a database session, store the product
            if db and source:
                try:
                    # Check if product exists
                    existing_product = db.query(Product).filter(
                        Product.name == title,
                        Product.brand == brand,
                        Product.gender == (gender if gender else GenderEnum.unisex)
                    ).first()
                    
                    if not existing_product:
                        # Create new product
                        new_product = Product(
                            name=title,
                            brand=brand,
                            gender=gender if gender else GenderEnum.unisex,
                            type=product_type,
                            description=title,  # Use title as description for now
                            images=[image_url] if image_url else []
                        )
                        
                        # Create source association
                        new_product.sources.append({
                            "source_id": source.id,
                            "source_product_id": product_id,
                            "source_url": product_url,
                            "price": price,
                            "original_price": original_price,
                            "in_stock": True
                        })
                        
                        db.add(new_product)
                        db.commit()
                    else:
                        # Update existing product
                        # Check if this source already exists for the product
                        source_exists = False
                        for src in existing_product.sources:
                            if src.source_id == source.id:
                                src.price = price
                                src.original_price = original_price
                                src.last_checked = time.time()
                                source_exists = True
                                break
                                
                        if not source_exists:
                            # Add new source association
                            existing_product.sources.append({
                                "source_id": source.id,
                                "source_product_id": product_id,
                                "source_url": product_url,
                                "price": price,
                                "original_price": original_price,
                                "in_stock": True
                            })
                            
                        db.commit()
                        
                except Exception as e:
                    db.rollback()
                    print(f"Error saving Flipkart product to database: {e}")
            
        except Exception as e:
            print(f"Error parsing Flipkart product: {e}")
    
    return products

def scrape_myntra(query: str, gender: Optional[GenderEnum] = None, db: Session = None, task_id: str = None):
    """Scrape Myntra for innerwear products"""
    # Build the search URL
    gender_segment = "men" if gender and gender.value == "men" else "women" if gender and gender.value == "women" else "unisex"
    search_term = f"innerwear-{query}".strip().replace(' ', '-')
    url = f"{settings.MYNTRA_URL}/{gender_segment}-{search_term}"
    
    # Make request
    html_content = make_request(url)
    if not html_content:
        return []
    
    # Parse the HTML
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Find product containers - Myntra typically uses li elements with product data
    product_containers = soup.select('ul.results-base li.product-base')
    
    products = []
    source = db.query(Source).filter(Source.name == "Myntra").first()
    
    for container in product_containers:
        try:
            # Extract product data
            # Extract product link which contains product ID
            link_element = container.select_one('a.product-link')
            if not link_element:
                continue
                
            product_url = 'https://www.myntra.com' + link_element.get('href')
            
            # Extract product ID from URL or from data attributes
            product_id_match = re.search(r'/([\d]+)$', product_url)
            product_id = product_id_match.group(1) if product_id_match else container.get('data-id', f"myntra_{time.time()}")
            
            # Title
            title_element = container.select_one('.product-product')
            if not title_element:
                title_element = container.select_one('.product-title')
                
            title = title_element.text.strip() if title_element else ""
            
            # Brand
            brand_element = container.select_one('.product-brand')
            brand = brand_element.text.strip() if brand_element else extract_brand_from_title(title)
            
            # Price
            price_element = container.select_one('.product-price')
            price = 0
            if price_element:
                price_text = price_element.text.strip()
                price_match = re.search(r'Rs\.?\s*([\d,]+)', price_text) or re.search(r'([\d,]+)', price_text)
                if price_match:
                    price = float(price_match.group(1).replace(',', ''))
            
            # Original price (might be in a discounted element)
            original_price_element = container.select_one('.product-discountedPrice') or container.select_one('.product-strike')
            original_price = None
            if original_price_element:
                original_price_text = original_price_element.text.strip()
                original_price_match = re.search(r'Rs\.?\s*([\d,]+)', original_price_text) or re.search(r'([\d,]+)', original_price_text)
                if original_price_match:
                    original_price = float(original_price_match.group(1).replace(',', ''))
            
            # Image
            img_element = container.select_one('img.product-image')
            image_url = img_element.get('src') if img_element else None
            
            # Myntra typically doesn't show ratings in search results, but product page would have it
            rating = None
            rating_count = 0
            
            # Determine product type
            product_type = identify_innerwear_type(title, gender)
            
            # Create product dict
            product_data = {
                "id": product_id,
                "name": title,
                "brand": brand,
                "gender": gender.value if gender else "unisex",
                "type": product_type,
                "price": price,
                "original_price": original_price,
                "source": "Myntra",
                "source_url": product_url,
                "image": image_url,
                "rating": rating,
                "rating_count": rating_count
            }
            
            products.append(product_data)
            
            # If we have a database session, store the product
            if db and source:
                try:
                    # Check if product exists
                    existing_product = db.query(Product).filter(
                        Product.name == title,
                        Product.brand == brand,
                        Product.gender == (gender if gender else GenderEnum.unisex)
                    ).first()
                    
                    if not existing_product:
                        # Create new product
                        new_product = Product(
                            name=title,
                            brand=brand,
                            gender=gender if gender else GenderEnum.unisex,
                            type=product_type,
                            description=title,  # Use title as description for now
                            images=[image_url] if image_url else []
                        )
                        
                        # Create source association
                        new_product.sources.append({
                            "source_id": source.id,
                            "source_product_id": product_id,
                            "source_url": product_url,
                            "price": price,
                            "original_price": original_price,
                            "in_stock": True
                        })
                        
                        db.add(new_product)
                        db.commit()
                    else:
                        # Update existing product
                        # Check if this source already exists for the product
                        source_exists = False
                        for src in existing_product.sources:
                            if src.source_id == source.id:
                                src.price = price
                                src.original_price = original_price
                                src.last_checked = time.time()
                                source_exists = True
                                break
                                
                        if not source_exists:
                            # Add new source association
                            existing_product.sources.append({
                                "source_id": source.id,
                                "source_product_id": product_id,
                                "source_url": product_url,
                                "price": price,
                                "original_price": original_price,
                                "in_stock": True
                            })
                            
                        db.commit()
                        
                except Exception as e:
                    db.rollback()
                    print(f"Error saving Myntra product to database: {e}")
            
        except Exception as e:
            print(f"Error parsing Myntra product: {e}")
    
    return products

def scrape_ajio(query: str, gender: Optional[GenderEnum] = None, db: Session = None, task_id: str = None):
    """Scrape Ajio for innerwear products"""
    # Build the search URL
    gender_segment = "men" if gender and gender.value == "men" else "women" if gender and gender.value == "women" else ""
    search_term = f"innerwear {query}".strip().replace(' ', '%20')
    url = f"{settings.AJIO_URL}/s/{gender_segment}/{search_term}"
    
    # Make request
    html_content = make_request(url)
    if not html_content:
        return []
    
    # Parse the HTML
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Find product containers - Ajio typically uses div elements with specific classes
    product_containers = soup.select('div.item.rilrtl-products-list__item')
    
    products = []
    source = db.query(Source).filter(Source.name == "Ajio").first()
    
    for container in product_containers:
        try:
            # Extract product data
            # Extract product link which contains product ID
            link_element = container.select_one('a.rilrtl-products-list__link')
            if not link_element:
                continue
                
            product_url = 'https://www.ajio.com' + link_element.get('href')
            
            # Extract product ID from URL
            product_id_match = re.search(r'/p/([\w\d]+)$', product_url)
            product_id = product_id_match.group(1) if product_id_match else f"ajio_{time.time()}"
            
            # Title
            title_element = container.select_one('.nameCls')
            title = title_element.text.strip() if title_element else ""
            
            # Brand
            brand_element = container.select_one('.brand')
            brand = brand_element.text.strip() if brand_element else extract_brand_from_title(title)
            
            # Price
            price_element = container.select_one('.price')
            price = 0
            if price_element:
                price_text = price_element.text.strip()
                price_match = re.search(r'Rs\.\s*([\d,]+)', price_text) or re.search(r'([\d,]+)', price_text)
                if price_match:
                    price = float(price_match.group(1).replace(',', ''))
            
            # Original price (for discounted items)
            original_price_element = container.select_one('.orginal-price')
            original_price = None
            if original_price_element:
                original_price_text = original_price_element.text.strip()
                original_price_match = re.search(r'Rs\.\s*([\d,]+)', original_price_text) or re.search(r'([\d,]+)', original_price_text)
                if original_price_match:
                    original_price = float(original_price_match.group(1).replace(',', ''))
            
            # Discount
            discount_element = container.select_one('.discount')
            discount = None
            if discount_element:
                discount_text = discount_element.text.strip()
                discount_match = re.search(r'(\d+)\s*%', discount_text)
                if discount_match and not original_price and price > 0:
                    discount_percent = float(discount_match.group(1))
                    # Calculate original price from discount if not already available
                    original_price = price / (1 - discount_percent/100)
            
            # Image
            img_element = container.select_one('img.rilrtl-lazy-img')
            image_url = img_element.get('src') if img_element else None
            if not image_url or image_url.endswith('default-product.jpg'):
                image_url = img_element.get('data-src') if img_element else None
            
            # Ajio doesn't typically show ratings in search results
            rating = None
            rating_count = 0
            
            # Determine product type
            product_type = identify_innerwear_type(title, gender)
            
            # Create product dict
            product_data = {
                "id": product_id,
                "name": title,
                "brand": brand,
                "gender": gender.value if gender else "unisex",
                "type": product_type,
                "price": price,
                "original_price": original_price,
                "source": "Ajio",
                "source_url": product_url,
                "image": image_url,
                "rating": rating,
                "rating_count": rating_count
            }
            
            products.append(product_data)
            
            # If we have a database session, store the product
            if db and source:
                try:
                    # Check if product exists
                    existing_product = db.query(Product).filter(
                        Product.name == title,
                        Product.brand == brand,
                        Product.gender == (gender if gender else GenderEnum.unisex)
                    ).first()
                    
                    if not existing_product:
                        # Create new product
                        new_product = Product(
                            name=title,
                            brand=brand,
                            gender=gender if gender else GenderEnum.unisex,
                            type=product_type,
                            description=title,  # Use title as description for now
                            images=[image_url] if image_url else []
                        )
                        
                        # Create source association
                        new_product.sources.append({
                            "source_id": source.id,
                            "source_product_id": product_id,
                            "source_url": product_url,
                            "price": price,
                            "original_price": original_price,
                            "in_stock": True
                        })
                        
                        db.add(new_product)
                        db.commit()
                    else:
                        # Update existing product
                        # Check if this source already exists for the product
                        source_exists = False
                        for src in existing_product.sources:
                            if src.source_id == source.id:
                                src.price = price
                                src.original_price = original_price
                                src.last_checked = time.time()
                                source_exists = True
                                break
                                
                        if not source_exists:
                            # Add new source association
                            existing_product.sources.append({
                                "source_id": source.id,
                                "source_product_id": product_id,
                                "source_url": product_url,
                                "price": price,
                                "original_price": original_price,
                                "in_stock": True
                            })
                            
                        db.commit()
                        
                except Exception as e:
                    db.rollback()
                    print(f"Error saving Ajio product to database: {e}")
            
        except Exception as e:
            print(f"Error parsing Ajio product: {e}")
    
    return products

def scrape_product_details(product_id: str, source: str, db: Session = None):
    """Scrape detailed information about a specific product"""
    # Implementation would depend on the source
    if source.lower() == "amazon":
        url = f"{settings.AMAZON_URL}/dp/{product_id}"
        # Scrape Amazon product details
        pass
    elif source.lower() == "flipkart":
        # Scrape Flipkart product details
        pass
    elif source.lower() == "myntra":
        # Scrape Myntra product details
        pass
    elif source.lower() == "ajio":
        # Scrape Ajio product details
        pass
    
    # This is a placeholder - in a real implementation, this would return detailed product info
    return {}

def extract_brand_from_title(title: str) -> str:
    """Extract brand name from product title"""
    # Common innerwear brands
    common_brands = [
        "Jockey", "Van Heusen", "Calvin Klein", "Tommy Hilfiger", "Zivame",
        "Clovia", "Amante", "Enamor", "Marks & Spencer", "H&M", "Under Armour",
        "Nike", "Adidas", "Puma", "Reebok", "Hanes", "Fruit of the Loom",
        "Diesel", "Hugo Boss", "Armani", "Ralph Lauren", "Triumph", "Wacoal",
        "Victoria's Secret", "La Senza", "Rupa", "Lux", "Dollar", "Amul"
    ]
    
    for brand in common_brands:
        if brand.lower() in title.lower():
            return brand
    
    # Default to first word if no known brand found
    first_word = title.split()[0] if title else "Unknown"
    return first_word

def identify_innerwear_type(title: str, gender: Optional[GenderEnum] = None) -> str:
    """Identify the innerwear type from the product title and gender"""
    men_types = ["boxer", "brief", "trunk", "vest", "undershirt", "underwear"]
    women_types = ["bra", "panty", "panties", "thong", "bikini", "hipster", "camisole", "slip"]
    
    if gender and gender.value == "men":
        for product_type in men_types:
            if product_type.lower() in title.lower():
                return product_type.capitalize()
        return "Men's Innerwear"
    
    elif gender and gender.value == "women":
        for product_type in women_types:
            if product_type.lower() in title.lower():
                return product_type.capitalize()
        return "Women's Innerwear"
    
    # Check both if gender not specified
    for product_type in men_types + women_types:
        if product_type.lower() in title.lower():
            return product_type.capitalize()
    
    return "Innerwear"
