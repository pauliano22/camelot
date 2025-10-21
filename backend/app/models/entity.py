"""
Entity Model

An "entity" is any detected object:
- person_42
- car_15
- dog_3

Each entity gets a unique ID and is tracked across frames.
"""

from sqlalchemy import Column, String, Float, Boolean, ForeignKey, Integer, DateTime
from geoalchemy2 import Geography

from app.db.base import BaseModel

class Entity(BaseModel):
    """
    Detected Object Entity

    When YOLO detects something, we create an entity.
    The tracker assigns a persistent ID across frames.
    """
    __tablename__ = "entities"

    # Unique identifier (e.g., "person_42")
    entity_id = Column(String, unique=True, index=True, nullable=False)

    # What is it?
    object_type = Column(String, index=True, nullable=False)  # person, car, dog, etc.

    # Where is it? (current location)
    location = Column(Geography(geometry_type='POINT', srid=4326))

    # Which camera saw it?
    camera_id = Column(Integer, ForeignKey('cameras.id'), nullable=False)

    # Tracking info
    first_seen = Column(DateTime, nullable=False)
    last_seen = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True, index=True)

    # Detection confidence (0.0 to 1.0)
    confidence = Column(Float, nullable=False)

    # Recognition (optional)
    is_recognized = Column(Boolean, default=False)
    recognized_as = Column(String, nullable=True)  # "John", "Family Car", etc.

    def __repr__(self):
        return f"<Entity {self.entity_id} ({self.object_type})>"
