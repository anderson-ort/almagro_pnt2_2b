<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>

  <nav>

    <RouterLink to="/">
      Home
    </RouterLink>

    <RouterLink to="/login">
      Login-Register
    </RouterLink>

    <!-- deshabilitado si NO esta autenticado -->
    <RouterLink
      to="/dashboard"
      :class="{ disabled: !isAuthenticated }"
      :tabindex="!isAuthenticated ? -1 : 0"
      @click.prevent="!isAuthenticated"
    >
      Dashboard
    </RouterLink>

    <RouterLink to="/about-us">
      AboutUs
    </RouterLink>

  </nav>

  <RouterView />

</template>

<style scoped>

nav {
  display: flex;
  gap: 1.5rem;

  padding: 1rem 2rem;

  background: #111827;

  border-bottom: 1px solid #1f2937;
}

nav a {
  text-decoration: none;

  color: #d1d5db;

  font-weight: 500;

  transition: 0.2s ease;
}

nav a:hover {
  opacity: 0.8;
}

/* RouterLink activo */
.active-link {
  color: #f59e0b;
}

/* Ruta exacta */
.exact-active-link {
  color: #f59e0b;
  font-weight: bold;
}

/* disabled */
.disabled {
  opacity: 0.4;

  pointer-events: none;

  cursor: not-allowed;
}

</style>