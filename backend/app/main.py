"""
FastAPI Application Entry Point
"""
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.v1.router import api_router
from app.config import settings
from app.workers.simulator import simulator


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifespan.
    Code before 'yield' runs on startup.
    Code after 'yield' runs on shutdown.
    """
    # Startup
    print(f"🚀 Starting {settings.APP_NAME}")
    print(f"📊 Database: {settings.DATABASE_URL.split('@')[1]}")
    print(f"🔧 Debug mode: {settings.DEBUG}")
    
    # Start simulator
    asyncio.create_task(simulator.start())
    
    yield
    
    # Shutdown
    print("👋 Shutting down gracefully...")
    await simulator.stop()


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Real-time home security monitoring with AI",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "debug": settings.DEBUG
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "health": "/health"
    }
