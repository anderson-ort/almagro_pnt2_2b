<template>
  <div class="catalogo">
    <div v-if="showStats" class="catalogo-stats">
      Reservas: {{ reservasUsuario }} / {{ maxReservas }}
    </div>

    <input
      v-if="showFilter"
      v-model="filtro"
      placeholder="Buscar..."
      class="catalogo-filtro-input"
    />

    <p v-if="librosFiltrados.length === 0" class="catalogo-sin-resultados">
      No se encontraron libros con "{{ filtro }}"
    </p>

    <div v-if="mode === 'grid'" class="catalogo-grid">
      <LibroCard
        v-for="l in librosFiltrados"
        :key="l.id"
        :libro="l"
        @intentar-reserva="$emit('reservar', l.id)"
      >
        <template #etiqueta v-if="l.stock < 3 && l.stock > 0">
          <span class="catalogo-warning">¡Casi agotado!</span>
        </template>
      </LibroCard>
    </div>

    <ul v-else class="catalogo-list">
      <li v-for="l in librosFiltrados" :key="l.id">
        <strong>{{ l.titulo }}</strong> - {{ l.autor }}
        <span :class="{ 'catalogo-stock-bajo': l.stock < 3 }">(Stock: {{ l.stock }})</span>
        <button @click="$emit('reservar', l.id)" :disabled="l.stock === 0">Reservar</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useLibros } from '../composables/useLibros'
import LibroCard from './LibroCard.vue'

const { filtro, librosFiltrados } = useLibros()

defineProps({
  mode: { type: String, default: 'grid' },
  showStats: { type: Boolean, default: true },
  showFilter: { type: Boolean, default: true },
  reservasUsuario: { type: Object, required: true },
  maxReservas: { type: Number, required: true }
})

defineEmits(['reservar'])
</script>

<style scoped>
.catalogo-stock-bajo {
  color: #e67e22;
  font-weight: bold;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.catalogo-sin-resultados {
  padding: 1rem;
  background: #fef9e7;
  border-radius: 8px;
  color: #e67e22;
}

.catalogo-filtro-input {
  padding: 8px;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 300px;
}

.catalogo-stats {
  background: #e8f8f5;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.catalogo-warning {
  color: #c0392b;
  font-weight: bold;
  font-size: 0.8rem;
}

.catalogo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.catalogo-list {
  list-style: none;
  padding: 0;
}

.catalogo-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.catalogo-list li span {
  flex-shrink: 0;
}

.catalogo-list li button {
  flex-shrink: 0;
}
</style>