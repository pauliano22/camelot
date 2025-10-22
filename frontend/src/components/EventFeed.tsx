/**
 * Event Feed Component
 * 
 * Displays real-time security events.
 */

import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Event } from '../types/event'

export const EventFeed: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events')
      setEvents(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load events')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    
    // Poll every 2 seconds
    const interval = setInterval(fetchEvents, 2000)
    return () => clearInterval(interval)
  }, [])

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'motion': return '🏃'
      case 'person': return '👤'
      case 'vehicle': return '🚗'
      case 'animal': return '🐾'
      default: return '📹'
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'motion': return 'bg-blue-500/20 text-blue-300'
      case 'person': return 'bg-yellow-500/20 text-yellow-300'
      case 'vehicle': return 'bg-purple-500/20 text-purple-300'
      case 'animal': return 'bg-green-500/20 text-green-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  if (loading) {
    return (
      <div className="text-gray-400 text-center py-8">
        Loading events...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded p-3 text-red-200 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto space-y-2">
      {events.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No events yet
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getEventIcon(event.event_type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventColor(event.event_type)}`}>
                    {event.event_type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  Camera: {event.camera_id}
                </p>
                <p className="text-xs text-gray-400">
                  Confidence: {(event.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
