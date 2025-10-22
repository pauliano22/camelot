/**
 * Map View Component
 *
 * Displays an interactive map with camera markers and entity markers.
 * Uses Mapbox GL JS with multiple style options.
 */
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useCameraStore } from '../../store/cameraStore'
import { useEntityStore } from '../../store/entityStore'

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// Map style options
const MAP_STYLES = [
  { id: 'dark', name: 'Dark', url: 'mapbox://styles/mapbox/dark-v11' },
  { id: 'light', name: 'Light', url: 'mapbox://styles/mapbox/light-v11' },
  { id: 'streets', name: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' },
  { id: 'satellite', name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
  { id: 'satellite-streets', name: 'Satellite Streets', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
  { id: 'outdoors', name: 'Outdoors', url: 'mapbox://styles/mapbox/outdoors-v12' },
]

export const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const cameraMarkers = useRef<Map<number, mapboxgl.Marker>>(new Map())
  const entityMarkers = useRef<Map<number, mapboxgl.Marker>>(new Map())
  
  const cameras = useCameraStore((state) => state.cameras)
  const entities = useEntityStore((state) => state.entities)

  const [currentStyle, setCurrentStyle] = useState('dark')
  const [showControls, setShowControls] = useState(false)
  const [pitch, setPitch] = useState(0)
  const [bearing, setBearing] = useState(0)
  const [is3D, setIs3D] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Create map centered on Ithaca, NY
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.find(s => s.id === currentStyle)!.url,
      center: [-76.5019, 42.4440],
      zoom: 15,
      pitch: 0,
      bearing: 0,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right')

    // Add 3D buildings when map loads
    map.current.on('load', () => {
      if (!map.current) return
      
      // Add 3D building layer
      const layers = map.current.getStyle().layers
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id

      map.current.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      )
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Change map style
  const changeStyle = (styleId: string) => {
    if (!map.current) return
    
    const style = MAP_STYLES.find(s => s.id === styleId)
    if (style) {
      map.current.setStyle(style.url)
      setCurrentStyle(styleId)
      
      // Re-add 3D buildings after style change
      map.current.once('styledata', () => {
        if (!map.current) return
        
        const layers = map.current.getStyle().layers
        const labelLayerId = layers?.find(
          (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
        )?.id

        if (map.current.getLayer('3d-buildings')) {
          map.current.removeLayer('3d-buildings')
        }

        map.current.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height'],
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height'],
              ],
              'fill-extrusion-opacity': 0.6,
            },
          },
          labelLayerId
        )
      })
    }
  }

  // Toggle 3D view
  const toggle3D = () => {
    if (!map.current) return
    
    if (is3D) {
      // Switch to 2D
      map.current.easeTo({ pitch: 0, bearing: 0, duration: 1000 })
      setPitch(0)
      setBearing(0)
      setIs3D(false)
    } else {
      // Switch to 3D
      map.current.easeTo({ pitch: 60, bearing: -20, duration: 1000 })
      setPitch(60)
      setBearing(-20)
      setIs3D(true)
    }
  }

  // Reset view
  const resetView = () => {
    if (!map.current) return
    map.current.flyTo({
      center: [-76.5019, 42.4440],
      zoom: 15,
      pitch: 0,
      bearing: 0,
      duration: 1500,
    })
    setPitch(0)
    setBearing(0)
    setIs3D(false)
  }

  // Update camera markers when cameras change
  useEffect(() => {
    if (!map.current) return

    // Remove markers that no longer exist
    cameraMarkers.current.forEach((marker, id) => {
      if (!cameras.find((cam) => cam.id === id)) {
        marker.remove()
        cameraMarkers.current.delete(id)
      }
    })

    // Add/update markers for each camera
    cameras.forEach((camera) => {
      let marker = cameraMarkers.current.get(camera.id)

      if (!marker) {
        // Create new camera marker
        const el = document.createElement('div')
        el.className = 'camera-marker'
        el.style.width = '30px'
        el.style.height = '30px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = camera.is_online ? '#10b981' : '#6b7280'
        el.style.border = '3px solid white'
        el.style.cursor = 'pointer'
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'

        marker = new mapboxgl.Marker(el)
          .setLngLat([camera.longitude, camera.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold;">${camera.name}</h3>
                <p style="margin: 0; color: #666; font-size: 12px;">
                  ${camera.description || 'No description'}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 12px;">
                  Status: <span style="color: ${camera.is_online ? '#10b981' : '#6b7280'}">
                    ${camera.is_online ? 'Online' : 'Offline'}
                  </span>
                </p>
              </div>
            `)
          )
          .addTo(map.current!)

        cameraMarkers.current.set(camera.id, marker)
      } else {
        // Update existing marker
        marker.setLngLat([camera.longitude, camera.latitude])
        const el = marker.getElement()
        el.style.backgroundColor = camera.is_online ? '#10b981' : '#6b7280'
      }
    })
  }, [cameras])

  // Update entity markers when entities change
  useEffect(() => {
    if (!map.current) return

    // Remove entity markers that no longer exist
    entityMarkers.current.forEach((marker, id) => {
      if (!entities.find((entity) => entity.id === id)) {
        marker.remove()
        entityMarkers.current.delete(id)
      }
    })

    // Add/update markers for each entity
    entities.forEach((entity) => {
      let marker = entityMarkers.current.get(entity.id)

      if (!marker) {
        // Create new entity marker
        const el = document.createElement('div')
        el.className = 'entity-marker'
        
        // Choose emoji based on entity type
        let emoji = '📍'
        
        if (entity.object_type === 'person') {
          emoji = '👤'
        } else if (entity.object_type === 'vehicle') {
          emoji = '🚗'
        } else if (entity.object_type === 'animal') {
          emoji = '🐾'
        }
        
        el.innerHTML = emoji
        el.style.fontSize = '24px'
        el.style.cursor = 'pointer'
        el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'

        marker = new mapboxgl.Marker(el)
          .setLngLat([entity.longitude, entity.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 15 }).setHTML(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold;">${entity.entity_id}</h3>
                <p style="margin: 0; color: #666; font-size: 12px;">
                  Type: ${entity.object_type}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 12px;">
                  Confidence: ${(entity.confidence * 100).toFixed(0)}%
                </p>
              </div>
            `)
          )
          .addTo(map.current!)

        entityMarkers.current.set(entity.id, marker)
      } else {
        // Update existing entity marker position (for movement)
        marker.setLngLat([entity.longitude, entity.latitude])
      }
    })
  }, [entities])

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Controls Panel */}
      <div className="absolute top-4 left-4 bg-gray-800/95 backdrop-blur rounded-lg shadow-lg border border-gray-700">
        <button
          onClick={() => setShowControls(!showControls)}
          className="px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>🗺️</span>
          <span className="font-medium">Map Controls</span>
          <span className="text-gray-400">{showControls ? '▼' : '▶'}</span>
        </button>
        
        {showControls && (
          <div className="p-4 border-t border-gray-700 space-y-4">
            {/* Map Style Selector */}
            <div>
              <label className="text-sm text-gray-300 font-medium mb-2 block">
                Map Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MAP_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => changeStyle(style.id)}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      currentStyle === style.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Toggle */}
            <div>
              <button
                onClick={toggle3D}
                className={`w-full px-4 py-2 rounded font-medium transition-colors ${
                  is3D
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {is3D ? '📐 2D View' : '🏗️ 3D View'}
              </button>
            </div>

            {/* Reset View */}
            <div>
              <button
                onClick={resetView}
                className="w-full px-4 py-2 rounded font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                🎯 Reset View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
