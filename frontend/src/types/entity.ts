export interface Entity {
  id: number
  entity_id: string
  object_type: string
  latitude: number
  longitude: number
  camera_id: number
  confidence: number
  first_seen: string
  last_seen: string
  is_active: boolean
  is_recognized: boolean
  recognized_as: string | null
}
