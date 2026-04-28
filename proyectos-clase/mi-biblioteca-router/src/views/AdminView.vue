<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1>Panel de Administración</h1>
      <div class="user-info">
        <span>{{ usuario?.email }}</span>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </div>

    <div class="admin-content">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total de Libros</h3>
          <p class="stat-number">{{ libros.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Libros con Stock Bajo</h3>
          <p class="stat-number warning">{{ librosBajoStock }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Reservas</h3>
          <p class="stat-number">{{ totalReservas }}</p>
        </div>
      </div>

      <div class="admin-section">
        <h2>Gestión de Libros</h2>
        <table class="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="libro in libros" :key="libro.id">
              <td>{{ libro.id }}</td>
              <td>{{ libro.titulo }}</td>
              <td>{{ libro.autor }}</td>
              <td>
                <span :class="['stock-badge', { low: libro.stock <= 3 }]">
                  {{ libro.stock }}
                </span>
              </td>
              <td>
                <span v-if="libro.stock === 0" class="status out-of-stock">Sin stock</span>
                <span v-else-if="libro.stock <= 3" class="status low-stock">Stock bajo</span>
                <span v-else class="status in-stock">Disponible</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="admin-section">
        <h2>Reservas Activas de Usuarios</h2>
        <p class="info-text">
          Cada usuario puede tener hasta {{ MAX_RESERVAS }} reservas simultáneas.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLibros } from '../composables/useLibros'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { libros, reservasUsuario, MAX_RESERVAS } = useLibros()
const { usuario, isAdmin, logout: authLogout } = useAuth()

const logout = () => {
  authLogout()
  router.push('/')
}

if (!isAdmin()) {
  router.push('/')
}

const librosBajoStock = computed(() => {
  return libros.value.filter(l => l.stock <= 3).length
})

const totalReservas = computed(() => {
  return reservasUsuario.value
})
</script>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-header h1 {
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: var(--code-bg);
}

.admin-content {
  text-align: left;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--code-bg);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--accent);
  margin: 0;
}

.stat-number.warning {
  color: #e74c3c;
}

.admin-section {
  margin-bottom: 2rem;
}

.admin-section h2 {
  margin-bottom: 1rem;
}

.books-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.books-table th,
.books-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.books-table th {
  background: var(--code-bg);
  font-weight: 600;
}

.stock-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
}

.stock-badge.low {
  background: #fef9e7;
  color: #e67e22;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.status.in-stock {
  background: #d5f4e6;
  color: #27ae60;
}

.status.low-stock {
  background: #fef9e7;
  color: #e67e22;
}

.status.out-of-stock {
  background: #fee;
  color: #e74c3c;
}

.info-text {
  color: var(--text);
  font-style: italic;
}
</style>
