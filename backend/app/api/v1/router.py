"""
API v1 Router

Combines all v1 endpoints.
"""

from fastapi import APIRouter

from app.api.v1.cameras import router as cameras_router

# Create main v1 router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(cameras_router, tags=["cameras"])
