<template>
  <div class="card">
    <h3>{{ libro.titulo }}</h3>
    <p>Autor: {{ libro.autor }}</p>

    <slot name="etiqueta"></slot>

    <RouterLink :to="`/libro/${libro.id}`" class="details-link">
      Ver Detalles
    </RouterLink>
    <button @click="$emit('intentar-reserva', libro.id)" :disabled="libro.stock === 0">
      {{ libro.stock > 0 ? 'Reservar' : 'Sin Stock' }}
    </button>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  libro: { type: Object, required: true }
})
defineEmits(['intentar-reserva'])
</script>

<style scoped>
.card {
  border: 1px solid var(--border);
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 8px;
  background: var(--bg);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: var(--shadow);
}

.card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--text-h);
}

.card p {
  color: var(--text);
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.details-link {
  display: inline-block;
  margin-bottom: 0.5rem;
  color: var(--accent);
  text-decoration: none;
  font-size: 0.9rem;
}

.details-link:hover {
  text-decoration: underline;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
