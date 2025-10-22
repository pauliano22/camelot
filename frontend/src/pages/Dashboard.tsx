/**
 * Dashboard Page
 * Tactical surveillance interface with collapsible panels
 */

import { MapView } from '../components/map/MapView'
import { EventFeed } from '../components/EventFeed'
import { useCameraStore } from '../store/cameraStore'
import { useEntityStore } from '../store/entityStore'
import { useEffect, useState } from 'react'
import { Shield, Video, Wifi, Target, Activity, MapPin, ChevronLeft, ChevronRight, Radio } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { cameras, fetchCameras } = useCameraStore()
  const { entities, fetchEntities } = useEntityStore()
  const [showCameras, setShowCameras] = useState(false)
  const [showEvents, setShowEvents] = useState(false)

  useEffect(() => {
    fetchCameras()
    fetchEntities()

    const interval = setInterval(() => {
      fetchCameras()
      fetchEntities()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchCameras, fetchEntities])

  const onlineCameras = cameras.filter((c) => c.is_online).length

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header - Compact Tactical Bar */}
      <header className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-cyan-900/30 shadow-lg shadow-cyan-900/10">
        <div className="px-4 py-2 flex items-center justify-between">
          {/* Left side - Logo and Stats */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full"></div>
                <Shield className="relative w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  CAMELOT
                </h1>
              </div>
            </div>

            {/* Stats - Compact */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 border border-cyan-900/30 rounded">
                <Video className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400">{cameras.length}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 border border-emerald-900/30 rounded">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400">{onlineCameras}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 border border-blue-900/30 rounded">
                <Target className="w-3 h-3 text-blue-400" />
                <span className="text-xs font-mono text-blue-400">{entities.length}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 border border-red-900/30 rounded">
                <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                <span className="text-xs font-mono text-red-400">LIVE</span>
              </div>
            </div>
          </div>

          {/* Right side - Panel toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCameras(!showCameras)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-all ${
                showCameras
                  ? 'bg-cyan-600 text-white border border-cyan-500'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <Video className="w-3 h-3" />
              CAMERAS
            </button>

            <button
              onClick={() => setShowEvents(!showEvents)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-all ${
                showEvents
                  ? 'bg-cyan-600 text-white border border-cyan-500'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <Radio className="w-3 h-3" />
              INTEL
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)] relative">
        {/* Left Panel - Cameras (Collapsible) */}
        {showCameras && (
          <aside className="w-80 bg-gradient-to-b from-gray-950 to-black border-r border-cyan-900/20 overflow-y-auto custom-scrollbar absolute left-0 top-0 bottom-0 z-10 shadow-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-mono tracking-wider text-cyan-400 flex items-center gap-2">
                  <span className="w-1 h-4 bg-cyan-500"></span>
                  CAMERA NODES
                </h2>
                <button
                  onClick={() => setShowCameras(false)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {cameras.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <div className="text-gray-600 text-sm font-mono">
                      NO CAMERA NODES DETECTED
                    </div>
                  </div>
                ) : (
                  cameras.map((camera) => (
                    <div
                      key={camera.id}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                      
                      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800 hover:border-cyan-900/50 rounded-lg p-3 transition-all backdrop-blur-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Video className="w-5 h-5 text-cyan-400" />
                            <div>
                              <h3 className="font-mono text-sm text-gray-200 tracking-wide">
                                {camera.name}
                              </h3>
                              <p className="text-xs text-gray-500 font-mono">
                                ID: {camera.id.toString().padStart(3, '0')}
                              </p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono tracking-wider ${
                            camera.is_online
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gray-800/50 text-gray-500 border border-gray-700'
                          }`}>
                            <Wifi className="w-3 h-3" />
                            {camera.is_online ? 'ON' : 'OFF'}
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-2 font-light">
                          {camera.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-500/70">
                          <MapPin className="w-3 h-3" />
                          <span>{camera.latitude.toFixed(4)}, {camera.longitude.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Center - Full Width Map */}
        <main className="flex-1 relative">
          <MapView />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-black/30"></div>
          </div>
        </main>

        {/* Right Panel - Intel Feed (Collapsible) */}
        {showEvents && (
          <aside className="w-80 bg-gradient-to-b from-gray-950 to-black border-l border-cyan-900/20 flex flex-col absolute right-0 top-0 bottom-0 z-10 shadow-2xl">
            <div className="p-3 border-b border-cyan-900/20">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono tracking-wider text-cyan-400 flex items-center gap-2">
                  <span className="w-1 h-4 bg-cyan-500"></span>
                  INTELLIGENCE FEED
                </h2>
                <button
                  onClick={() => setShowEvents(false)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-3">
              <EventFeed />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
