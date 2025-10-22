"""
Event Schemas
Request/response models for events.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, Any


class EventResponse(BaseModel):
    """Event response schema"""
    id: str
    camera_id: str
    event_type: str
    confidence: float
    metadata: Dict[str, Any] = Field(default={}, alias="event_metadata")  # Map event_metadata to metadata
    timestamp: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
