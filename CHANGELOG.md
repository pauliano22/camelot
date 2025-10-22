# Changelog

All notable changes to Camelot will be documented in this file.

## [Latest] - 2025-10-22

### Added
- **Collapsible Timeline Groups**: Timeline groups are now collapsible to reduce scrolling
  - Click group header to expand/collapse
  - "EXPAND ALL" / "COLLAPSE ALL" button for quick access
  - Smooth animations when expanding
  - Groups remember state until you change grouping mode

### Changed
- **Search & Filter**: Now actually filters the Intelligence Feed
  - Set filters in SEARCH panel
  - Switch to INTEL panel to see filtered results
  - Filters persist until cleared
  
### Fixed
- Search functionality now properly filters events
- Timeline performance improved with collapsible groups

## [Earlier Updates]

### Features Implemented
1. **Map View**
   - Interactive Mapbox with 6 map styles
   - 3D building view
   - Camera and entity markers
   - Click entities to see details

2. **Search & Filter**
   - Text search by event type and camera ID
   - Filter by event types (motion, person, vehicle, animal)
   - Filter by cameras
   - Confidence threshold slider
   - Time range selector

3. **Timeline View**
   - Chronological event display
   - Group by time or camera
   - Collapsible groups for easy navigation

4. **Intelligence Feed**
   - Real-time event stream
   - Auto-refresh every 2 seconds
   - Color-coded by event type
   - Respects search filters

5. **Entity Details**
   - Full entity history
   - Location information
   - Timeline (first seen, last seen, duration)
   - Detection source
   - Recognition status

6. **Camera Management**
   - View all cameras with status
   - Online/offline indicators
   - GPS coordinates
   - Descriptions

### Technical
- React 18 with TypeScript
- Mapbox GL JS for mapping
- Tailwind CSS for styling
- Lucide React for icons
- Zustand for state management
- FastAPI backend with PostgreSQL + PostGIS
- Docker containerization

### Improved
- **Timeline Time Grouping**: Now uses smart time buckets instead of minute-by-minute
  - "Just Now" (0-1 min ago)
  - "Last 5 Minutes" (1-5 min ago)
  - "Last 15 Minutes" (5-15 min ago)
  - "Last 30 Minutes" (15-30 min ago)
  - "Last Hour" (30-60 min ago)
  - Hourly groups for older events (e.g., "18:00")
  - Makes timeline much more readable and reduces scrolling
