/**
 * Dashboard Page
 * Main application view with map, cameras, and events.
 */

import { MapView } from '../components/map/MapView'
import { EventFeed } from '../components/EventFeed'
import { useCameraStore } from '../store/cameraStore'
import { useEntityStore } from '../store/entityStore'
import { useEffect } from 'react'

export const Dashboard: React.FC = () => {
  const { cameras, fetchCameras } = useCameraStore()
  const { entities, fetchEntities } = useEntityStore()

  useEffect(() => {
    fetchCameras()
    fetchEntities()

    // Poll for updates
    const interval = setInterval(() => {
      fetchCameras()
      fetchEntities()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchCameras, fetchEntities])

  const onlineCameras = cameras.filter((c) => c.is_online).length

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold">Camelot</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Cameras:</span>
              <span className="font-semibold text-blue-400">{cameras.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Online:</span>
              <span className="font-semibold text-green-400">{onlineCameras}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Detections:</span>
              <span className="font-semibold text-blue-400">{entities.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Cameras */}
        <aside className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Cameras</h2>
          <div className="space-y-3">
            {cameras.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No cameras yet. Add one to get started!
              </p>
            ) : (
              cameras.map((camera) => (
                <div
                  key={camera.id}
                  className="bg-gray-700 rounded-lg p-3 hover:bg-gray-650 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{camera.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        camera.is_online
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {camera.is_online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {camera.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    📍 {camera.latitude.toFixed(4)}, {camera.longitude.toFixed(4)}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center - Map */}
        <main className="flex-1">
          <MapView />
        </main>

        {/* Right Sidebar - Events */}
        <aside className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Recent Events</h2>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <EventFeed />
          </div>
        </aside>
      </div>
    </div>
  )
}
