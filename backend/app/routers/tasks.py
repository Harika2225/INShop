"""
Task status router
Endpoints for checking status of background tasks
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.utils.task_manager import get_task_status, get_all_tasks, TaskStatus

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    responses={404: {"description": "Task not found"}}
)

@router.get("/{task_id}", response_model=Dict[str, Any])
def get_task(task_id: str):
    """
    Get the status of a specific task by ID
    """
    task = get_task_status(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    # Convert task data to a format suitable for API response
    return {
        "task_id": task["id"],
        "type": task["type"],
        "status": task["status"],
        "created_at": task["created_at"],
        "updated_at": task["updated_at"],
        "progress": task["progress"],
        "result": task["result"],
        "error": task["error"]
    }

@router.get("/", response_model=List[Dict[str, Any]])
def list_tasks(
    task_type: Optional[str] = None,
    status: Optional[TaskStatus] = None,
    limit: int = 10
):
    """
    List tasks, optionally filtered by type and status
    """
    tasks = get_all_tasks(task_type, status)
    
    # Return limited number of tasks
    return tasks[:limit]

@router.get("/scraping/active", response_model=List[Dict[str, Any]])
def get_active_scraping_tasks():
    """
    Get all active scraping tasks (pending or running)
    """
    # Get tasks with type 'scrape' that are either pending or running
    pending = get_all_tasks("scrape", TaskStatus.PENDING)
    running = get_all_tasks("scrape", TaskStatus.RUNNING)
    
    # Combine and sort by updated_at time
    active_tasks = pending + running
    active_tasks.sort(key=lambda x: x["updated_at"], reverse=True)
    
    return active_tasks
