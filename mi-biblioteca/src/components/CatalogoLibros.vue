<template>
  <div>
    <div class="reservas-info">
      <p>Tus reservas: <strong>{{ reservasUsuario }}</strong> / {{ MAX_RESERVAS }}</p>
      <p v-if="reservasUsuario === MAX_RESERVAS" class="max-alert">
        ¡Llegaste al máximo de reservas!
      </p>
    </div>

    <input
      type="text"
      v-model="filtro"
      placeholder="Buscar por título..."
      class="filtro-input"
    />

    <p v-if="librosFiltrados.length === 0" class="sin-resultados">
      No se encontraron libros con "{{ filtro }}"
    </p>
    <ul v-else>
      <li v-for="libro in librosFiltrados" :key="libro.id">
        <strong>{{ libro.titulo }}</strong> - {{ libro.autor }}
        <span :class="{ 'stock-bajo': libro.stock < 3 }">
          (Stock: {{ libro.stock }})
        </span>
        <button @click="reservar(libro.id)" :disabled="libro.stock === 0">
          Reservar
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import datosLibros from '../data/mockData.json'

const libros = ref(datosLibros)
const filtro = ref('')
const reservasUsuario = ref(0)
const MAX_RESERVAS = 3

const librosFiltrados = computed(() => {
  if (!filtro.value) return libros.value
  const termino = filtro.value.toLowerCase()
  return libros.value.filter(libro =>
    libro.titulo.toLowerCase().includes(termino)
  )
})

function reservar(id) {
  if (reservasUsuario.value >= MAX_RESERVAS) {
    alert(`Solo puedes reservar hasta ${MAX_RESERVAS} libros.`)
    return
  }

  const libro = libros.value.find(l => l.id === id)
  if (libro && libro.stock > 0) {
    libro.stock--
    reservasUsuario.value++
    alert(`Reservaste "${libro.titulo}". Reservas activas: ${reservasUsuario.value}`)
  }
}
</script>

<style scoped>
.stock-bajo {
  color: #e67e22;
  font-weight: bold;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sin-resultados {
  padding: 1rem;
  background: #fef9e7;
  border-radius: 8px;
  color: #e67e22;
}

.filtro-input {
  padding: 8px;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 300px;
}

.reservas-info {
  background: #e8f8f5;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.max-alert {
  color: #c0392b;
  font-weight: bold;
}
</style>