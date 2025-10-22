/**
 * Timeline Component
 * Visual timeline of all events with collapsible groups
 */

import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Event } from '../types/event'
import { Zap, User, Car, Footprints, Radio, Clock, ChevronDown, ChevronRight } from 'lucide-react'

export const Timeline: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [groupBy, setGroupBy] = useState<'hour' | 'camera'>('hour')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events')
      setEvents(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    const interval = setInterval(fetchEvents, 5000)
    return () => clearInterval(interval)
  }, [])

  // Reset expanded groups when groupBy changes
  useEffect(() => {
    setExpandedGroups(new Set())
  }, [groupBy])

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
      case 'motion': return 'bg-blue-500'
      case 'person': return 'bg-yellow-500'
      case 'vehicle': return 'bg-purple-500'
      case 'animal': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTimeGroupLabel = (minutes: number) => {
    const now = new Date()
    const eventTime = new Date(now.getTime() - minutes * 60000)
    
    if (minutes < 1) return 'Just Now'
    if (minutes < 5) return 'Last 5 Minutes'
    if (minutes < 15) return 'Last 15 Minutes'
    if (minutes < 30) return 'Last 30 Minutes'
    if (minutes < 60) return 'Last Hour'
    
    // For older events, show the actual hour
    return eventTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeGroupKey = (timestamp: string) => {
    const now = Date.now()
    const eventTime = new Date(timestamp).getTime()
    const minutesAgo = Math.floor((now - eventTime) / 60000)
    
    if (minutesAgo < 1) return '0-1' // Just now
    if (minutesAgo < 5) return '1-5' // Last 5 minutes
    if (minutesAgo < 15) return '5-15' // Last 15 minutes
    if (minutesAgo < 30) return '15-30' // Last 30 minutes
    if (minutesAgo < 60) return '30-60' // Last hour
    
    // For older events, group by hour
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit'
    }) + ':00'
  }

  const groupEventsByHour = () => {
    const grouped: { [key: string]: Event[] } = {}
    
    events.forEach(event => {
      const groupKey = getTimeGroupKey(event.timestamp)
      if (!grouped[groupKey]) grouped[groupKey] = []
      grouped[groupKey].push(event)
    })

    // Sort groups by most recent first
    const sortedGroups: { [key: string]: Event[] } = {}
    const sortOrder = ['0-1', '1-5', '5-15', '15-30', '30-60']
    
    // Add time range groups first
    sortOrder.forEach(key => {
      if (grouped[key]) {
        sortedGroups[key] = grouped[key]
      }
    })
    
    // Then add hour groups (sorted newest first)
    Object.keys(grouped)
      .filter(key => !sortOrder.includes(key))
      .sort((a, b) => b.localeCompare(a))
      .forEach(key => {
        sortedGroups[key] = grouped[key]
      })
    
    return sortedGroups
  }

  const groupEventsByCamera = () => {
    const grouped: { [key: number]: Event[] } = {}
    events.forEach(event => {
      if (!grouped[event.camera_id]) grouped[event.camera_id] = []
      grouped[event.camera_id].push(event)
    })
    return grouped
  }

  const getDisplayLabel = (groupKey: string) => {
    if (groupBy === 'camera') {
      return `CAMERA ${groupKey.padStart(3, '0')}`
    }
    
    // Time groups
    const timeLabels: { [key: string]: string } = {
      '0-1': 'Just Now',
      '1-5': 'Last 5 Minutes',
      '5-15': 'Last 15 Minutes',
      '15-30': 'Last 30 Minutes',
      '30-60': 'Last Hour'
    }
    
    return timeLabels[groupKey] || groupKey
  }

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey)
    } else {
      newExpanded.add(groupKey)
    }
    setExpandedGroups(newExpanded)
  }

  const toggleAll = () => {
    const grouped = groupBy === 'hour' ? groupEventsByHour() : groupEventsByCamera()
    const allKeys = Object.keys(grouped)
    
    if (expandedGroups.size === allKeys.length) {
      // All expanded, collapse all
      setExpandedGroups(new Set())
    } else {
      // Some or none expanded, expand all
      setExpandedGroups(new Set(allKeys))
    }
  }

  const grouped = groupBy === 'hour' ? groupEventsByHour() : groupEventsByCamera()
  const allExpanded = expandedGroups.size === Object.keys(grouped).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyan-500 font-mono text-sm">LOADING TIMELINE...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-mono tracking-wider text-cyan-400">TIMELINE</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setGroupBy('hour')}
            className={`px-2 py-1 rounded text-xs font-mono transition-all ${
              groupBy === 'hour'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            TIME
          </button>
          <button
            onClick={() => setGroupBy('camera')}
            className={`px-2 py-1 rounded text-xs font-mono transition-all ${
              groupBy === 'camera'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            CAMERA
          </button>
        </div>
      </div>

      {/* Expand/Collapse All Button */}
      <button
        onClick={toggleAll}
        className="mb-3 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs font-mono text-gray-400 transition-all flex items-center gap-2"
      >
        {allExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {allExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}
      </button>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-cyan-900/30"></div>

          {/* Events grouped */}
          {Object.entries(grouped).map(([group, groupEvents]) => {
            const isExpanded = expandedGroups.has(group)
            
            return (
              <div key={group} className="mb-4">
                {/* Group header - Clickable */}
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center gap-3 mb-2 hover:bg-gray-900/30 rounded p-1 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-mono text-cyan-400">{groupEvents.length}</span>
                  </div>
                  <div className="text-sm font-mono text-cyan-400 flex-1 text-left">
                    {getDisplayLabel(group)}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  )}
                </button>

                {/* Events in group - Collapsible */}
                {isExpanded && (
                  <div className="ml-8 space-y-2 animate-fadeIn">
                    {groupEvents.map((event) => {
                      const IconComponent = getEventIcon(event.event_type)
                      const colorClass = getEventColor(event.event_type)
                      
                      return (
                        <div
                          key={event.id}
                          className="relative pl-6 pb-3"
                        >
                          {/* Connector dot */}
                          <div className={`absolute left-0 top-2 w-2 h-2 rounded-full ${colorClass}`}></div>

                          {/* Event card */}
                          <div className="bg-gray-900/50 border border-gray-800 hover:border-cyan-900/50 rounded p-2 transition-all">
                            <div className="flex items-start gap-2">
                              <IconComponent className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-gray-300 uppercase">{event.event_type}</span>
                                  <span className="text-xs font-mono text-gray-500">
                                    {new Date(event.timestamp).toLocaleTimeString('en-US', { 
                                      hour12: false,
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-500">CAM:</span>
                                  <span className="text-gray-400">{event.camera_id.toString().padStart(3, '0')}</span>
                                  <span className="text-gray-500">CONF:</span>
                                  <span className="text-gray-400">{(event.confidence * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
