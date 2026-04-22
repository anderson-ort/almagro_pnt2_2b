<template>
  <main>
    <h1>Biblioteca Digital</h1>

    <CatalogoLibros mode="grid" :reservasUsuario="reservasUsuario" :maxReservas="MAX_RESERVAS" @reservar="handleReserva" />

    <BaseModal v-if="mostrarError" @close="mostrarError = false">
      <template #header>
        <h3 style="color: red">¡Límite alcanzado!</h3>
      </template>
      <p>Ya tenés {{ MAX_RESERVAS }} reservas activas. Dejá algo para el resto, estimado.</p>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import CatalogoLibros from './components/CatalogoLibros.vue'
import BaseModal from './components/BaseModal.vue'
import { useLibros } from './composables/useLibros'

const { reservasUsuario, MAX_RESERVAS, reservarLibro } = useLibros()
const mostrarError = ref(false)

const handleReserva = (id) => {
  const exito = reservarLibro(id)
  if (!exito && reservasUsuario.value >= MAX_RESERVAS) {
    mostrarError.value = true
  }
}
</script>