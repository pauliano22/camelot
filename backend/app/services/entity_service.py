"""
Entity Service

Manages detected objects.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from geoalchemy2.functions import ST_SetSRID, ST_MakePoint
from datetime import datetime

from app.models.entity import Entity
from app.schemas.entity import EntityCreate

class EntityService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_entity(self, entity_data: EntityCreate) -> Entity:
        """Create a new detected entity."""
        location = ST_SetSRID(
            ST_MakePoint(entity_data.longitude, entity_data.latitude),
            4326
        )

        entity = Entity(
            entity_id=entity_data.entity_id,
            object_type=entity_data.object_type,
            location=location,
            camera_id=entity_data.camera_id,
            confidence=entity_data.confidence,
            first_seen=datetime.utcnow(),
            last_seen=datetime.utcnow(),
        )

        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)

        return entity

    async def get_active_entities(self) -> List[Entity]:
        """Get all active entities."""
        result = await self.db.execute(
            select(Entity).where(Entity.is_active == True)
        )
        return result.scalars().all()

    async def update_entity_location(
        self,
        entity_id: str,
        latitude: float,
        longitude: float
    ) -> Entity:
        """Update entity location."""
        result = await self.db.execute(
            select(Entity).where(Entity.entity_id == entity_id)
        )
        entity = result.scalar_one_or_none()

        if entity:
            entity.location = ST_SetSRID(
                ST_MakePoint(longitude, latitude),
                4326
            )
            entity.last_seen = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(entity)

        return entity
