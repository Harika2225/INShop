from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Source(Base):
    __tablename__ = "sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)  # Amazon, Flipkart, Myntra, Ajio
    base_url = Column(String(255), nullable=False)
    logo_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Scraping specific data (can be stored as JSON in a real implementation)
    search_endpoint = Column(String(255), nullable=True)
    product_endpoint = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    products = relationship("Product", secondary="product_source", back_populates="sources")
    
    def __repr__(self):
        return f"<Source(id={self.id}, name='{self.name}')>"
