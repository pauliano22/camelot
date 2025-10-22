# Changelog

All notable changes to Camelot will be documented in this file.

## [Latest] - 2025-10-22

### Added
- **Enhanced Satellite Imagery**: Upgraded to Mapbox Standard Satellite (significantly better quality)
- **Navigation Night Style**: Tactical dark style optimized for operations
- **Dark 3D Style**: Professional 3D dark theme with building extrusions
- **Collapsible Timeline Groups**: Click to expand/collapse time periods or cameras
- **Search & Filter Functionality**: Actually filters Intelligence Feed now
- **Entity Details Panel**: Click entities on map to see full history

### Map Styles Available
1. **Dark 3D** - Professional tactical theme with 3D buildings
2. **Satellite** - Mapbox Standard Satellite (highest quality satellite imagery)
3. **Hybrid** - Satellite with street labels
4. **Nav Night** - Navigation-optimized dark style
5. **Light** - Clean bright theme
6. **Streets** - Detailed street information
7. **Outdoors** - Topographic features

### Features Implemented
- **Map View**: Interactive Mapbox with 7 professional styles, 3D buildings, camera/entity markers
- **Search & Filter**: Filter by event type, camera, confidence, time range
- **Timeline View**: Chronological events grouped by time or camera (collapsible)
- **Intelligence Feed**: Real-time event stream with filtering
- **Entity Details**: Full entity information panel
- **Camera Management**: View all cameras with online/offline status

### Technical Stack
- React 18 + TypeScript
- Mapbox GL JS (high-res satellite imagery)
- Tailwind CSS
- Lucide React icons
- Zustand state management
- FastAPI + PostgreSQL + PostGIS backend
- Docker containerization
