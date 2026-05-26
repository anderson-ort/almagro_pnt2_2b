import { defineStore } from 'pinia'
import { supabase } from '../services/supabase.js'
import usersData from '../mocks/users.json'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.rol === 'admin',
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
          // Obtener perfil con rol
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
          this.user = { ...data.user, ...profile }
        } else {
          // Mock: buscar por email (contraseña cualquiera)
          const found = usersData.find(u => u.email === email)
          if (!found) throw new Error('Usuario no encontrado')
          this.user = { ...found }
        }
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async register(email, password, nombre) {
      this.loading = true
      this.error = null
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nombre } } })
          if (error) throw error
          this.user = { ...data.user, nombre, rol: 'lector' }
        } else {
          // Mock: crear nuevo usuario
          this.user = { id: `user-${Date.now()}`, email, nombre, rol: 'lector' }
        }
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      if (supabase) await supabase.auth.signOut()
      this.user = null
    },

    async init() {
      if (!supabase) return
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single()
        this.user = { ...data.session.user, ...profile }
      }
    }
  }
})
