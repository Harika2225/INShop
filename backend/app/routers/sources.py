from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.source import SourceCreate, SourceResponse, SourceUpdate
from app.services.source_service import (
    create_source, get_source_by_id, get_sources, 
    update_source, delete_source
)

router = APIRouter(
    prefix="/api/v1/sources",
    tags=["Sources"],
    responses={404: {"description": "Source not found"}},
)

@router.post("/", response_model=SourceResponse, status_code=201)
async def create_source_endpoint(source: SourceCreate, db: Session = Depends(get_db)):
    """
    Create a new e-commerce source.
    """
    return create_source(db=db, source=source)

@router.get("/{source_id}", response_model=SourceResponse)
async def get_source_endpoint(source_id: int, db: Session = Depends(get_db)):
    """
    Get source by ID.
    """
    db_source = get_source_by_id(db=db, source_id=source_id)
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    return db_source

@router.get("/", response_model=List[SourceResponse])
async def get_sources_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all sources.
    """
    return get_sources(db=db, skip=skip, limit=limit)

@router.put("/{source_id}", response_model=SourceResponse)
async def update_source_endpoint(source_id: int, source: SourceUpdate, db: Session = Depends(get_db)):
    """
    Update a source.
    """
    db_source = get_source_by_id(db=db, source_id=source_id)
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    return update_source(db=db, source_id=source_id, source=source)

@router.delete("/{source_id}", status_code=204)
async def delete_source_endpoint(source_id: int, db: Session = Depends(get_db)):
    """
    Delete a source.
    """
    db_source = get_source_by_id(db=db, source_id=source_id)
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    delete_source(db=db, source_id=source_id)
    return None
