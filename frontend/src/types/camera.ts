/**
 * Camera Types
 * 
 * TypeScript interfaces for camera data.
 * Must match backend schemas.
 */

export interface Camera {
  id: number
  name: string
  description: string | null
  latitude: number
  longitude: number
  is_active: boolean
  is_online: boolean
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CameraCreate {
  name: string
  description?: string
  latitude: number
  longitude: number
  rtsp_url: string
  username?: string
  password?: string
  config?: Record<string, any>
}
