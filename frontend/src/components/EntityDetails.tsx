/**
 * Entity Details Component
 * Shows full history and details of a selected entity
 */

import { useEffect, useState } from 'react'
import { X, User, Car, Footprints, MapPin, Clock, Activity, Camera } from 'lucide-react'
import { api } from '../services/api'
import type { Entity } from '../types/entity'
import type { Event } from '../types/event'

interface EntityDetailsProps {
  entityId: number
  onClose: () => void
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({ entityId, onClose }) => {
  const [entity, setEntity] = useState<Entity | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntityDetails = async () => {
      try {
        // Fetch entity
        const entitiesResponse = await api.get('/entities')
        const foundEntity = entitiesResponse.data.find((e: Entity) => e.id === entityId)
        setEntity(foundEntity)

        // Fetch all events - in a real app, you'd filter by entity on backend
        const eventsResponse = await api.get('/events')
        setEvents(eventsResponse.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEntityDetails()
  }, [entityId])

  if (loading || !entity) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-cyan-500 font-mono text-sm">LOADING ENTITY DATA...</div>
      </div>
    )
  }

  const getEntityIcon = () => {
    switch (entity.object_type) {
      case 'person': return User
      case 'vehicle': return Car
      case 'animal': return Footprints
      default: return Activity
    }
  }

  const getEntityColor = () => {
    switch (entity.object_type) {
      case 'person': return 'yellow'
      case 'vehicle': return 'purple'
      case 'animal': return 'green'
      default: return 'blue'
    }
  }

  const EntityIcon = getEntityIcon()
  const color = getEntityColor()

  const relatedEvents = events.filter(e => e.camera_id === entity.camera_id)

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-950 to-black">
      {/* Header */}
      <div className="p-4 border-b border-cyan-900/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-${color}-900/30 border border-${color}-500/30 flex items-center justify-center`}>
              <EntityIcon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <div>
              <h2 className="text-lg font-mono tracking-wider text-cyan-400">{entity.entity_id}</h2>
              <p className="text-xs font-mono text-gray-500 uppercase">{entity.object_type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-900/50 border border-gray-800 rounded p-2">
            <div className="text-xs text-gray-500 font-mono mb-1">CONFIDENCE</div>
            <div className={`text-lg font-bold text-${color}-400`}>
              {(entity.confidence * 100).toFixed(0)}%
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded p-2">
            <div className="text-xs text-gray-500 font-mono mb-1">STATUS</div>
            <div className={`text-lg font-bold ${entity.is_active ? 'text-emerald-400' : 'text-gray-500'}`}>
              {entity.is_active ? 'ACTIVE' : 'INACTIVE'}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {/* Location */}
        <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono text-cyan-400">LOCATION</h3>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Latitude:</span>
              <span className="text-gray-300">{entity.latitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Longitude:</span>
              <span className="text-gray-300">{entity.longitude.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono text-cyan-400">TIMELINE</h3>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">First Seen:</span>
              <span className="text-gray-300">
                {new Date(entity.first_seen).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Seen:</span>
              <span className="text-gray-300">
                {new Date(entity.last_seen).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration:</span>
              <span className="text-gray-300">
                {Math.floor((new Date(entity.last_seen).getTime() - new Date(entity.first_seen).getTime()) / 1000)}s
              </span>
            </div>
          </div>
        </div>

        {/* Camera */}
        <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono text-cyan-400">DETECTION SOURCE</h3>
          </div>
          <div className="text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Camera ID:</span>
              <span className="text-gray-300">{entity.camera_id.toString().padStart(3, '0')}</span>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono text-cyan-400">RELATED EVENTS</h3>
          </div>
          <div className="text-xs font-mono text-gray-400">
            {relatedEvents.length} events from same camera
          </div>
        </div>

        {/* Recognition */}
        {entity.is_recognized && (
          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-mono text-yellow-400">RECOGNIZED</h3>
            </div>
            <div className="text-xs font-mono text-yellow-300">
              {entity.recognized_as}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
