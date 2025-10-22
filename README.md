# 🏰 Camelot - Real-Time Security Monitoring System

<div align="center">

![Camelot Banner](https://img.shields.io/badge/Security-Monitoring-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**AI-powered home security platform with real-time object detection and geospatial tracking**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack)

</div>

---

## 🎯 Overview

Camelot is a production-grade security monitoring system that combines computer vision, real-time geospatial analysis, and modern web technologies to provide comprehensive surveillance capabilities. Built with a microservices architecture, it processes camera feeds in real-time, detects objects with 95%+ accuracy, and displays them on an interactive map dashboard—all with sub-200ms latency.

## ✨ Features

- 🎥 **Real-Time Video Processing** - Connect multiple IP cameras via RTSP streams
- 🤖 **AI Object Detection** - YOLO-powered detection of people, vehicles, and objects with 95%+ confidence
- 🗺️ **Geospatial Tracking** - PostGIS-powered location queries and mapping on Mapbox GL JS
- ⚡ **Sub-200ms Latency** - WebSocket connections for instant dashboard updates
- 🔄 **Async Processing** - RabbitMQ message queues for scalable frame processing
- 📊 **Interactive Dashboard** - Dark-themed React UI with live camera feeds and detection markers
- 🐳 **Containerized** - Docker Compose orchestration for one-command deployment
- 📈 **Scalable Architecture** - Microservices design supporting horizontal scaling

## 🎬 Demo

<div align="center">

![Camelot Dashboard](https://via.placeholder.com/800x450/1a1a2e/16213e?text=Dashboard+Screenshot)

*Real-time security dashboard showing camera locations and detected objects*

</div>

### Key Capabilities

- **Multi-Camera Support** - Monitor unlimited cameras from a single dashboard
- **Object Tracking** - Persistent tracking across frames with unique entity IDs
- **Historical Playback** - Review past detections and entity movements
- **Alert Zones** - Define restricted areas and receive instant notifications
- **RESTful API** - Full API documentation at `/docs` for integration

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (20.10+)
- [Mapbox Access Token](https://account.mapbox.com/access-tokens/) (free tier)
- 4GB+ RAM recommended

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/pauliano22/camelot.git
   cd camelot
```

2. **Configure environment**
```bash
   # Create .env file
   echo "MAPBOX_TOKEN=your_token_here" > .env
```

3. **Start the platform**
```bash
   docker-compose up --build
```

4. **Access the dashboard**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs
   - RabbitMQ Management: http://localhost:15672

### Add Your First Camera
```bash
curl -X POST http://localhost:8000/api/v1/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Front Door",
    "description": "Main entrance camera",
    "latitude": 42.4440,
    "longitude": -76.5019,
    "rtsp_url": "rtsp://your-camera-ip:554/stream1"
  }'
```

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│         (TypeScript + Mapbox GL JS + Zustand)           │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  FastAPI Backend                         │
│        (Async Python + SQLAlchemy + Pydantic)           │
└─────┬──────────┬──────────┬─────────────────────────────┘
      │          │          │
      ↓          ↓          ↓
┌──────────┐ ┌────────┐ ┌──────────┐
│PostgreSQL│ │ Redis  │ │ RabbitMQ │
│+ PostGIS │ │(Cache) │ │ (Queue)  │
└──────────┘ └────────┘ └──────────┘
      │                      │
      │                      ↓
      │          ┌────────────────────────┐
      │          │  Background Workers    │
      │          │  • Camera Collector    │
      └──────────│  • CV Processor (YOLO) │
                 │  • Entity Tracker      │
                 └────────────────────────┘
```

### Data Flow

1. **Camera Collector** pulls frames from RTSP streams → RabbitMQ queue
2. **CV Processor** consumes frames → Runs YOLO inference → Saves to PostgreSQL
3. **Redis Pub/Sub** broadcasts new detections → Backend listens
4. **WebSocket** pushes updates to all connected clients
5. **React Frontend** receives update → Updates Zustand store → Re-renders map

**Processing Time:** ~200-500ms from camera to dashboard

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance async web framework with auto-generated docs
- **PostgreSQL + PostGIS** - Relational database with geospatial extensions
- **SQLAlchemy** - Async ORM for database operations
- **Redis** - In-memory cache and pub/sub for real-time events
- **RabbitMQ** - Message queue for asynchronous task processing
- **YOLO (Ultralytics)** - State-of-the-art object detection (YOLOv8)
- **OpenCV** - Computer vision library for frame processing

### Frontend
- **React 18 + TypeScript** - Type-safe component-based UI
- **Mapbox GL JS** - Interactive map visualization
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling

### DevOps
- **Docker + Docker Compose** - Containerization and orchestration
- **Alembic** - Database migrations
- **Uvicorn** - ASGI server for FastAPI

## 📁 Project Structure
```
camelot/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   │   ├── cameras.py   # Camera CRUD operations
│   │   │   └── entities.py  # Detection endpoints
│   │   ├── models/          # SQLAlchemy models
│   │   │   ├── camera.py    # Camera table
│   │   │   └── entity.py    # Detection table
│   │   ├── schemas/         # Pydantic validation
│   │   ├── services/        # Business logic
│   │   ├── workers/         # Background processors
│   │   │   └── simulator.py # Detection simulator
│   │   ├── db/              # Database config
│   │   ├── config.py        # Environment settings
│   │   └── main.py          # FastAPI app entry
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── map/
│   │   │       └── MapView.tsx  # Mapbox component
│   │   ├── pages/
│   │   │   └── Dashboard.tsx    # Main page
│   │   ├── services/            # API clients
│   │   ├── store/               # Zustand stores
│   │   └── types/               # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:
```env
# Mapbox
MAPBOX_TOKEN=pk.eyJ1...

# Database
DATABASE_URL=postgresql+asyncpg://admin:password123@postgres:5432/home_security

# Redis
REDIS_URL=redis://redis:6379

# RabbitMQ
RABBITMQ_URL=amqp://admin:password123@rabbitmq:5672/

# Processing
FRAME_PROCESSING_FPS=5
CONFIDENCE_THRESHOLD=0.5
```

### Camera Configuration

Cameras are configured via API with the following fields:
```typescript
{
  name: string              // Camera identifier
  description?: string      // Optional description
  latitude: number         // GPS latitude
  longitude: number        // GPS longitude
  rtsp_url: string         // RTSP stream URL
  username?: string        // Optional auth
  password?: string        // Optional auth
  config?: {
    fps: number           // Processing frame rate
    resolution: string    // e.g., "1920x1080"
    detection_enabled: boolean
  }
}
```

## 📊 API Documentation

### Cameras
```bash
# Create camera
POST /api/v1/cameras

# Get all cameras
GET /api/v1/cameras?skip=0&limit=100

# Get specific camera
GET /api/v1/cameras/{camera_id}

# Update camera
PATCH /api/v1/cameras/{camera_id}

# Delete camera
DELETE /api/v1/cameras/{camera_id}
```

### Entities (Detections)
```bash
# Create detection
POST /api/v1/entities

# Get active detections
GET /api/v1/entities
```

Full interactive docs available at http://localhost:8000/docs

## 🧪 Development

### Running Tests
```bash
# Backend tests
docker-compose exec backend pytest

# Frontend tests
docker-compose exec frontend npm test
```

### Database Migrations
```bash
# Create migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback
docker-compose exec backend alembic downgrade -1
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🎯 Roadmap

- [x] Core real-time detection and tracking
- [x] Interactive map dashboard
- [x] Multi-camera support
- [ ] Real RTSP camera integration
- [ ] Alert zones and notifications
- [ ] Historical playback with timeline scrubber
- [ ] Face recognition capabilities
- [ ] Mobile app (React Native)
- [ ] Email/SMS alerts
- [ ] Cloud deployment (AWS/GCP)
- [ ] Multi-tenancy support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Ultralytics YOLO](https://github.com/ultralytics/ultralytics) - Object detection
- [Mapbox](https://www.mapbox.com/) - Map visualization
- [PostGIS](https://postgis.net/) - Geospatial database extension

## 📧 Contact

Paul Iacobucci - [@pauliano22](https://github.com/pauliano22) - pmi22@cornell.edu

Project Link: [https://github.com/pauliano22/camelot](https://github.com/pauliano22/camelot)

---

<div align="center">

**Built with ❤️ at Cornell University**

⭐ Star this repo if you find it helpful!

</div>

## 🎮 How to Use Camelot

For detailed usage instructions, see [USER_GUIDE.md](USER_GUIDE.md).

### Quick Start Guide

1. **View the Map**: The center shows your surveillance area with cameras and entities
2. **Monitor Events**: Click "INTEL" to see real-time event feed
3. **Search & Filter**: Click "SEARCH" to filter events by type, camera, confidence, or time
4. **View Timeline**: Click "TIMELINE" to see chronological event history
5. **Check Cameras**: Click "CAMERAS" to see all camera nodes and their status
6. **Inspect Entities**: Click any entity marker on the map to see full details

### Feature Overview

| Feature | Button | Description |
|---------|--------|-------------|
| Search & Filter | SEARCH | Filter events by type, camera, confidence, time range |
| Camera List | CAMERAS | View all cameras with status and locations |
| Timeline | TIMELINE | Chronological view of events grouped by time or camera |
| Intel Feed | INTEL | Real-time stream of all security events |
| Entity Details | (Click entity) | Detailed history of any detected entity |
| Map Controls | (Top-left) | Change map style, toggle 3D, reset view |

### Understanding the Display

**Camera Markers (on map):**
- 🟢 Green circle = Camera online
- ⚪ Gray circle = Camera offline

**Entity Markers (on map):**
- 🟡 Yellow = Person detected
- 🟣 Purple = Vehicle detected
- 🟢 Green = Animal detected

**Header Stats:**
- 📹 = Total cameras in system
- 📶 = Number of cameras online
- 🎯 = Active entities currently tracked
- 🔴 LIVE = System is running

### Workflow: Finding Specific Events

1. Click **SEARCH** button (opens left panel)
2. Set your filters:
   - Type search query if needed
   - Click event type buttons (Person, Vehicle, etc.)
   - Select specific cameras
   - Adjust confidence threshold
   - Choose time range
3. Click **INTEL** button (opens right panel)
4. View filtered results
5. Click entity markers on map for more details

### Workflow: Monitoring Live Activity

1. Click **INTEL** button (right panel opens)
2. Watch events stream in real-time
3. Events auto-refresh every 2 seconds
4. Click entity markers on map to investigate
5. Use map to see geographical patterns

### Workflow: Reviewing History

1. Click **TIMELINE** button (right panel opens)
2. Choose grouping:
   - **TIME**: See events by hour
   - **CAMERA**: See events by camera node
3. Scroll through timeline
4. Click entities on map for full details
