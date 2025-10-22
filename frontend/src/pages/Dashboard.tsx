/**
 * Dashboard Page
 * Tactical surveillance interface with professional icons
 */

import { MapView } from '../components/map/MapView'
import { EventFeed } from '../components/EventFeed'
import { useCameraStore } from '../store/cameraStore'
import { useEntityStore } from '../store/entityStore'
import { useEffect } from 'react'
import { Shield, Video, Wifi, Target, Activity, MapPin } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { cameras, fetchCameras } = useCameraStore()
  const { entities, fetchEntities } = useEntityStore()

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
      {/* Header - Tactical Command Bar */}
      <header className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-cyan-900/30 shadow-lg shadow-cyan-900/10">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
                <Shield className="relative w-10 h-10 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  CAMELOT
                </h1>
                <p className="text-xs text-cyan-500/70 tracking-widest font-mono">
                  TACTICAL SURVEILLANCE SYSTEM
                </p>
              </div>
            </div>

            {/* Status Metrics */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500/10 blur-md rounded-lg"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-900/30 rounded-lg px-4 py-2">
                  <div className="text-xs text-cyan-500/70 font-mono mb-0.5 flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    CAMERAS
                  </div>
                  <div className="text-2xl font-bold tabular-nums text-cyan-400">
                    {cameras.length}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/10 blur-md rounded-lg"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-900/30 rounded-lg px-4 py-2">
                  <div className="text-xs text-emerald-500/70 font-mono mb-0.5 flex items-center gap-1">
                    <Wifi className="w-3 h-3" />
                    ONLINE
                  </div>
                  <div className="text-2xl font-bold tabular-nums text-emerald-400">
                    {onlineCameras}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/10 blur-md rounded-lg"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-blue-900/30 rounded-lg px-4 py-2">
                  <div className="text-xs text-blue-500/70 font-mono mb-0.5 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    TARGETS
                  </div>
                  <div className="text-2xl font-bold tabular-nums text-blue-400">
                    {entities.length}
                  </div>
                </div>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-red-900/30 rounded-lg">
                <div className="relative flex items-center">
                  <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                </div>
                <span className="text-xs font-mono text-red-400 tracking-wider">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Camera Grid */}
        <aside className="w-80 bg-gradient-to-b from-gray-950 to-black border-r border-cyan-900/20 overflow-y-auto custom-scrollbar">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-mono tracking-wider text-cyan-400 flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-500"></span>
                CAMERA NODES
              </h2>
              <div className="text-xs font-mono text-gray-500">
                {cameras.length} ACTIVE
              </div>
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
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                    
                    <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800 hover:border-cyan-900/50 rounded-lg p-3 transition-all backdrop-blur-sm">
                      {/* Camera Header */}
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
                          {camera.is_online ? 'ONLINE' : 'OFFLINE'}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-400 mb-2 font-light">
                        {camera.description}
                      </p>

                      {/* Coordinates */}
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

        {/* Center - Tactical Map */}
        <main className="flex-1 relative">
          <MapView />
          
          {/* Map Overlay Grid Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-black/30"></div>
          </div>
        </main>

        {/* Right Panel - Intelligence Feed */}
        <aside className="w-96 bg-gradient-to-b from-gray-950 to-black border-l border-cyan-900/20 flex flex-col">
          <div className="p-4 border-b border-cyan-900/20">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono tracking-wider text-cyan-400 flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-500"></span>
                INTELLIGENCE FEED
              </h2>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <EventFeed />
          </div>
        </aside>
      </div>
    </div>
  )
}
