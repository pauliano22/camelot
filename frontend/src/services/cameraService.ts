/**
 * Camera Service
 * 
 * API calls for camera operations.
 */

import { api } from './api'
import { Camera, CameraCreate } from '../types/camera'

export const cameraService = {
  /**
   * Get all cameras
   */
  async getCameras(): Promise<Camera[]> {
    const response = await api.get<Camera[]>('/cameras')
    return response.data
  },

  /**
   * Get a specific camera
   */
  async getCamera(id: number): Promise<Camera> {
    const response = await api.get<Camera>(`/cameras/${id}`)
    return response.data
  },

  /**
   * Create a new camera
   */
  async createCamera(camera: CameraCreate): Promise<Camera> {
    const response = await api.post<Camera>('/cameras', camera)
    return response.data
  },

  /**
   * Update a camera
   */
  async updateCamera(id: number, updates: Partial<Camera>): Promise<Camera> {
    const response = await api.patch<Camera>(`/cameras/${id}`, updates)
    return response.data
  },

  /**
   * Delete a camera
   */
  async deleteCamera(id: number): Promise<void> {
    await api.delete(`/cameras/${id}`)
  },
}
