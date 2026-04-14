<template>
  <div>
    <h2>Catalogo de libros</h2>

    <div class="reservas-info">
      <p>Tus reservas: <strong>{{ reservasUsuario }}</strong> / {{ MAX_RESERVAS }}</p>
      <p v-if="maximoAlcanzado" class="max-alert">
        Llegaste al maximo de reservas
      </p>
    </div>

    <input 
      type="text" 
      v-model="filtro" 
      placeholder="Buscar por titulo..." 
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
// que es un composable y, cuando conviene usarlo?
// import { useLibros } from '../composables/useLibros'
import { useLibros } from '../composables/useLibrosReactive'

const {
  librosFiltrados,
  filtro,
  reservasUsuario,
  MAX_RESERVAS,
  maximoAlcanzado,
  reservar
} = useLibros()
</script>

<style scope>  
@import './Catalogo.css';
</style>