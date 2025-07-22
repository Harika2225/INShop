from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from enum import Enum

class GenderEnum(str, Enum):
    men = "men"
    women = "women"
    unisex = "unisex"

class SourceInfo(BaseModel):
    source_id: int
    source_name: str
    price: float
    original_price: Optional[float] = None
    source_url: Optional[str] = None
    in_stock: bool = True
    last_checked: datetime

    class Config:
        orm_mode = True

class ReviewBase(BaseModel):
    rating: float = Field(..., ge=1, le=5)
    title: Optional[str] = None
    content: Optional[str] = None
    reviewer_name: Optional[str] = None
    verified_purchase: int = 0
    review_date: Optional[datetime] = None
    source_name: str

class ReviewCreate(ReviewBase):
    product_id: int
    source_id: int
    source_review_id: Optional[str] = None

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    name: str
    brand: str
    gender: GenderEnum
    type: str
    description: Optional[str] = None
    material: Optional[str] = None
    fit: Optional[str] = None
    pattern: Optional[str] = None
    rise: Optional[str] = None
    occasion: Optional[str] = None
    care_instructions: Optional[str] = None
    features: Optional[List[str]] = None
    available_sizes: Optional[List[str]] = None
    available_colors: Optional[List[str]] = None
    images: Optional[List[str]] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    gender: Optional[GenderEnum] = None
    type: Optional[str] = None
    description: Optional[str] = None
    material: Optional[str] = None
    fit: Optional[str] = None
    pattern: Optional[str] = None
    rise: Optional[str] = None
    occasion: Optional[str] = None
    care_instructions: Optional[str] = None
    features: Optional[List[str]] = None
    available_sizes: Optional[List[str]] = None
    available_colors: Optional[List[str]] = None
    images: Optional[List[str]] = None

class ProductResponse(ProductBase):
    id: int
    sources: List[SourceInfo]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ProductListResponse(BaseModel):
    id: int
    name: str
    brand: str
    gender: GenderEnum
    type: str
    images: Optional[List[str]] = None
    available_sizes: Optional[List[str]] = None
    available_colors: Optional[List[str]] = None
    lowest_price: float
    highest_price: Optional[float] = None
    sources: List[str]
    rating_average: Optional[float] = None
    rating_count: Optional[int] = None

    class Config:
        orm_mode = True

class ProductFilter(BaseModel):
    gender: Optional[GenderEnum] = None
    brand: Optional[List[str]] = None
    type: Optional[List[str]] = None
    source: Optional[List[str]] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None
