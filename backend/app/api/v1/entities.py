"""
Entity API Endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.session import get_db
from app.schemas.entity import EntityCreate, EntityResponse
from app.services.entity_service import EntityService

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
    service = EntityService(db)
    entities = await service.get_active_entities()

    result = []
    for entity in entities:
        entity_dict = {
            "id": entity.id,
            "entity_id": entity.entity_id,
            "object_type": entity.object_type,
            "latitude": entity.location.latitude if entity.location else 0,
            "longitude": entity.location.longitude if entity.location else 0,
            "camera_id": entity.camera_id,
            "confidence": entity.confidence,
            "first_seen": entity.first_seen,
            "last_seen": entity.last_seen,
            "is_active": entity.is_active,
            "is_recognized": entity.is_recognized,
            "recognized_as": entity.recognized_as,
        }
        result.append(EntityResponse(**entity_dict))

    return result
