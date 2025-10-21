"""
Camera API Endpoints

RESTful API for camera management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List

from app.db.session import get_db
from app.schemas.camera import CameraCreate, CameraUpdate, CameraResponse
from app.services.camera_service import CameraService

router = APIRouter()

@router.post("/cameras", response_model=CameraResponse, status_code=status.HTTP_201_CREATED)
async def create_camera(
    camera: CameraCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new camera.

    **Request body:**
    - name: Camera name (required)
    - description: Optional description
    - latitude: Camera latitude (required)
    - longitude: Camera longitude (required)
    - rtsp_url: RTSP stream URL (required)
    - username: Optional RTSP username
    - password: Optional RTSP password
    - config: Optional configuration dict

    **Returns:** Created camera object
    """
    service = CameraService(db)
    created_camera = await service.create_camera(camera)

    # Convert location to lat/lon for response
    return CameraResponse(
        id=created_camera.id,
        name=created_camera.name,
        description=created_camera.description,
        latitude=camera.latitude,
        longitude=camera.longitude,
        is_active=created_camera.is_active,
        is_online=created_camera.is_online,
        config=created_camera.config,
        created_at=created_camera.created_at,
        updated_at=created_camera.updated_at,
    )


@router.get("/cameras", response_model=List[CameraResponse])
async def get_cameras(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    Get all cameras.

    **Query parameters:**
    - skip: Number of records to skip (default: 0)
    - limit: Maximum records to return (default: 100)

    **Returns:** List of cameras
    """
    service = CameraService(db)
    cameras = await service.get_cameras(skip=skip, limit=limit)

    result = []
    for camera in cameras:
        # Extract lat/lon from geography using raw SQL
        lat_lon = await db.execute(
            text("SELECT ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon FROM cameras WHERE id = :id"),
            {"id": camera.id}
        )
        coords = lat_lon.first()

        camera_dict = {
            "id": camera.id,
            "name": camera.name,
            "description": camera.description,
            "latitude": coords.lat if coords else 0,
            "longitude": coords.lon if coords else 0,
            "is_active": camera.is_active,
            "is_online": camera.is_online,
            "config": camera.config,
            "created_at": camera.created_at,
            "updated_at": camera.updated_at,
        }
        result.append(CameraResponse(**camera_dict))

    return result

@router.get("/cameras/{camera_id}", response_model=CameraResponse)
async def get_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific camera.

    **Path parameters:**
    - camera_id: Camera ID

    **Returns:** Camera object
    **Raises:** 404 if camera not found
    """
    service = CameraService(db)
    camera = await service.get_camera(camera_id)

    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Camera {camera_id} not found"
        )

    # Extract lat/lon from geography using raw SQL
    lat_lon = await db.execute(
        text("SELECT ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon FROM cameras WHERE id = :id"),
        {"id": camera.id}
    )
    coords = lat_lon.first()

    return CameraResponse(
        id=camera.id,
        name=camera.name,
        description=camera.description,
        latitude=coords.lat if coords else 0,
        longitude=coords.lon if coords else 0,
        is_active=camera.is_active,
        is_online=camera.is_online,
        config=camera.config,
        created_at=camera.created_at,
        updated_at=camera.updated_at,
    )

@router.patch("/cameras/{camera_id}", response_model=CameraResponse)
async def update_camera(
    camera_id: int,
    camera_update: CameraUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Update a camera.

    **Path parameters:**
    - camera_id: Camera ID

    **Request body:** Fields to update

    **Returns:** Updated camera object
    **Raises:** 404 if camera not found
    """
    service = CameraService(db)
    camera = await service.update_camera(camera_id, camera_update)

    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Camera {camera_id} not found"
        )

    # Extract lat/lon from geography using raw SQL
    lat_lon = await db.execute(
        text("SELECT ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon FROM cameras WHERE id = :id"),
        {"id": camera.id}
    )
    coords = lat_lon.first()

    return CameraResponse(
        id=camera.id,
        name=camera.name,
        description=camera.description,
        latitude=coords.lat if coords else 0,
        longitude=coords.lon if coords else 0,
        is_active=camera.is_active,
        is_online=camera.is_online,
        config=camera.config,
        created_at=camera.created_at,
        updated_at=camera.updated_at,
    )

@router.delete("/cameras/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a camera.

    **Path parameters:**
    - camera_id: Camera ID

    **Returns:** 204 No Content on success
    **Raises:** 404 if camera not found
    """
    service = CameraService(db)
    deleted = await service.delete_camera(camera_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Camera {camera_id} not found"
        )
