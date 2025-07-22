from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.source import Source
from app.schemas.source import SourceCreate, SourceUpdate

def get_source_by_id(db: Session, source_id: int):
    """Get source by ID"""
    return db.query(Source).filter(Source.id == source_id).first()

def get_source_by_name(db: Session, name: str):
    """Get source by name"""
    return db.query(Source).filter(Source.name == name).first()

def get_sources(db: Session, skip: int = 0, limit: int = 100):
    """Get all sources with pagination"""
    return db.query(Source).offset(skip).limit(limit).all()

def create_source(db: Session, source: SourceCreate):
    """Create a new source"""
    db_source = Source(
        name=source.name,
        base_url=source.base_url,
        logo_url=source.logo_url,
        search_endpoint=source.search_endpoint,
        product_endpoint=source.product_endpoint,
        is_active=source.is_active
    )
    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source

def update_source(db: Session, source_id: int, source: SourceUpdate):
    """Update a source"""
    db_source = get_source_by_id(db, source_id)
    
    # Update only the fields that were provided in the request
    update_data = source.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_source, key, value)
    
    db.commit()
    db.refresh(db_source)
    return db_source

def delete_source(db: Session, source_id: int):
    """Delete a source"""
    db_source = get_source_by_id(db, source_id)
    db.delete(db_source)
    db.commit()
    return db_source

def initialize_sources(db: Session):
    """Initialize the four e-commerce sources if they don't exist"""
    sources = [
        {
            "name": "Amazon",
            "base_url": "https://www.amazon.in",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            "search_endpoint": "/s?k=",
            "product_endpoint": "/dp/"
        },
        {
            "name": "Flipkart",
            "base_url": "https://www.flipkart.com",
            "logo_url": "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png",
            "search_endpoint": "/search?q=",
            "product_endpoint": "/"
        },
        {
            "name": "Myntra",
            "base_url": "https://www.myntra.com",
            "logo_url": "https://constant.myntassets.com/web/assets/img/logo_myntra.png",
            "search_endpoint": "/:category/:keyword",
            "product_endpoint": "/:brand/:productName/:p/:id"
        },
        {
            "name": "Ajio",
            "base_url": "https://www.ajio.com",
            "logo_url": "https://assets.ajio.com/static/img/Ajio-Logo.svg",
            "search_endpoint": "/s/",
            "product_endpoint": "/p/"
        }
    ]
    
    for source_data in sources:
        # Check if source exists
        existing_source = get_source_by_name(db, source_data["name"])
        if not existing_source:
            # Create source if it doesn't exist
            source = SourceCreate(**source_data)
            create_source(db, source)
    
    return get_sources(db)
