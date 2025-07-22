import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseModel):
    # Database settings
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_NAME: str = os.getenv("DB_NAME", "inshop")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgres")
    DB_URL: str = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # API settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "INShop API"
    
    # CORS settings
    CORS_ORIGINS: list = ["http://localhost:3000"]  # Frontend URL
    
    # Scraping settings
    USER_AGENT: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    REQUEST_TIMEOUT: int = 30  # seconds
    
    # Rate limiting
    SCRAPING_RATE_LIMIT: int = 5  # seconds between requests
    
    # Product caching
    CACHE_EXPIRY: int = 86400  # 24 hours in seconds
    
    # E-commerce source URLs
    AMAZON_URL: str = "https://www.amazon.in"
    FLIPKART_URL: str = "https://www.flipkart.com"
    MYNTRA_URL: str = "https://www.myntra.com"
    AJIO_URL: str = "https://www.ajio.com"

# Create a settings object
settings = Settings()
