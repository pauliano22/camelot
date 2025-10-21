"""
Camera Service

Business logic for camera operations.
Keeps API endpoints clean.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from geoalchemy2.functions import ST_SetSRID, ST_MakePoint

from app.models.camera import Camera
from app.schemas.camera import CameraCreate, CameraUpdate

class CameraService:
    """
    Handles all camera-related operations.

    Why use a service layer?
    - Keeps endpoints thin (they just handle HTTP)
    - Business logic in one place
    - Easy to test
    - Reusable across different endpoints
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_camera(self, camera_data: CameraCreate) -> Camera:
        """
        Create a new camera.

        Args:
            camera_data: Camera information

        Returns:
            Created camera object
        """
        # Create location point from lat/lon
        # ST_SetSRID = Set Spatial Reference ID
        # ST_MakePoint = Create a point from lon, lat (note: lon first!)
        location = ST_SetSRID(
            ST_MakePoint(camera_data.longitude, camera_data.latitude),
            4326
        )

        # Create camera instance
        camera = Camera(
            name=camera_data.name,
            description=camera_data.description,
            location=location,
            rtsp_url=camera_data.rtsp_url,
            username=camera_data.username,
            password=camera_data.password,
            config=camera_data.config or {}
        )

        # Add to database
        self.db.add(camera)
        await self.db.commit()
        await self.db.refresh(camera)  # Get the generated ID

        return camera

    async def get_cameras(self, skip: int = 0, limit: int = 100) -> List[Camera]:
        """
        Get all cameras.

        Args:
            skip: Number of records to skip (for pagination)
            limit: Maximum number of records to return

        Returns:
            List of cameras
        """
        result = await self.db.execute(
            select(Camera)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_camera(self, camera_id: int) -> Optional[Camera]:
        """
        Get a specific camera by ID.

        Args:
            camera_id: Camera ID

        Returns:
            Camera if found, None otherwise
        """
        result = await self.db.execute(
            select(Camera).where(Camera.id == camera_id)
        )
        return result.scalar_one_or_none()

    async def update_camera(
        self,
        camera_id: int,
        camera_update: CameraUpdate
    ) -> Optional[Camera]:
        """
        Update camera information.

        Args:
            camera_id: Camera ID
            camera_update: Fields to update

        Returns:
            Updated camera if found, None otherwise
        """
        camera = await self.get_camera(camera_id)
        if not camera:
            return None

        # Update only provided fields
        update_data = camera_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(camera, field, value)

        await self.db.commit()
        await self.db.refresh(camera)

        return camera

    async def delete_camera(self, camera_id: int) -> bool:
        """
        Delete a camera.

        Args:
            camera_id: Camera ID

        Returns:
            True if deleted, False if not found
        """
        camera = await self.get_camera(camera_id)
        if not camera:
            return False

        await self.db.delete(camera)
        await self.db.commit()

        return True
