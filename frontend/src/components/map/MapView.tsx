/**
 * Map View Component
 * Tactical map with professional icons
 */
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useCameraStore } from '../../store/cameraStore'
import { useEntityStore } from '../../store/entityStore'
import { Map as MapIcon, Layers, Box, RotateCcw, Video as VideoIcon, User, Car, Footprints } from 'lucide-react'

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// Map style options
const MAP_STYLES = [
  { id: 'dark', name: 'Dark', url: 'mapbox://styles/mapbox/dark-v11', icon: '🌙' },
  { id: 'light', name: 'Light', url: 'mapbox://styles/mapbox/light-v11', icon: '☀️' },
  { id: 'streets', name: 'Streets', url: 'mapbox://styles/mapbox/streets-v12', icon: '🗺️' },
  { id: 'satellite', name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-v9', icon: '🛰️' },
  { id: 'satellite-streets', name: 'Hybrid', url: 'mapbox://styles/mapbox/satellite-streets-v12', icon: '🗺️' },
  { id: 'outdoors', name: 'Outdoors', url: 'mapbox://styles/mapbox/outdoors-v12', icon: '🏔️' },
]

// Create camera marker element
const createCameraMarker = (isOnline: boolean) => {
  const el = document.createElement('div')
  el.className = 'camera-marker-container'
  el.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${isOnline ? '#10b981' : '#6b7280'}" opacity="0.2"/>
      <circle cx="16" cy="16" r="12" fill="${isOnline ? '#10b981' : '#6b7280'}" stroke="white" stroke-width="2"/>
      <path d="M12 11L12 21L22 16L12 11Z" fill="white"/>
    </svg>
  `
  el.style.cursor = 'pointer'
  el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
  return el
}

// Create entity marker element
const createEntityMarker = (type: string) => {
  const el = document.createElement('div')
  el.className = 'entity-marker-container'
  
  let color = '#3b82f6'
  let icon = ''
  
  if (type === 'person') {
    color = '#eab308'
    icon = '<circle cx="16" cy="12" r="4" fill="white"/><path d="M10 26C10 21 12 19 16 19C20 19 22 21 22 26" stroke="white" stroke-width="2" fill="none"/>'
  } else if (type === 'vehicle') {
    color = '#a855f7'
    icon = '<rect x="9" y="14" width="14" height="8" rx="2" fill="white"/><circle cx="12" cy="23" r="2" fill="white"/><circle cx="20" cy="23" r="2" fill="white"/><path d="M9 14L11 10H21L23 14" stroke="white" stroke-width="2" fill="none"/>'
  } else if (type === 'animal') {
    color = '#22c55e'
    icon = '<circle cx="13" cy="14" r="3" fill="white"/><circle cx="19" cy="14" r="3" fill="white"/><ellipse cx="16" cy="20" rx="6" ry="4" fill="white"/><path d="M10 11L8 8M22 11L24 8" stroke="white" stroke-width="2"/>'
  }
  
  el.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13" fill="${color}" opacity="0.3"/>
      <circle cx="16" cy="16" r="11" fill="${color}" stroke="white" stroke-width="1.5"/>
      ${icon}
    </svg>
  `
  el.style.cursor = 'pointer'
  el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
  return el
}

export const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const cameraMarkers = useRef<Map<number, mapboxgl.Marker>>(new Map())
  const entityMarkers = useRef<Map<number, mapboxgl.Marker>>(new Map())
  const [mapLoaded, setMapLoaded] = useState(false)
  
  const cameras = useCameraStore((state) => state.cameras)
  const entities = useEntityStore((state) => state.entities)

  const [currentStyle, setCurrentStyle] = useState('dark')
  const [showControls, setShowControls] = useState(false)
  const [is3D, setIs3D] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.find(s => s.id === currentStyle)!.url,
      center: [-76.5019, 42.4440],
      zoom: 15,
      pitch: 0,
      bearing: 0,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right')

    map.current.on('load', () => {
      if (!map.current) return
      
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
      
      setMapLoaded(true)
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  const changeStyle = (styleId: string) => {
    if (!map.current) return
    
    const style = MAP_STYLES.find(s => s.id === styleId)
    if (style) {
      map.current.setStyle(style.url)
      setCurrentStyle(styleId)
      
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

  const toggle3D = () => {
    if (!map.current) return
    
    if (is3D) {
      map.current.easeTo({ pitch: 0, bearing: 0, duration: 1000 })
      setIs3D(false)
    } else {
      map.current.easeTo({ pitch: 60, bearing: -20, duration: 1000 })
      setIs3D(true)
    }
  }

  const resetView = () => {
    if (!map.current) return
    map.current.flyTo({
      center: [-76.5019, 42.4440],
      zoom: 15,
      pitch: 0,
      bearing: 0,
      duration: 1500,
    })
    setIs3D(false)
  }

  // Update camera markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    cameraMarkers.current.forEach((marker, id) => {
      if (!cameras.find((cam) => cam.id === id)) {
        marker.remove()
        cameraMarkers.current.delete(id)
      }
    })

    cameras.forEach((camera) => {
      let marker = cameraMarkers.current.get(camera.id)

      if (!marker) {
        const el = createCameraMarker(camera.is_online)

        marker = new mapboxgl.Marker(el)
          .setLngLat([camera.longitude, camera.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px; font-family: monospace;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold;">${camera.name}</h3>
                <p style="margin: 0; color: #666; font-size: 12px;">
                  ${camera.description || 'No description'}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 12px;">
                  Status: <span style="color: ${camera.is_online ? '#10b981' : '#6b7280'}">
                    ${camera.is_online ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </p>
              </div>
            `)
          )
          .addTo(map.current!)

        cameraMarkers.current.set(camera.id, marker)
      } else {
        marker.setLngLat([camera.longitude, camera.latitude])
        const el = marker.getElement()
        el.innerHTML = createCameraMarker(camera.is_online).innerHTML
      }
    })
  }, [cameras, mapLoaded])

  // Update entity markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    entityMarkers.current.forEach((marker, id) => {
      if (!entities.find((entity) => entity.id === id)) {
        marker.remove()
        entityMarkers.current.delete(id)
      }
    })

    entities.forEach((entity) => {
      let marker = entityMarkers.current.get(entity.id)

      if (!marker) {
        const el = createEntityMarker(entity.object_type)

        marker = new mapboxgl.Marker(el)
          .setLngLat([entity.longitude, entity.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 15 }).setHTML(`
              <div style="padding: 8px; font-family: monospace;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold;">${entity.entity_id}</h3>
                <p style="margin: 0; color: #666; font-size: 12px;">
                  Type: ${entity.object_type.toUpperCase()}
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
        marker.setLngLat([entity.longitude, entity.latitude])
      }
    })
  }, [entities, mapLoaded])

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full"
      />
      
      {/* Map Controls Panel */}
      <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg border border-cyan-900/30">
        <button
          onClick={() => setShowControls(!showControls)}
          className="px-4 py-2.5 text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-2 font-mono text-sm"
        >
          <MapIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400">MAP CONTROLS</span>
          <span className="text-gray-500">{showControls ? '▼' : '▶'}</span>
        </button>
        
        {showControls && (
          <div className="p-4 border-t border-cyan-900/30 space-y-4">
            {/* Map Style Selector */}
            <div>
              <label className="text-xs text-cyan-500/70 font-mono mb-2 block tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3" />
                MAP STYLE
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MAP_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => changeStyle(style.id)}
                    className={`px-3 py-2 rounded text-xs font-mono transition-all ${
                      currentStyle === style.id
                        ? 'bg-cyan-600 text-white border border-cyan-500'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
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
                className={`w-full px-4 py-2.5 rounded font-mono text-sm transition-all flex items-center justify-center gap-2 ${
                  is3D
                    ? 'bg-purple-600 text-white border border-purple-500'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                <Box className="w-4 h-4" />
                {is3D ? '2D VIEW' : '3D VIEW'}
              </button>
            </div>

            {/* Reset View */}
            <div>
              <button
                onClick={resetView}
                className="w-full px-4 py-2.5 rounded font-mono text-sm bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                RESET VIEW
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
