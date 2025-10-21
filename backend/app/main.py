"""
FastAPI Application Entry Point

This is where the backend starts. It:
1. Creates the FastAPI app
2. Sets up middleware (CORS, etc.)
3. Includes API routers
4. Handles startup/shutdown
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.v1.router import api_router
from app.config import settings

# Lifespan context manager
# This runs code on startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifespan.

    Code before 'yield' runs on startup.
    Code after 'yield' runs on shutdown.
    """
    # Startup
    print(f"🚀 Starting {settings.APP_NAME}")
    print(f"📊 Database: {settings.DATABASE_URL.split('@')[1]}")  # Don't log password
    print(f"🔧 Debug mode: {settings.DEBUG}")

    # TODO: Start background workers here

    yield  # Application runs here

    # Shutdown
    print("👋 Shutting down gracefully...")
    # TODO: Stop background workers here

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Real-time home security monitoring with AI",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",  # Swagger UI at http://localhost:8000/docs
    redoc_url="/redoc"  # ReDoc at http://localhost:8000/redoc
)

# Enable CORS (Cross-Origin Resource Sharing)
# This allows frontend (on port 3000) to talk to backend (on port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Simple health check.
    Returns 200 OK if server is running.
    """
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "debug": settings.DEBUG
    }

# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "health": "/health"
    }

# TODO: Include API routers
# app.include_router(camera_router, prefix="/api/v1")
