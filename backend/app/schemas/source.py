from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class SourceBase(BaseModel):
    name: str
    base_url: str
    logo_url: Optional[str] = None
    search_endpoint: Optional[str] = None
    product_endpoint: Optional[str] = None
    is_active: bool = True

class SourceCreate(SourceBase):
    pass

class SourceUpdate(BaseModel):
    name: Optional[str] = None
    base_url: Optional[str] = None
    logo_url: Optional[str] = None
    search_endpoint: Optional[str] = None
    product_endpoint: Optional[str] = None
    is_active: Optional[bool] = None

class SourceResponse(SourceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
