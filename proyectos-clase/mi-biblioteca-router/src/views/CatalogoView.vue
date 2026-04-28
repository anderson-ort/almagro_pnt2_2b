<template>
  <div class="catalogo-page">
    <h1>Catálogo de Libros</h1>

    <div class="catalogo-header">
      <input
        v-model="filtro"
        placeholder="Buscar por título o autor..."
        class="search-input"
      />
      <div class="reservas-info">
        Mis reservas: {{ reservasUsuario }} / {{ MAX_RESERVAS }}
      </div>
    </div>

    <div v-if="librosFiltrados.length === 0" class="no-results">
      No se encontraron libros con "{{ filtro }}"
    </div>

    <div class="catalogo-grid">
      <LibroCard
        v-for="libro in librosFiltrados"
        :key="libro.id"
        :libro="libro"
        @intentar-reserva="handleReserva"
      >
        <template #etiqueta v-if="libro.stock < 3 && libro.stock > 0">
          <span class="warning">¡Casi agotado!</span>
        </template>
      </LibroCard>
    </div>

    <BaseModal v-if="mostrarLimite" @close="mostrarLimite = false">
      <template #header>
        <h3 style="color: #e74c3c">Límite de reservas alcanzado</h3>
      </template>
      <p>Ya tenés {{ MAX_RESERVAS }} reservas activas. No podés reservar más libros hasta que liberes alguna.</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLibros } from '../composables/useLibros'
import LibroCard from '../components/LibroCard.vue'
import BaseModal from '../components/BaseModal.vue'

const { filtro, librosFiltrados, reservasUsuario, MAX_RESERVAS, reservarLibro } = useLibros()
const mostrarLimite = ref(false)

const handleReserva = (id) => {
  const exito = reservarLibro(id)
  if (!exito && reservasUsuario.value >= MAX_RESERVAS) {
    mostrarLimite.value = true
  }
}
</script>

<style scoped>
.catalogo-page {
  padding: 2rem;
}

.catalogo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  width: 300px;
  max-width: 100%;
}

.reservas-info {
  background: var(--accent-bg);
  color: var(--accent);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
}

.catalogo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--text);
  font-size: 1.2rem;
}

.warning {
  color: #e74c3c;
  font-weight: bold;
  font-size: 0.85rem;
}
</style>
