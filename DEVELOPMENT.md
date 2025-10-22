# Development Guide

## Project State & Known Issues

### What's Working ✅
- Frontend dashboard with Mapbox integration
- Backend API with FastAPI
- PostgreSQL database with PostGIS
- Camera CRUD operations
- Entity and event creation
- Real-time simulator generating entities and events
- Map with multiple styles and 3D view
- Entity markers moving on map
- Event feed with auto-refresh
- Scrollable event sidebar

### Recent Fixes 🔧
1. **Entity API endpoint**: Fixed Geography field extraction using ST_Y/ST_X SQL functions
2. **Event schema**: Changed ID fields from string to int to match database
3. **Camera schema**: Added `config` field to CameraCreate and `is_online` to CameraUpdate
4. **Simulator**: Fixed camera loading to properly extract lat/lon from Geography points
5. **Event feed**: Made scrollable with proper overflow handling
6. **Map controls**: Added style selector and 3D toggle

### Important Implementation Details 📝

#### Geography Fields
Cameras and entities use PostGIS Geography fields for location:
```python
# In models
location = Column(Geography(geometry_type='POINT', srid=4326))

# Creating
location = WKTElement(f'POINT({lon} {lat})', srid=4326)

# Querying - must extract lat/lon with SQL functions
func.ST_Y(func.ST_AsText(Model.location)).label('latitude')
func.ST_X(func.ST_AsText(Model.location)).label('longitude')
```

#### Simulator Behavior
- Runs in background asyncio task
- Loads cameras on startup
- Generates entities (50% chance every 3 seconds)
- Moves entities (every 3 seconds)
- Generates events (every 3 seconds)
- Cleans up entities after 60 seconds

#### Frontend State
- Uses Zustand for state management
- Camera store: `/store/cameraStore.ts`
- Entity store: `/store/entityStore.ts`
- Polls API every 2-5 seconds
- Mapbox markers updated via useEffect

### Development Workflow 🔄

#### Making Changes
1. **Backend changes**: Edit files, then `docker-compose restart backend`
2. **Frontend changes**: Vite hot-reloads automatically
3. **Database schema**: Create migration with alembic
4. **New features**: Update README.md with usage

#### Testing Locally
```bash
# Quick reset
./scripts/reset_and_setup.sh

# Add test camera
./scripts/add_camera.sh "Test Cam" "Testing" 42.4443 -76.5018

# Watch simulator
docker-compose logs -f backend | grep -E "(Generated|Created)"

# Check database
docker-compose exec postgres psql -U admin -d home_security
```

## Key Files Reference

### Backend Core
- `backend/app/main.py` - FastAPI app entry point
- `backend/app/db/session.py` - Database session management
- `backend/app/workers/simulator.py` - Background simulator

### Models
- `backend/app/models/camera.py` - Camera model
- `backend/app/models/entity.py` - Entity model
- `backend/app/models/event.py` - Event model

### API Endpoints
- `backend/app/api/v1/cameras.py` - Camera CRUD
- `backend/app/api/v1/entities.py` - Entity endpoints
- `backend/app/api/v1/events.py` - Event endpoints

### Frontend Core
- `frontend/src/pages/Dashboard.tsx` - Main page
- `frontend/src/components/map/MapView.tsx` - Map component
- `frontend/src/components/EventFeed.tsx` - Event feed

### Stores
- `frontend/src/store/cameraStore.ts` - Camera state
- `frontend/src/store/entityStore.ts` - Entity state

### Schemas
- `backend/app/schemas/camera.py` - Camera API schemas
- `backend/app/schemas/entity.py` - Entity API schemas
- `backend/app/schemas/event.py` - Event API schemas

## Environment Variables

### Backend (.env or docker-compose.yml)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `RABBITMQ_URL` - RabbitMQ connection string

### Frontend (frontend/.env)
- `VITE_MAPBOX_TOKEN` - Mapbox API token

## Useful Commands
```bash
# Backend shell
docker-compose exec backend bash

# Database shell
docker-compose exec postgres psql -U admin -d home_security

# View all tables
docker-compose exec postgres psql -U admin -d home_security -c "\dt"

# Count records
docker-compose exec postgres psql -U admin -d home_security -c "
  SELECT 
    (SELECT COUNT(*) FROM cameras) as cameras,
    (SELECT COUNT(*) FROM entities) as entities,
    (SELECT COUNT(*) FROM events) as events;
"

# Python shell with models loaded
docker-compose exec backend python -c "from app.db.session import *; from app.models import *"
```

## Next Steps / TODOs

- [ ] Add WebSocket support for real-time updates
- [ ] Implement actual RTSP camera integration
- [ ] Add YOLO object detection
- [ ] Create alert/notification system
- [ ] Add user authentication
- [ ] Record video clips for events
- [ ] Add analytics dashboard
- [ ] Mobile responsive design improvements
- [ ] Unit tests for backend
- [ ] E2E tests for frontend
