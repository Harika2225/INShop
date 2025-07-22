from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.product import (
    ProductCreate, ProductResponse, ProductUpdate, 
    ProductListResponse, GenderEnum, ProductFilter
)
from app.services.product_service import (
    create_product, get_product_by_id, get_products, 
    update_product, delete_product, filter_products
)

router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"],
    responses={404: {"description": "Product not found"}},
)

@router.post("/", response_model=ProductResponse, status_code=201)
async def create_product_endpoint(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product.
    """
    return create_product(db=db, product=product)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product_endpoint(product_id: int, db: Session = Depends(get_db)):
    """
    Get product by ID with detailed information.
    """
    db_product = get_product_by_id(db=db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.get("/", response_model=List[ProductListResponse])
async def get_products_endpoint(
    skip: int = 0, 
    limit: int = 100,
    gender: Optional[GenderEnum] = None,
    brand: Optional[List[str]] = Query(None),
    type: Optional[List[str]] = Query(None),
    source: Optional[List[str]] = Query(None),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = "price_asc",
    db: Session = Depends(get_db)
):
    """
    Get all products with filtering and pagination.
    Sort options: price_asc, price_desc, rating_desc, newest
    """
    filters = ProductFilter(
        gender=gender,
        brand=brand,
        type=type,
        source=source,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating
    )
    
    return filter_products(db=db, filters=filters, skip=skip, limit=limit, sort_by=sort_by)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product_endpoint(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    """
    Update a product.
    """
    db_product = get_product_by_id(db=db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return update_product(db=db, product_id=product_id, product=product)

@router.delete("/{product_id}", status_code=204)
async def delete_product_endpoint(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product.
    """
    db_product = get_product_by_id(db=db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    delete_product(db=db, product_id=product_id)
    return None

@router.get("/search/{query}", response_model=List[ProductListResponse])
async def search_products_endpoint(
    query: str,
    skip: int = 0,
    limit: int = 100,
    gender: Optional[GenderEnum] = None,
    db: Session = Depends(get_db)
):
    """
    Search products by name, brand, or description.
    """
    # This will be implemented in the product_service
    return []
