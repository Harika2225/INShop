from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime

from app.database import engine, Base
from app.routers import products, scraping, sources, tasks
from app.config import settings

# Create tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="INShop API",
    description="API for INShop - Innerwear Product Aggregator",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; in production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router)
app.include_router(scraping.router)
app.include_router(sources.router)
app.include_router(tasks.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to INShop API",
        "version": "1.0.0",
        "documentation": "/docs",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
