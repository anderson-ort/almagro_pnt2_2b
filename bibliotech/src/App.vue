<template>
  <div class="app-layout">
    <!-- Navbar (solo cuando el usuario está logueado) -->
    <nav v-if="authStore.isLoggedIn" class="navbar">
      <RouterLink to="/catalogo" class="navbar-brand">BiblioTech</RouterLink>

      <ul class="navbar-links">
        <li><RouterLink to="/catalogo">Catálogo</RouterLink></li>
        <li><RouterLink to="/mis-prestamos">Mis Préstamos</RouterLink></li>
        <li><RouterLink to="/reglas">Reglas</RouterLink></li>
        <li v-if="authStore.isAdmin"><RouterLink to="/admin/libros">Admin Libros</RouterLink></li>
        <li v-if="authStore.isAdmin"><RouterLink to="/admin/metricas">Métricas</RouterLink></li>
      </ul>

      <div class="navbar-user">
        <span>{{ authStore.user?.nombre }}</span>
        <span class="badge" :class="authStore.isAdmin ? 'badge-warning' : 'badge-muted'">
          {{ authStore.isAdmin ? 'Admin' : 'Lector' }}
        </span>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white" @click="logout">
          Salir
        </button>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Chat IA flotante -->
    <AIChat />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import AIChat from './components/AIChat.vue'

const authStore = useAuthStore()
const router = useRouter()

// Inicializar sesión si hay una guardada (Supabase)
authStore.init()

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>
