import { create } from 'zustand'
import { Entity } from '../types/entity'
import { entityService } from '../services/entityService'

interface EntityState {
  entities: Entity[]
  loading: boolean
  
  fetchEntities: () => Promise<void>
  addEntity: (entity: Entity) => void
  updateEntity: (id: number, updates: Partial<Entity>) => void
}

export const useEntityStore = create<EntityState>((set) => ({
  entities: [],
  loading: false,

  fetchEntities: async () => {
    set({ loading: true })
    try {
      const entities = await entityService.getEntities()
      set({ entities, loading: false })
    } catch (error) {
      console.error('Failed to fetch entities:', error)
      set({ loading: false })
    }
  },

  addEntity: (entity) => set((state) => ({
    entities: [...state.entities, entity]
  })),

  updateEntity: (id, updates) => set((state) => ({
    entities: state.entities.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    )
  })),
}))
