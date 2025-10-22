/**
 * Event Types
 */

export interface Event {
  id: string
  camera_id: string
  event_type: string
  confidence: number
  metadata: Record<string, any>
  timestamp: string
}
