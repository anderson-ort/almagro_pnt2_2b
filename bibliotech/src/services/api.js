// Capa de abstracción: usa mocks o Supabase según configuración
import { supabase } from './supabase.js'
import booksData from '../mocks/books.json'
import loansData from '../mocks/loans.json'
import usersData from '../mocks/users.json'

const USE_MOCK = !supabase

// --- Estado local de mocks (simula persistencia en sesión) ---
let mockBooks = [...booksData]
let mockLoans = [...loansData]
const mockRules = { id: 'rules-1', dias_prestamo: 14, max_libros_simultaneos: 3, updated_at: new Date().toISOString(), updated_by: null }

// ==================== BOOKS ====================
export async function fetchBooks() {
  if (USE_MOCK) return [...mockBooks]
  const { data, error } = await supabase.from('libros').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createBook(book) {
  if (USE_MOCK) {
    const newBook = { ...book, id: `book-${Date.now()}`, created_at: new Date().toISOString() }
    mockBooks.push(newBook)
    return newBook
  }
  const { data, error } = await supabase.from('libros').insert(book).select().single()
  if (error) throw error
  return data
}

export async function updateBook(id, updates) {
  if (USE_MOCK) {
    mockBooks = mockBooks.map(b => b.id === id ? { ...b, ...updates } : b)
    return mockBooks.find(b => b.id === id)
  }
  const { data, error } = await supabase.from('libros').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteBook(id) {
  if (USE_MOCK) {
    mockBooks = mockBooks.filter(b => b.id !== id)
    return true
  }
  const { error } = await supabase.from('libros').delete().eq('id', id)
  if (error) throw error
  return true
}

// ==================== LOANS ====================
export async function fetchLoans(userId = null) {
  if (USE_MOCK) {
    return userId ? mockLoans.filter(l => l.usuario_id === userId) : [...mockLoans]
  }
  let query = supabase.from('prestamos').select('*, libros(*), users(*)').order('created_at', { ascending: false })
  if (userId) query = query.eq('usuario_id', userId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createLoan(loan) {
  if (USE_MOCK) {
    const newLoan = { ...loan, id: `loan-${Date.now()}`, created_at: new Date().toISOString() }
    mockLoans.push(newLoan)
    // Actualizar unidades disponibles
    mockBooks = mockBooks.map(b => b.id === loan.libro_id ? { ...b, unidades_disponibles: b.unidades_disponibles - 1 } : b)
    return newLoan
  }
  const { data, error } = await supabase.from('prestamos').insert(loan).select().single()
  if (error) throw error
  return data
}

export async function returnLoan(loanId, libroId) {
  if (USE_MOCK) {
    mockLoans = mockLoans.map(l => l.id === loanId
      ? { ...l, estado: 'devuelto', fecha_devolucion_real: new Date().toISOString() }
      : l)
    mockBooks = mockBooks.map(b => b.id === libroId ? { ...b, unidades_disponibles: b.unidades_disponibles + 1 } : b)
    return true
  }
  const { error } = await supabase.from('prestamos').update({
    estado: 'devuelto',
    fecha_devolucion_real: new Date().toISOString()
  }).eq('id', loanId)
  if (error) throw error
  return true
}

// ==================== RULES ====================
export async function fetchRules() {
  if (USE_MOCK) return { ...mockRules }
  const { data, error } = await supabase.from('reglas').select('*').single()
  if (error) throw error
  return data
}

export async function updateRules(updates) {
  if (USE_MOCK) {
    Object.assign(mockRules, updates, { updated_at: new Date().toISOString() })
    return { ...mockRules }
  }
  const { data, error } = await supabase.from('reglas').update(updates).eq('id', mockRules.id).select().single()
  if (error) throw error
  return data
}

// ==================== USERS (solo mock) ====================
export function getMockUsers() {
  return [...usersData]
}

export function getMockUserById(id) {
  return usersData.find(u => u.id === id)
}
