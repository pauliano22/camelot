"""
Entity API Endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from app.db.session import get_db
from app.schemas.entity import EntityCreate, EntityResponse
from app.services.entity_service import EntityService
from app.models.entity import Entity

router = APIRouter()

@router.post("/entities", response_model=EntityResponse)
async def create_entity(
    entity: EntityCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new entity detection."""
    service = EntityService(db)
    return await service.create_entity(entity)

@router.get("/entities", response_model=List[EntityResponse])
async def get_entities(db: AsyncSession = Depends(get_db)):
    """Get all active entities."""
    # Query entities with extracted lat/lon from Geography field
    result = await db.execute(
        select(
            Entity.id,
            Entity.entity_id,
            Entity.object_type,
            Entity.camera_id,
            Entity.confidence,
            Entity.first_seen,
            Entity.last_seen,
            Entity.is_active,
            Entity.is_recognized,
            Entity.recognized_as,
            func.ST_Y(func.ST_AsText(Entity.location)).label('latitude'),
            func.ST_X(func.ST_AsText(Entity.location)).label('longitude')
        ).where(Entity.is_active == True)
    )
    
    entities_data = result.all()
    
    response = []
    for row in entities_data:
        entity_dict = {
            "id": row.id,
            "entity_id": row.entity_id,
            "object_type": row.object_type,
            "latitude": float(row.latitude) if row.latitude else 0,
            "longitude": float(row.longitude) if row.longitude else 0,
            "camera_id": row.camera_id,
            "confidence": row.confidence,
            "first_seen": row.first_seen,
            "last_seen": row.last_seen,
            "is_active": row.is_active,
            "is_recognized": row.is_recognized,
            "recognized_as": row.recognized_as,
        }
        response.append(EntityResponse(**entity_dict))
    
    return response
