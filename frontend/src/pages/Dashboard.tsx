/**
 * Dashboard Page
 *
 * Main view showing the map, camera list, and event feed.
 */

import { useEffect } from 'react'
import { MapView } from '../components/map/MapView'
import { EventFeed } from '../components/EventFeed'
import { useCameraStore } from '../store/cameraStore'
import { useEntityStore } from '../store/entityStore'


export const Dashboard: React.FC = () => {
  const { cameras, loading, error, fetchCameras } = useCameraStore()
  const { entities, fetchEntities } = useEntityStore()

  // Fetch cameras on mount
  useEffect(() => {
    fetchCameras()
    fetchEntities()

    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchEntities()
    }, 2000)

    return () => clearInterval(interval)
  }, [fetchCameras, fetchEntities])

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            🏠 Camelot
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">
              Cameras: <span className="font-semibold">{cameras.length}</span>
            </div>
            <div className="text-sm text-gray-300">
              Online: <span className="font-semibold text-green-400">
                {cameras.filter((c) => c.is_online).length}
              </span>
            </div>
            <div className="text-sm text-gray-300">
              Detections: <span className="font-semibold text-blue-400">
                {entities.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Cameras */}
        <aside className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Cameras</h2>

          {loading && (
            <div className="text-gray-400 text-center py-8">
              Loading cameras...
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          {!loading && cameras.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              No cameras yet. Add one to get started!
            </div>
          )}

          {!loading && cameras.map((camera) => (
            <div
              key={camera.id}
              className="bg-gray-700 rounded-lg p-4 mb-3 hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{camera.name}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    camera.is_online
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}
                >
                  {camera.is_online ? 'Online' : 'Offline'}
                </span>
              </div>
              {camera.description && (
                <p className="text-sm text-gray-300 mb-2">
                  {camera.description}
                </p>
              )}
              <div className="text-xs text-gray-400">
                📍 {camera.latitude.toFixed(4)}, {camera.longitude.toFixed(4)}
              </div>
            </div>
          ))}
        </aside>

        {/* Map */}
        <main className="flex-1">
          <MapView />
        </main>

        {/* Right Sidebar - Event Feed */}
        <aside className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Events</h2>
          <EventFeed />
        </aside>
      </div>
    </div>
  )
}
