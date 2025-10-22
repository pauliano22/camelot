# Camelot User Guide

## Overview
Camelot is a tactical surveillance system inspired by Palantir Gotham. It provides real-time monitoring of security cameras with AI-powered object detection.

## Interface Layout

### Header Bar
Located at the top of the screen:
- **Logo & Title**: "CAMELOT" branding on the left
- **Stats**: Quick metrics showing:
  - 📹 Total cameras
  - 📶 Online cameras  
  - 🎯 Active targets (detected entities)
  - 🔴 LIVE indicator
- **Action Buttons** (right side):
  - SEARCH: Search and filter events
  - CAMERAS: View camera list
  - TIMELINE: View chronological timeline
  - INTEL: View intelligence feed

### Main Display
- **Center**: Interactive Mapbox map showing camera locations and detected entities
- **Left Panel**: Collapsible panel for search/cameras (opens when button clicked)
- **Right Panel**: Collapsible panel for timeline/intel/entity details (opens when button clicked)

## Features

### 1. Map View (Center Display)

**What it shows:**
- Camera markers (green circle with play icon = online, gray = offline)
- Entity markers (colored circles with icons):
  - 🟡 Yellow = Person
  - 🟣 Purple = Vehicle
  - 🟢 Green = Animal

**How to use:**
- **Pan**: Click and drag
- **Zoom**: Mouse wheel or pinch gesture
- **Rotate**: Right-click and drag (or two-finger drag on trackpad)
- **Click camera marker**: Shows popup with camera details
- **Click entity marker**: Opens Entity Details panel on right

**Map Controls (top-left corner):**
- Click "MAP CONTROLS" to expand
- **Map Style**: Choose from 6 styles (Dark, Light, Streets, Satellite, Hybrid, Outdoors)
- **3D View**: Toggle between 2D/3D perspective (tilts map to show buildings in 3D)
- **Reset View**: Returns to default camera position

### 2. Search & Filter (Left Panel)

**How to open:** Click "SEARCH" button in header

**Features:**
- **Search Bar**: Type to search by:
  - Event type (motion, person, vehicle, animal)
  - Camera ID
  
- **Event Type Filters**: Click buttons to filter by:
  - ⚡ Motion (blue)
  - 👤 Person (yellow)
  - 🚗 Vehicle (purple)
  - 🐾 Animal (green)
  - Can select multiple types
  
- **Camera Filters**: 
  - Click camera names to filter events from specific cameras
  - Can select multiple cameras
  
- **Confidence Slider**:
  - Drag slider to set minimum confidence threshold (0-100%)
  - Only shows events with confidence above this value
  
- **Time Range Dropdown**:
  - All Time
  - Last Hour
  - Last 24 Hours
  - Last 7 Days
  - Last 30 Days

**Clear Filters**: Click red "CLEAR ALL FILTERS" button to reset

**How filters work:**
- Set your filters in the SEARCH panel
- Then click "INTEL" button to see filtered results
- The intelligence feed will only show events matching ALL selected filters

### 3. Cameras Panel (Left Panel)

**How to open:** Click "CAMERAS" button in header

**Shows:** List of all camera nodes with:
- Camera icon (📹)
- Camera name
- Camera ID (e.g., "ID: 001")
- Status badge (ON/OFF)
- Description
- GPS coordinates

**Visual indicators:**
- Green badge = Online
- Gray badge = Offline
- Hover over camera card for highlight effect

### 4. Timeline View (Right Panel)

**How to open:** Click "TIMELINE" button in header

**Features:**
- Vertical timeline showing all events chronologically
- Events grouped by either:
  - **TIME**: Groups events by hour/minute
  - **CAMERA**: Groups events by camera ID
- Toggle between views using TIME/CAMERA buttons at top

**Timeline Display:**
- Vertical line connects all events
- Each group shows count badge
- Events show:
  - Icon (based on type)
  - Event type
  - Timestamp (HH:MM:SS)
  - Camera ID
  - Confidence percentage

**How to read:**
- Scroll down to see older events
- Click TIME/CAMERA button to change grouping
- Color-coded dots indicate event type

### 5. Intelligence Feed (Right Panel)

**How to open:** Click "INTEL" button in header

**Shows:** Real-time feed of all security events

**Event Cards Display:**
- Icon showing event type
- Event type label (MOTION, PERSON, VEHICLE, ANIMAL)
- Timestamp (HH:MM:SS format)
- Node (camera ID)
- Confidence bar (visual + percentage)

**Features:**
- Auto-refreshes every 2 seconds
- Scrollable list (newest at top)
- Color-coded by event type:
  - Blue = Motion
  - Yellow = Person
  - Purple = Vehicle
  - Green = Animal
- Hover for glow effect

**With Search:**
- Filters applied in SEARCH panel affect this feed
- Shows "NO EVENTS MATCH FILTERS" when filters exclude all events

### 6. Entity Details Panel (Right Panel)

