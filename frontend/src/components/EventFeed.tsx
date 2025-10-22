/**
 * Event Feed Component
 * Tactical intelligence event stream with professional icons
 */

import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Event } from '../types/event'
import { Zap, User, Car, Footprints, Radio, AlertTriangle } from 'lucide-react'
import { FilterState } from './SearchFilter'

interface EventFeedProps {
  filters?: FilterState
}

export const EventFeed: React.FC<EventFeedProps> = ({ filters }) => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events')
      setEvents(response.data)
      setError(null)
    } catch (err) {
      setError('FEED DISCONNECTED')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    const interval = setInterval(fetchEvents, 2000)
    return () => clearInterval(interval)
  }, [])

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'motion': return Zap
      case 'person': return User
      case 'vehicle': return Car
      case 'animal': return Footprints
      default: return Radio
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'motion': return 'from-blue-900/30 to-blue-950/30 border-blue-800/30 text-blue-400'
      case 'person': return 'from-yellow-900/30 to-yellow-950/30 border-yellow-800/30 text-yellow-400'
      case 'vehicle': return 'from-purple-900/30 to-purple-950/30 border-purple-800/30 text-purple-400'
      case 'animal': return 'from-green-900/30 to-green-950/30 border-green-800/30 text-green-400'
      default: return 'from-gray-900/30 to-gray-950/30 border-gray-800/30 text-gray-400'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Apply filters
  const filteredEvents = events.filter(event => {
    if (!filters) return true

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const matchesType = event.event_type.toLowerCase().includes(query)
      const matchesCamera = event.camera_id.toString().includes(query)
      if (!matchesType && !matchesCamera) return false
    }

    // Event type filter
    if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.event_type)) {
      return false
    }

    // Camera filter
    if (filters.cameraIds.length > 0 && !filters.cameraIds.includes(event.camera_id)) {
      return false
    }

    // Confidence filter
    if (event.confidence * 100 < filters.confidenceMin) {
      return false
    }

    // Time range filter
    if (filters.timeRange !== 'all') {
      const eventTime = new Date(event.timestamp).getTime()
      const now = Date.now()
      const ranges: { [key: string]: number } = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }
      const range = ranges[filters.timeRange]
      if (range && now - eventTime > range) {
        return false
      }
    }

    return true
  })

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 text-cyan-500 font-mono text-sm">
          <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-150"></div>
          <span>INITIALIZING FEED</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/20 to-red-950/20 border border-red-800/30 rounded p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-red-400 font-mono text-sm">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto space-y-2 pr-2 custom-scrollbar">
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Radio className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <div className="text-gray-600 text-sm font-mono">
            {filters && (filters.eventTypes.length > 0 || filters.cameraIds.length > 0 || filters.confidenceMin > 0 || filters.timeRange !== 'all')
              ? 'NO EVENTS MATCH FILTERS'
              : 'NO EVENTS DETECTED'}
          </div>
        </div>
      ) : (
        filteredEvents.map((event) => {
          const IconComponent = getEventIcon(event.event_type)
          return (
            <div
              key={event.id}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${getEventColor(event.event_type)} opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur`}></div>
              
              <div className={`relative bg-gradient-to-br ${getEventColor(event.event_type)} border rounded-lg p-3 transition-all backdrop-blur-sm`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded text-xs font-mono tracking-wider uppercase bg-black/30">
                        {event.event_type}
                      </span>
                      <span className="text-xs font-mono text-gray-500">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-gray-500">NODE:</span>
                        <span className="text-gray-300">{event.camera_id.toString().padStart(3, '0')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-gray-500">CONF:</span>
                        <span className="text-gray-300">{(event.confidence * 100).toFixed(0)}%</span>
                        <div className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            style={{ width: `${event.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
