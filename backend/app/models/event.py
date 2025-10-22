"""
Event Model
Stores security events (motion, person detected, etc.)
"""
from sqlalchemy import Column, String, Float, JSON, DateTime, ForeignKey, Integer
from app.db.base import BaseModel
from datetime import datetime


class Event(BaseModel):
    __tablename__ = "events"

    # camera_id must match Camera.id type (Integer)
    camera_id = Column(Integer, ForeignKey("cameras.id"), nullable=False)
    event_type = Column(String, nullable=False)  # motion, person, vehicle, etc.
    confidence = Column(Float, nullable=False)
    event_metadata = Column(JSON, default={})  # Renamed from 'metadata' to avoid SQLAlchemy conflict
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
