/**
 * Map View Component
 * 
 * Displays an interactive map with camera markers.
 * Uses Mapbox GL JS.
 */

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useCameraStore } from '../../store/cameraStore'

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<Map<number, mapboxgl.Marker>>(new Map())
  
  const cameras = useCameraStore((state) => state.cameras)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Create map centered on Ithaca, NY (your location)
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',  // Dark theme
      center: [-76.5019, 42.4440],  // [longitude, latitude]
      zoom: 15,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update camera markers when cameras change
  useEffect(() => {
    if (!map.current) return

    // Remove markers that no longer exist
    markers.current.forEach((marker, id) => {
      if (!cameras.find((cam) => cam.id === id)) {
        marker.remove()
        markers.current.delete(id)
      }
    })

    // Add/update markers for each camera
    cameras.forEach((camera) => {
      let marker = markers.current.get(camera.id)

      if (!marker) {
        // Create new marker
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

        markers.current.set(camera.id, marker)
      } else {
        // Update existing marker
        marker.setLngLat([camera.longitude, camera.latitude])
        
        // Update color based on online status
        const el = marker.getElement()
        el.style.backgroundColor = camera.is_online ? '#10b981' : '#6b7280'
      }
    })
  }, [cameras])

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}
