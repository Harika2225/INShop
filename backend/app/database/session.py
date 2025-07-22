"""
Database session management
"""
from typing import Generator

from sqlalchemy.orm import Session

from app.database import SessionLocal

def get_db() -> Generator[Session, None, None]:
    """
    Create a new database session for each request
    
    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
