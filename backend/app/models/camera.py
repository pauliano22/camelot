"""
Camera Model

Represents a security camera in the database.
"""

from sqlalchemy import Column, String, Float, Boolean, JSON
from geoalchemy2 import Geography

from app.db.base import BaseModel

class Camera(BaseModel):
    """
    Security Camera

    Stores information about each camera:
    - Where it's located (latitude/longitude)
    - Its name and description
    - Connection details (RTSP URL)
    - Configuration (resolution, FPS, etc.)
    """
    __tablename__ = "cameras"

    # Basic info
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)

    # Location (stored as geographic point)
    # PostGIS can do spatial queries like "find cameras within X meters"
    location = Column(
        Geography(geometry_type='POINT', srid=4326),  # SRID 4326 = WGS84 (standard lat/lon)
        nullable=False
    )

    # Connection
    rtsp_url = Column(String, nullable=False)  # e.g., rtsp://192.168.1.100:554/stream1
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)

    # Status
    is_active = Column(Boolean, default=True)
    is_online = Column(Boolean, default=False)  # Updated by collector

    # Configuration
    config = Column(JSON, default={
        "fps": 30,
        "resolution": "1920x1080",
        "detection_enabled": True
    })

    def __repr__(self):
        return f"<Camera {self.name} (id={self.id})>"
