"""
Entity Schemas

API models for detected objects.
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EntityBase(BaseModel):
    entity_id: str
    object_type: str
    latitude: float
    longitude: float
    confidence: float

class EntityCreate(EntityBase):
    camera_id: int

class EntityResponse(EntityBase):
    id: int
    camera_id: int
    first_seen: datetime
    last_seen: datetime
    is_active: bool
    is_recognized: bool
    recognized_as: Optional[str] = None

    class Config:
        from_attributes = True
