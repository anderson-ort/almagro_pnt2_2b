import { defineStore } from 'pinia'
import { getBookRecommendations } from '../services/gemini.js'

const TTL = 1000 * 60 * 60 // 1 hora

export const useRecommendationsStore = defineStore('recommendations', {
  state: () => ({
    cache: new Map(),
    loading: false,
  }),

  actions: {
    async getRecommendations(book) {
      const cached = this.cache.get(book.id)
      if (cached && Date.now() - cached.timestamp < TTL) {
        return cached.data
      }

      this.loading = true
      try {
        const data = await getBookRecommendations(book)
        this.cache.set(book.id, { data, timestamp: Date.now() })
        return data
      } catch (err) {
        console.error('Error obteniendo recomendaciones:', err)
        return []
      } finally {
        this.loading = false
      }
    }
  }
})
