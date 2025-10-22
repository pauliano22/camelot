"""
Events API Endpoints
Get security events from cameras.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from app.db.session import get_db
from app.models.event import Event
from app.schemas.event import EventResponse

router = APIRouter()

@router.get("/events", response_model=List[EventResponse])
async def get_events(
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Get recent events."""
    result = await db.execute(
        select(Event).order_by(desc(Event.timestamp)).limit(limit)
    )
    events = result.scalars().all()
    return events
