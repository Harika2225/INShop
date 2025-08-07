from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database import get_db
from app.schemas.product import ProductListResponse, GenderEnum
from app.services.scraping_service import (
    scrape_amazon, scrape_flipkart, scrape_myntra, scrape_ajio,
    scrape_product_details
)

router = APIRouter(
    prefix="/api/v1/scraping",
    tags=["Scraping"],
    responses={404: {"description": "Not found"}},
)

@router.get("/search/{query}", response_model=List[ProductListResponse])
async def search_all_sources(
    query: str,
    gender: Optional[GenderEnum] = None,
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db)
):
    """
    Search across all e-commerce sources and return aggregated results.
    This will trigger background scraping tasks and return already cached results.
    """
    # Get cached results if available
    from app.utils.cache_manager import get_cached_results, cache_results
    
    cache_key = f"search_{query}_{gender.value if gender else 'all'}"
    cached_data = get_cached_results(cache_key)
    
    if cached_data:
        return cached_data
    
    # Get all active sources
    sources = db.query(Source).filter(Source.is_active == True).all()
    source_names = [source.name.lower() for source in sources]
    
    # Queue background tasks for scraping from each source
    task_ids = []
    for source_name in source_names:
        # Create a task ID for tracking
        import uuid
        task_id = f"scrape_{source_name}_{uuid.uuid4().hex[:8]}"
        
        # Add scraping tasks to background tasks
        if source_name == 'amazon':
            background_tasks.add_task(
                scrape_amazon, query, gender, db, task_id=task_id
            )
        elif source_name == 'flipkart':
            background_tasks.add_task(
                scrape_flipkart, query, gender, db, task_id=task_id
            )
        elif source_name == 'myntra':
            background_tasks.add_task(
                scrape_myntra, query, gender, db, task_id=task_id
            )
        elif source_name == 'ajio':
            background_tasks.add_task(
                scrape_ajio, query, gender, db, task_id=task_id
            )
        
        task_ids.append(task_id)
    
    # Get any existing results from database
    from sqlalchemy import or_, and_
    from app.models.product import Product, GenderEnum as ModelGenderEnum
    
    # Search in product names and descriptions
    filters = []
    for term in query.split():
        if len(term) > 2:  # Only search for terms with more than 2 characters
            filters.append(or_(
                Product.name.ilike(f'%{term}%'),
                Product.description.ilike(f'%{term}%'),
                Product.brand.ilike(f'%{term}%'),
                Product.type.ilike(f'%{term}%')
            ))
    
    # Apply gender filter if provided
    gender_filter = True
    if gender:
        gender_filter = Product.gender == ModelGenderEnum(gender.value)
    
    # Combine all filters
    if filters:
        combined_filter = and_(*filters, gender_filter)
    else:
        combined_filter = gender_filter
    
    # Query products
    products = db.query(Product).filter(combined_filter).all()
    
    # Format results
    results = []
    for product in products:
        # Get sources and prices for this product
        product_sources = []
        lowest_price = float('inf')
        highest_price = 0
        
        for assoc in product.sources:
            source_name = db.query(Source.name).filter(Source.id == assoc.source_id).scalar()
            product_sources.append(source_name)
            
            if assoc.price:
                lowest_price = min(lowest_price, assoc.price)
                highest_price = max(highest_price, assoc.price)
        
        # Get average rating
        from sqlalchemy import func
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.product_id == product.id).scalar()
        rating_count = db.query(func.count(Review.id)).filter(Review.product_id == product.id).scalar()
        
        # Format the product data
        product_data = {
            "id": product.id,
            "name": product.name,
            "brand": product.brand,
            "gender": product.gender.value,
            "type": product.type,
            "images": product.images,
            "available_sizes": product.available_sizes,
            "available_colors": product.available_colors,
            "lowest_price": lowest_price if lowest_price != float('inf') else None,
            "highest_price": highest_price if highest_price > 0 and highest_price != lowest_price else None,
            "sources": product_sources,
            "rating_average": float(avg_rating) if avg_rating else None,
            "rating_count": rating_count
        }
        
        results.append(product_data)
    
    # Cache the results
    cache_results(cache_key, results, expiry=300)  # Cache for 5 minutes
    
    return results

