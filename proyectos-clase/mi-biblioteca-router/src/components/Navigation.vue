<template>
  <nav>
    <RouterLink to="/">Inicio</RouterLink>
    <RouterLink to="/catalogo">Catálogo</RouterLink>

    <div class="auth-section">
      <template v-if="isAuth">
        <RouterLink v-if="isAdmin" to="/admin" class="admin-link">
          Admin
        </RouterLink>
        <span class="user-greeting">
          Hola, {{ usuario?.email }}
        </span>
        <button @click="handleLogout" class="logout-btn">
          Cerrar Sesión
        </button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="nav-link">
          Iniciar Sesión
        </RouterLink>
        <RouterLink to="/register" class="nav-link">
          Registrarse
        </RouterLink>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { token, usuario, isAuthenticated, isAdmin: isAdminFn, logout } = useAuth()

const isAuth = computed(() => isAuthenticated())
const isAdmin = computed(() => isAdminFn())

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  align-items: center;
}

nav a {
  color: var(--text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background: var(--code-bg);
}

nav a.RouterLink-active {
  background: var(--accent-bg);
  color: var(--accent);
}

.auth-section {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  background: var(--code-bg);
  color: var(--text-h);
}

.nav-link:hover {
  background: var(--accent-bg);
}

.admin-link {
  font-weight: bold;
  color: var(--accent);
  border: 1px solid var(--accent);
}

.admin-link:hover {
  background: var(--accent-bg);
}

.user-greeting {
  color: var(--text);
  font-size: 0.9rem;
}

.logout-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: var(--code-bg);
}
</style>
