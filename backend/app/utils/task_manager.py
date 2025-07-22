"""
Task Manager Utility
Provides functionality to track background tasks and their statuses
"""
from enum import Enum
from typing import Dict, Any, Optional, List
import time
import threading

# Task status enum
class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

# Thread-safe task store
_task_store_lock = threading.Lock()
_task_store: Dict[str, Dict[str, Any]] = {}

def register_task(task_id: str, task_type: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Register a new task and mark it as pending
    
    Args:
        task_id: Unique ID for the task
        task_type: Type of task (e.g., 'scrape', 'refresh')
        params: Optional parameters related to the task
        
    Returns:
        Task information dictionary
    """
    task_info = {
        "id": task_id,
        "type": task_type,
        "status": TaskStatus.PENDING,
        "created_at": time.time(),
        "updated_at": time.time(),
        "params": params or {},
        "progress": 0,
        "result": None,
        "error": None
    }
    
    with _task_store_lock:
        _task_store[task_id] = task_info
    
    return task_info

def update_task_status(task_id: str, status: TaskStatus, progress: int = None, 
                      result: Any = None, error: str = None) -> Optional[Dict[str, Any]]:
    """
    Update the status of an existing task
    
    Args:
        task_id: ID of the task to update
        status: New status
        progress: Optional progress percentage (0-100)
        result: Optional result data
        error: Optional error message if task failed
        
    Returns:
        Updated task information or None if task doesn't exist
    """
    with _task_store_lock:
        if task_id not in _task_store:
            return None
        
        task = _task_store[task_id]
        task["status"] = status
        task["updated_at"] = time.time()
        
        if progress is not None:
            task["progress"] = progress
            
        if result is not None:
            task["result"] = result
            
        if error is not None:
            task["error"] = error
            
        return task

def get_task_status(task_id: str) -> Optional[Dict[str, Any]]:
    """
    Get the current status of a task
    
    Args:
        task_id: ID of the task to check
        
    Returns:
        Task information or None if task doesn't exist
    """
    with _task_store_lock:
        return _task_store.get(task_id)

def get_all_tasks(task_type: str = None, status: TaskStatus = None) -> List[Dict[str, Any]]:
    """
    Get all tasks, optionally filtered by type and/or status
    
    Args:
        task_type: Optional filter by task type
        status: Optional filter by task status
        
    Returns:
        List of matching tasks
    """
    with _task_store_lock:
        tasks = list(_task_store.values())
    
    # Apply filters if specified
    if task_type:
        tasks = [t for t in tasks if t["type"] == task_type]
        
    if status:
        tasks = [t for t in tasks if t["status"] == status]
    
    # Sort by creation time, newest first
    tasks.sort(key=lambda x: x["created_at"], reverse=True)
    return tasks

def clean_old_tasks(max_age: int = 86400) -> int:
    """
    Remove old completed or failed tasks
    
    Args:
        max_age: Maximum age in seconds to keep completed/failed tasks
        
    Returns:
        Number of tasks removed
    """
    current_time = time.time()
    removed_count = 0
    
    with _task_store_lock:
        to_remove = []
        
        for task_id, task in _task_store.items():
            # Only remove completed or failed tasks
            if task["status"] in (TaskStatus.COMPLETED, TaskStatus.FAILED):
                age = current_time - task["updated_at"]
                if age > max_age:
                    to_remove.append(task_id)
        
        for task_id in to_remove:
            del _task_store[task_id]
            removed_count += 1
    
    return removed_count
