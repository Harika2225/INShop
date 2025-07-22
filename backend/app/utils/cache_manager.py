"""
Cache Manager Utility
Provides caching functionality for API responses
"""
import time
from typing import Any, Dict, Optional
import json

# In-memory cache store
# In a production app, this would use Redis or another distributed cache
_cache: Dict[str, Dict[str, Any]] = {}

def get_cached_results(cache_key: str) -> Optional[Any]:
    """
    Retrieve cached results by key if they exist and haven't expired.
    
    Args:
        cache_key: The key to lookup in cache
        
    Returns:
        The cached data or None if not found/expired
    """
    if cache_key not in _cache:
        return None
        
    cache_entry = _cache[cache_key]
    
    # Check if expired
    if "expiry" in cache_entry and cache_entry["expiry"] < time.time():
        del _cache[cache_key]
        return None
        
    return cache_entry.get("data")
    
def cache_results(cache_key: str, data: Any, expiry: int = 300) -> None:
    """
    Store results in cache with optional expiry time.
    
    Args:
        cache_key: The key to store the data under
        data: The data to cache
        expiry: Time in seconds until the cache entry expires (default: 300s)
    """
    _cache[cache_key] = {
        "data": data,
        "expiry": time.time() + expiry if expiry else None
    }
    
def clear_cache(cache_key: Optional[str] = None) -> None:
    """
    Clear the cache entirely or for a specific key.
    
    Args:
        cache_key: Optional specific key to clear
    """
    global _cache
    
    if cache_key:
        if cache_key in _cache:
            del _cache[cache_key]
    else:
        _cache = {}
        
def get_cache_stats() -> Dict[str, Any]:
    """
    Get statistics about the cache.
    
    Returns:
        Dictionary with cache stats (count, keys, memory usage estimate)
    """
    total_size = 0
    for key, entry in _cache.items():
        # Rough estimate of memory usage
        try:
            total_size += len(json.dumps(entry.get("data", "")))
        except (TypeError, ValueError):
            # If the data can't be JSON serialized, estimate based on str representation
            total_size += len(str(entry.get("data", "")))
            
    return {
        "entries": len(_cache),
        "keys": list(_cache.keys()),
        "estimated_size_bytes": total_size
    }
