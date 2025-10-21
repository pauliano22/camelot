"""
Database Base Configuration

All models inherit from Base.
This sets up SQLAlchemy properly.
"""

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, DateTime
from datetime import datetime

# Create base class for all models
Base = declarative_base()

class BaseModel(Base):
    """
    Abstract base model with common fields.

    All other models inherit from this.
    Automatically adds id, created_at, updated_at to every table.
    """
    __abstract__ = True  # Don't create a table for this

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
