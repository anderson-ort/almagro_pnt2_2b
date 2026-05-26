import { defineStore } from 'pinia'
import { fetchLoans, createLoan, returnLoan } from '../services/api.js'
import { getMockUserById } from '../services/api.js'
import { useBooksStore } from './books.js'

export const useLoansStore = defineStore('loans', {
  state: () => ({
    loans: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeLoans: (state) => state.loans.filter(l => l.estado === 'activo'),
    overdueLoans: (state) => state.loans.filter(l => l.estado === 'vencido'),
  },

  actions: {
    async load(userId = null) {
      this.loading = true
      this.error = null
      try {
        this.loans = await fetchLoans(userId)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async borrow(userId, bookId, rules) {
      const booksStore = useBooksStore()
      const book = booksStore.books.find(b => b.id === bookId)
      if (!book || book.unidades_disponibles === 0) throw new Error('No hay unidades disponibles')

      const userActiveLoans = this.loans.filter(l => l.usuario_id === userId && l.estado === 'activo')
      if (userActiveLoans.length >= rules.max_libros_simultaneos) {
        throw new Error(`No puedes tener más de ${rules.max_libros_simultaneos} libros prestados a la vez`)
      }

      const fechaPrestamo = new Date()
      const fechaDevolucion = new Date(fechaPrestamo.getTime() + rules.dias_prestamo * 24 * 60 * 60 * 1000)

      const loan = {
        libro_id: bookId,
        usuario_id: userId,
        fecha_prestamo: fechaPrestamo.toISOString(),
        fecha_devolucion_esperada: fechaDevolucion.toISOString(),
        fecha_devolucion_real: null,
        estado: 'activo',
      }

      const newLoan = await createLoan(loan)
      this.loans.unshift(newLoan)
      // Actualizar el estado del libro en el store
      await booksStore.load()
      return newLoan
    },

    async returnBook(loanId, libroId) {
      await returnLoan(loanId, libroId)
      const idx = this.loans.findIndex(l => l.id === loanId)
      if (idx !== -1) {
        this.loans[idx].estado = 'devuelto'
        this.loans[idx].fecha_devolucion_real = new Date().toISOString()
      }
      const booksStore = useBooksStore()
      await booksStore.load()
    },

    getLoanWithDetails(loan) {
      const booksStore = useBooksStore()
      const book = booksStore.books.find(b => b.id === loan.libro_id)
      const user = getMockUserById(loan.usuario_id)
      return { ...loan, book, user }
    }
  }
})
