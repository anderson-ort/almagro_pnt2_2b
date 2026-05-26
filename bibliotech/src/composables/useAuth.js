import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

export function useAuth() {
  const store = useAuthStore()

  const user = computed(() => store.user)
  const isLoggedIn = computed(() => store.isLoggedIn)
  const isAdmin = computed(() => store.isAdmin)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)

  async function login(email, password) {
    return store.login(email, password)
  }

  async function register(email, password, nombre) {
    return store.register(email, password, nombre)
  }

  async function logout() {
    return store.logout()
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout
  }
}