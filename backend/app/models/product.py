from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Table, Text, Enum, ARRAY, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.database import Base
import enum

# Product-Source association table for many-to-many relationship
product_source = Table(
    'product_source',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id'), primary_key=True),
    Column('source_id', Integer, ForeignKey('sources.id'), primary_key=True),
    Column('source_product_id', String(255), nullable=True),  # ID of the product on the source platform
    Column('source_url', String(500), nullable=True),         # URL to the product on the source platform
    Column('price', Float, nullable=True),                    # Current price on this source
    Column('original_price', Float, nullable=True),           # Original price (if on discount)
    Column('in_stock', Boolean, default=True),                # Whether product is in stock at this source
    Column('last_checked', DateTime, default=func.now())      # Last time the price/availability was checked
)

class GenderEnum(enum.Enum):
    men = "men"
    women = "women"
    unisex = "unisex"

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    brand = Column(String(100), nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    type = Column(String(100), nullable=False)  # E.g., boxer, brief, hipster, etc.
    
    # Product details
    description = Column(Text, nullable=True)
    material = Column(String(255), nullable=True)
    fit = Column(String(100), nullable=True)
    pattern = Column(String(100), nullable=True)
    rise = Column(String(100), nullable=True)
    occasion = Column(String(100), nullable=True)
    care_instructions = Column(Text, nullable=True)
    features = Column(ARRAY(String(255)), nullable=True)
    
    # Size and color information
    available_sizes = Column(ARRAY(String(20)), nullable=True)
    available_colors = Column(ARRAY(String(50)), nullable=True)
    
    # Images
    images = Column(ARRAY(String(500)), nullable=True)  # Array of image URLs
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    sources = relationship("Source", secondary=product_source, back_populates="products")
    reviews = relationship("Review", back_populates="product")
    
    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', brand='{self.brand}', gender='{self.gender.value}')>"
