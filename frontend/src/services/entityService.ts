import { api } from './api'
import { Entity } from '../types/entity'

export const entityService = {
  async getEntities(): Promise<Entity[]> {
    const response = await api.get<Entity[]>('/entities')
    return response.data
  },
}
