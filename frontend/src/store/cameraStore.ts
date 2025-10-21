/**
 * Camera Store
 * 
 * Global state for cameras using Zustand.
 */

import { create } from 'zustand'
import { Camera } from '../types/camera'
import { cameraService } from '../services/cameraService'

interface CameraState {
  cameras: Camera[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchCameras: () => Promise<void>
  addCamera: (camera: Camera) => void
  updateCamera: (id: number, updates: Partial<Camera>) => void
  removeCamera: (id: number) => void
}

export const useCameraStore = create<CameraState>((set) => ({
  cameras: [],
  loading: false,
  error: null,

  fetchCameras: async () => {
    set({ loading: true, error: null })
    try {
      const cameras = await cameraService.getCameras()
      set({ cameras, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cameras',
        loading: false 
      })
    }
  },

  addCamera: (camera) => set((state) => ({
    cameras: [...state.cameras, camera]
  })),

  updateCamera: (id, updates) => set((state) => ({
    cameras: state.cameras.map((cam) =>
      cam.id === id ? { ...cam, ...updates } : cam
    )
  })),

  removeCamera: (id) => set((state) => ({
    cameras: state.cameras.filter((cam) => cam.id !== id)
  })),
}))