@router.post("/product/refresh/{product_id}", response_model=Dict[str, Any])
async def refresh_product_data(
    product_id: int,
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db)
):
    """
    Refresh data for a specific product by re-scraping from original sources.
    This will update prices, availability, and any other changed information.
    """
    from app.utils.task_manager import register_task, TaskStatus, update_task_status
    import uuid
    
    # Get the product
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
    
    # Create a task ID
    task_id = f"refresh_product_{uuid.uuid4().hex[:8]}"
    
    # Register the task
    task = register_task(
        task_id=task_id,
        task_type="product_refresh",
        params={"product_id": product_id}
    )
    
    # For each source this product is associated with, queue a refresh task
    for source_assoc in product.sources:
        source = db.query(Source).filter(Source.id == source_assoc.source_id).first()
        if source:
            source_name = source.name.lower()
            
            # Queue the appropriate scraping function based on source
            if source_name == "amazon":
                background_tasks.add_task(
                    scrape_product_details, 
                    source_assoc.source_product_id, 
                    "amazon", 
                    db, 
                    task_id
                )
            elif source_name == "flipkart":
                background_tasks.add_task(
                    scrape_product_details, 
                    source_assoc.source_product_id, 
                    "flipkart", 
                    db, 
                    task_id
                )
            elif source_name == "myntra":
                background_tasks.add_task(
                    scrape_product_details, 
                    source_assoc.source_product_id, 
                    "myntra", 
                    db, 
                    task_id
                )
            elif source_name == "ajio":
                background_tasks.add_task(
                    scrape_product_details, 
                    source_assoc.source_product_id, 
                    "ajio", 
                    db, 
                    task_id
                )
    
    # Update task status to running
    update_task_status(task_id, TaskStatus.RUNNING, progress=10)
    
    return {"status": "success", "message": f"Refresh initiated for product {product_id}", "task_id": task_id}

@router.get("/amazon/{query}", response_model=List[Dict[str, Any]])
async def search_amazon(
    query: str,
    gender: Optional[GenderEnum] = None,
    page: int = 1,
    url: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Search Amazon for products matching the query.
    
    - query: The search query string
    - gender: Optional gender filter (men, women, unisex)
    - page: Page number for pagination (default: 1)
    - url: Optional direct Amazon URL to scrape
    """
    # Call the scrape_amazon function to get products
    # We're updating the response model to Dict to avoid DB dependency
    try:
        products = scrape_amazon(query=query, gender=gender, db=db, page=page, url=url)
        
        # Format the products for the response
        results = []
        for product in products:
            # Transform product object to dict
            results.append({
                "id": product.get("id", ""),
                "name": product.get("name", ""),
                "brand": product.get("brand", ""),
                "price": product.get("price", 0),
                "original_price": product.get("original_price", 0),
                "image": product.get("image", ""),
                "source": "Amazon",
                "url": product.get("source_url", ""),
                "type": product.get("type", ""),
                "rating": product.get("rating", 0),
                "reviews_count": product.get("reviews", 0)
            })
        
        return results
    except Exception as e:
        # Log the error
        print(f"Error scraping Amazon: {e}")
        # Return empty list on error
        return []

@router.get("/flipkart/{query}", response_model=List[Dict[str, Any]])
async def search_flipkart(
    query: str,
    gender: Optional[GenderEnum] = None,
    db: Session = Depends(get_db)
):
    """
    Search Flipkart for products matching the query.
    
    - query: The search query string
    - gender: Optional gender filter (men, women, unisex)
    """
    # Call the scrape_flipkart function to get products
    try:
        products = scrape_flipkart(query=query, gender=gender, db=db)
        
        # Format the products for the response
        results = []
        for product in products:
            # Transform product object to dict
            results.append({
                "id": product.get("id", ""),
                "name": product.get("name", ""),
                "brand": product.get("brand", ""),
                "price": product.get("price", 0),
                "original_price": product.get("original_price", 0),
                "image": product.get("image", ""),
                "source": "Flipkart",
                "url": product.get("source_url", ""),
                "type": product.get("type", ""),
                "rating": product.get("rating", 0),
                "reviews_count": product.get("rating_count", 0)
            })
        
        return results
    except Exception as e:
        # Log the error
        print(f"Error scraping Flipkart: {e}")
        # Return empty list on error
        return []

@router.get("/myntra/{query}", response_model=List[ProductListResponse])
async def search_myntra(
    query: str,
    gender: Optional[GenderEnum] = None,
    db: Session = Depends(get_db)
):
    """
    Search Myntra for products matching the query.
    """
    # In a real implementation, this would call the scrape_myntra function
    return []

@router.get("/ajio/{query}", response_model=List[ProductListResponse])
async def search_ajio(
    query: str,
    gender: Optional[GenderEnum] = None,
    db: Session = Depends(get_db)
):
    """
    Search Ajio for products matching the query.
    """
    # In a real implementation, this would call the scrape_ajio function
    return []

@router.get("/status/{task_id}")
async def get_scraping_status(task_id: str):
    """
    Get the status of a scraping task.
    """
    # In a real implementation, this would check the status of a background task
    return {
        "status": "completed",
        "task_id": task_id,
        "completed": True,
        "results_count": 0
    }
