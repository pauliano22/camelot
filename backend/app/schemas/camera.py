"""
Camera Schemas
Request/response models for camera API.
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class CameraBase(BaseModel):
    """Base camera fields"""
    name: str
    description: Optional[str] = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class CameraCreate(CameraBase):
    """Data needed to create a camera"""
    rtsp_url: str
    username: Optional[str] = None
    password: Optional[str] = None
    config: Optional[Dict[str, Any]] = None  # Added this field!


class CameraUpdate(BaseModel):
    """Data that can be updated"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    is_online: Optional[bool] = None
    config: Optional[Dict[str, Any]] = None


class CameraResponse(CameraBase):
    """What API returns"""
    id: int
    is_active: bool
    is_online: bool
    config: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
