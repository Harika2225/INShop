from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_, or_
from typing import List, Optional, Dict, Any
from app.models.product import Product, GenderEnum as ModelGenderEnum
from app.models.source import Source
from app.models.review import Review
from app.schemas.product import ProductCreate, ProductUpdate, ProductFilter

def get_product_by_id(db: Session, product_id: int):
    """Get product by ID with eager loading of related entities"""
    return db.query(Product).options(
        joinedload(Product.sources),
        joinedload(Product.reviews)
    ).filter(Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    """Get all products with pagination"""
    return db.query(Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: ProductCreate):
    """Create a new product"""
    db_product = Product(
        name=product.name,
        brand=product.brand,
        gender=ModelGenderEnum(product.gender.value),
        type=product.type,
        description=product.description,
        material=product.material,
        fit=product.fit,
        pattern=product.pattern,
        rise=product.rise,
        occasion=product.occasion,
        care_instructions=product.care_instructions,
        features=product.features,
        available_sizes=product.available_sizes,
        available_colors=product.available_colors,
        images=product.images
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: ProductUpdate):
    """Update a product"""
    db_product = get_product_by_id(db, product_id)
    
    # Update only the fields that were provided in the request
    update_data = product.dict(exclude_unset=True)
    if 'gender' in update_data and update_data['gender']:
        update_data['gender'] = ModelGenderEnum(update_data['gender'].value)
    
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    """Delete a product"""
    db_product = get_product_by_id(db, product_id)
    db.delete(db_product)
    db.commit()
    return db_product

def filter_products(db: Session, filters: ProductFilter, skip: int = 0, limit: int = 100, sort_by: str = "price_asc"):
    """Filter products based on criteria"""
    # Start with base query
    query = db.query(
        Product,
        func.min(Source.price).label('lowest_price'),
        func.max(Source.price).label('highest_price'),
        func.avg(Review.rating).label('avg_rating'),
        func.count(Review.id).label('rating_count')
    ).join(
        Product.sources
    ).outerjoin(
        Product.reviews
    ).group_by(
        Product.id
    )
    
    # Apply filters
    if filters.gender:
        query = query.filter(Product.gender == ModelGenderEnum(filters.gender.value))
    
    if filters.brand:
        query = query.filter(Product.brand.in_(filters.brand))
    
    if filters.type:
        query = query.filter(Product.type.in_(filters.type))
    
    if filters.source:
        query = query.filter(Source.name.in_(filters.source))
    
    if filters.min_price is not None:
        query = query.having(func.min(Source.price) >= filters.min_price)
    
    if filters.max_price is not None:
        query = query.having(func.min(Source.price) <= filters.max_price)
    
    if filters.min_rating is not None:
        query = query.having(func.avg(Review.rating) >= filters.min_rating)
    
    # Apply sorting
    if sort_by == "price_asc":
        query = query.order_by(func.min(Source.price).asc())
    elif sort_by == "price_desc":
        query = query.order_by(func.min(Source.price).desc())
    elif sort_by == "rating_desc":
        query = query.order_by(func.avg(Review.rating).desc().nullslast())
    elif sort_by == "newest":
        query = query.order_by(Product.created_at.desc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    results = query.all()
    
    # Format results into ProductListResponse
    formatted_results = []
    for product, lowest_price, highest_price, avg_rating, rating_count in results:
        sources = db.query(Source.name).join(
            Source.products
        ).filter(
            Product.id == product.id
        ).all()
        
        formatted_product = {
            "id": product.id,
            "name": product.name,
            "brand": product.brand,
            "gender": product.gender.value,
            "type": product.type,
            "images": product.images,
            "available_sizes": product.available_sizes,
            "available_colors": product.available_colors,
            "lowest_price": lowest_price,
            "highest_price": highest_price if highest_price != lowest_price else None,
            "sources": [source[0] for source in sources],
            "rating_average": float(avg_rating) if avg_rating else None,
            "rating_count": rating_count if rating_count else None
        }
        
        formatted_results.append(formatted_product)
    
    return formatted_results
