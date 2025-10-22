/**
 * Event Types
 */

export interface Event {
  id: number  // Changed from string to number
  camera_id: number  // Changed from string to number
  event_type: string
  confidence: number
  metadata: Record<string, any>
  timestamp: string
}
