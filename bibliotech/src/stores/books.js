import { defineStore } from 'pinia'
import { fetchBooks, createBook, updateBook, deleteBook } from '../services/api.js'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    loading: false,
    error: null,
  }),

  getters: {
    availableBooks: (state) => state.books.filter(b => b.unidades_disponibles > 0),
    genres: (state) => [...new Set(state.books.map(b => b.genero))].sort(),
  },

  actions: {
    async load() {
      this.loading = true
      this.error = null
      try {
        this.books = await fetchBooks()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async create(book) {
      const newBook = await createBook(book)
      this.books.unshift(newBook)
      return newBook
    },

    async update(id, updates) {
      const updated = await updateBook(id, updates)
      const idx = this.books.findIndex(b => b.id === id)
      if (idx !== -1) this.books[idx] = updated
      return updated
    },

    async remove(id) {
      await deleteBook(id)
      this.books = this.books.filter(b => b.id !== id)
    }
  }
})
