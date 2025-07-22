from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    
    # Review data
    reviewer_name = Column(String(255), nullable=True)
    rating = Column(Float, nullable=False)  # Usually 1-5 stars
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=True)
    
    # Source-specific data
    source_review_id = Column(String(255), nullable=True)  # ID of the review on the source platform
    source_url = Column(String(500), nullable=True)  # URL to the review if available
    
    # Verification
    verified_purchase = Column(Integer, default=0)  # 0=Unknown, 1=Not verified, 2=Verified
    
    # Timestamps
    review_date = Column(DateTime, nullable=True)  # When the review was posted
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="reviews")
    
    def __repr__(self):
        return f"<Review(id={self.id}, product_id={self.product_id}, rating={self.rating})>"
