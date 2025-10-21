"""
Database Session Management

Creates async database sessions.
Each request gets its own session.
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.config import settings

# Create async engine
# This connects to PostgreSQL
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries if debug mode
    future=True,
)

# Create session factory
# This creates new sessions for each request
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db() -> AsyncSession:
    """
    Dependency that provides a database session.

    Usage in FastAPI:
        @app.get("/cameras")
        async def get_cameras(db: AsyncSession = Depends(get_db)):
            # Use db here
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