**How to open:** Click any entity marker on the map

**Shows detailed information about selected entity:**

**Header:**
- Large icon (based on entity type)
- Entity ID (e.g., "person_42")
- Object type label

**Quick Stats:**
- Confidence score (percentage)
- Status (ACTIVE/INACTIVE)

**Sections:**
- **Location**:
  - Latitude (6 decimal places)
  - Longitude (6 decimal places)
  
- **Timeline**:
  - First Seen (date and time)
  - Last Seen (date and time)
  - Duration (in seconds)
  
- **Detection Source**:
  - Camera ID that detected this entity
  
- **Related Events**:
  - Count of events from same camera
  
- **Recognition** (if applicable):
  - Shows if entity was recognized
  - Displays recognized name/label

**Close**: Click X button in top-right to return to previous panel

## Workflow Examples

### Example 1: Monitoring Live Activity
1. Keep "INTEL" panel open on right
2. Watch events stream in real-time
3. Click entity markers on map to see details
4. Use map to see geographical distribution

### Example 2: Investigating Specific Event
1. Click "SEARCH" to open filter panel
2. Select event type you're looking for (e.g., "Person")
3. Optionally select specific cameras
4. Click "INTEL" to see filtered results
5. Click entity on map for full details

### Example 3: Reviewing Timeline
1. Click "TIMELINE" button
2. Toggle between TIME/CAMERA grouping
3. Scroll through chronological history
4. Click on entity markers to see details

### Example 4: Checking Camera Status
1. Click "CAMERAS" button
2. Review which cameras are online/offline
3. Check GPS coordinates
4. Look at camera locations on map

## Keyboard & Mouse Controls

**Map:**
- Click + Drag = Pan
- Scroll = Zoom
- Right-click + Drag = Rotate (2D) / Tilt (3D)
- Double-click = Zoom in

**Panels:**
- Only one left panel can be open at a time
- Only one right panel can be open at a time
- Clicking a panel button toggles it (on/off)

**Browser:**
- F11 = Fullscreen
- Ctrl/Cmd + R = Refresh
- Ctrl/Cmd + Shift + R = Hard refresh (clears cache)

## Tips & Best Practices

1. **Use Search Before Investigating**: Set filters first, then view intel feed
2. **Group Timeline by Camera**: Useful for seeing which cameras are most active
3. **3D View**: Best for understanding terrain and building layouts
4. **Satellite View**: Useful for aerial perspective
5. **Entity Details**: Click entities to track their full history
6. **Confidence Filter**: Set to 70%+ to reduce false positives
7. **Time Range**: Use "Last Hour" for recent activity focus

## Performance Notes

- System auto-refreshes data every 2-5 seconds
- Map entities update in real-time
- Filtering happens client-side (instant)
- Large datasets (100+ events) may slow scrolling slightly

## Troubleshooting

**Map not loading?**
- Check Mapbox token in frontend/.env
- Refresh page (Ctrl/Cmd + Shift + R)

**No entities showing?**
- Check that cameras are online (CAMERAS panel)
- Verify simulator is running (check backend logs)
- Wait 5-10 seconds for entities to generate

**Search not working?**
- Make sure filters are set in SEARCH panel
- Then click "INTEL" button to see filtered results
- Check that events exist matching your filters

**Panel won't open?**
- Only one panel per side can be open
- Click button again to close/reopen
- Refresh browser if stuck

#### Collapsible Groups
**How it works:**
- Each group (time period or camera) can be expanded or collapsed
- Click the group header to toggle
- Shows event count badge
- Arrow icon indicates state:
  - ▶ = Collapsed
  - ▼ = Expanded

**Expand/Collapse All:**
- Button at top of timeline
- Click to expand all groups at once
- Click again to collapse all groups
- Saves scrolling time when reviewing many events

**Benefits:**
- Less scrolling needed
- See overview of all groups at once
- Focus on specific time periods or cameras
- Faster navigation through large event lists

**Example Usage:**
1. Click "TIMELINE" button
2. Click "CAMERA" to group by camera
3. See all camera groups collapsed
4. Click specific camera to see its events
5. Or click "EXPAND ALL" to see everything

### Timeline Grouping Details

**Group by TIME:**
Groups events into meaningful time buckets:
- **Just Now**: Events from the last minute
- **Last 5 Minutes**: Events from 1-5 minutes ago
- **Last 15 Minutes**: Events from 5-15 minutes ago
- **Last 30 Minutes**: Events from 15-30 minutes ago
- **Last Hour**: Events from 30-60 minutes ago
- **[Hour]:00**: Older events grouped by hour (e.g., "18:00", "17:00")

This makes it easy to see recent activity at a glance without too many groups.

**Group by CAMERA:**
Groups all events by which camera detected them:
- **CAMERA 001**: All events from camera ID 1
- **CAMERA 002**: All events from camera ID 2
- etc.

Useful for tracking which cameras are most active or investigating a specific camera's activity.
