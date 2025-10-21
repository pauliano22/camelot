"""
Configuration Management

This file loads settings from environment variables.
Makes it easy to change settings without modifying code.
"""

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Pydantic automatically:
    - Loads values from .env file
    - Validates types
    - Provides defaults
    """

    # Application
    APP_NAME: str = "Home Security System"
    DEBUG: bool = True

    # Database
    # Format: postgresql+asyncpg://user:password@host:port/database
    DATABASE_URL: str = "postgresql+asyncpg://admin:password123@postgres:5432/home_security"

    # Redis
    REDIS_URL: str = "redis://redis:6379"

    # RabbitMQ
    RABBITMQ_URL: str = "amqp://admin:password123@rabbitmq:5672/"

    # Processing
    FRAME_PROCESSING_FPS: int = 5  # Process 5 frames per second
    CONFIDENCE_THRESHOLD: float = 0.5  # Only detections above 50% confidence

    class Config:
        # Load from .env file
        env_file = ".env"
        # Make it case-sensitive
        case_sensitive = True

# Create single instance to use everywhere
settings = Settings()
