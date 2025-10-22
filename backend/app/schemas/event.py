"""
Event Schemas
Request/response models for events.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, Any


class EventResponse(BaseModel):
    """Event response schema"""
    id: int  # Changed from str to int
    camera_id: int  # Changed from str to int
    event_type: str
    confidence: float
    metadata: Dict[str, Any] = Field(default={}, alias="event_metadata")
    timestamp: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
