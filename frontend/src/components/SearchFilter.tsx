/**
 * Search and Filter Component
 * Global search and filtering for events and entities
 */

import { useState, useEffect } from 'react'
import { Search, Filter, X, Zap, User, Car, Footprints } from 'lucide-react'
import { useCameraStore } from '../store/cameraStore'

interface SearchFilterProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  searchQuery: string
  eventTypes: string[]
  cameraIds: number[]
  confidenceMin: number
  timeRange: string
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onFilterChange }) => {
  const cameras = useCameraStore((state) => state.cameras)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    eventTypes: [],
    cameraIds: [],
    confidenceMin: 0,
    timeRange: 'all'
  })

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const toggleEventType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type]
    }))
  }

  const toggleCamera = (id: number) => {
    setFilters(prev => ({
      ...prev,
      cameraIds: prev.cameraIds.includes(id)
        ? prev.cameraIds.filter(c => c !== id)
        : [...prev.cameraIds, id]
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      eventTypes: [],
      cameraIds: [],
      confidenceMin: 0,
      timeRange: 'all'
    })
  }

  const activeFilterCount = 
    filters.eventTypes.length + 
    filters.cameraIds.length + 
    (filters.confidenceMin > 0 ? 1 : 0) + 
    (filters.timeRange !== 'all' ? 1 : 0)

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search events, entities..."
          value={filters.searchQuery}
          onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-900 border border-gray-700 hover:border-cyan-900/50 rounded transition-all"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono text-cyan-400">FILTERS</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-cyan-600 text-white text-xs rounded font-mono">
              {activeFilterCount}
            </span>
          )}
        </div>
        <span className="text-gray-500">{showFilters ? '▼' : '▶'}</span>
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-900 border border-gray-700 rounded p-3 space-y-4">
          {/* Event Types */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-gray-400 tracking-wider">EVENT TYPES</label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'motion', icon: Zap, label: 'Motion', color: 'blue' },
                { type: 'person', icon: User, label: 'Person', color: 'yellow' },
                { type: 'vehicle', icon: Car, label: 'Vehicle', color: 'purple' },
                { type: 'animal', icon: Footprints, label: 'Animal', color: 'green' }
              ].map(({ type, icon: Icon, label, color }) => (
                <button
                  key={type}
                  onClick={() => toggleEventType(type)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs font-mono transition-all ${
                    filters.eventTypes.includes(type)
                      ? `bg-${color}-600 text-white border border-${color}-500`
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-750'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cameras */}
          <div>
            <label className="text-xs font-mono text-gray-400 tracking-wider mb-2 block">CAMERAS</label>
            <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
              {cameras.map(camera => (
                <button
                  key={camera.id}
                  onClick={() => toggleCamera(camera.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-mono transition-all ${
                    filters.cameraIds.includes(camera.id)
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                  }`}
                >
                  <span>{camera.name}</span>
                  <span className="text-xs opacity-70">{camera.id.toString().padStart(3, '0')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div>
            <label className="text-xs font-mono text-gray-400 tracking-wider mb-2 block">
              MIN CONFIDENCE: {filters.confidenceMin}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.confidenceMin}
              onChange={(e) => setFilters(prev => ({ ...prev, confidenceMin: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Time Range */}
          <div>
            <label className="text-xs font-mono text-gray-400 tracking-wider mb-2 block">TIME RANGE</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
              className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Time</option>
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-900/20 border border-red-800/30 hover:bg-red-900/30 rounded text-xs font-mono text-red-400 transition-all"
            >
              <X className="w-3 h-3" />
              CLEAR ALL FILTERS
            </button>
          )}
        </div>
      )}
    </div>
  )
}
