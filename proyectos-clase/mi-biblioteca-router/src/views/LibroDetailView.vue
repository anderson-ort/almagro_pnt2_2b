<template>
  <div class="libro-detail">
    <div v-if="libro">
      <router-link to="/catalogo" class="back-link">← Volver al catálogo</router-link>

      <div class="libro-content">
        <div class="libro-header">
          <h1>{{ libro.titulo }}</h1>
          <p class="autor">Por {{ libro.autor }}</p>
        </div>

        <div class="libro-body">
          <div class="libro-info">
            <div class="stock-info">
              <span class="stock-label">Stock disponible:</span>
              <span :class="['stock-value', { 'low': libro.stock <= 3 }]">
                {{ libro.stock }}
              </span>
            </div>

            <button
              @click="reservar"
              :disabled="libro.stock === 0 || reservasUsuario >= MAX_RESERVAS"
              class="reserve-btn"
            >
              {{ libro.stock > 0 ? 'Reservar este libro' : 'Sin stock' }}
            </button>

            <div v-if="reservasUsuario >= MAX_RESERVAS" class="limit-warning">
              Ya tenés {{ MAX_RESERVAS }} reservas activas
            </div>
          </div>

          <div class="libro-description">
            <h3>Sinopsis</h3>
            <p>{{ libro.summaryDescription }}</p>

            <h3>Descripción completa</h3>
            <p>{{ libro.description }}</p>
          </div>
        </div>
      </div>

      <BaseModal v-if="mostrarExito" @close="mostrarExito = false">
        <template #header>
          <h3 style="color: #27ae60">¡Reserva exitosa!</h3>
        </template>
        <p>Has reservado "{{ libro.titulo }}" correctamente.</p>
      </BaseModal>

      <BaseModal v-if="mostrarError" @close="mostrarError = false">
        <template #header>
          <h3 style="color: #e74c3c">No se pudo reservar</h3>
        </template>
        <p v-if="libro.stock === 0">Este libro no tiene stock disponible.</p>
        <p v-else>Ya alcanzaste el límite de {{ MAX_RESERVAS }} reservas.</p>
      </BaseModal>
    </div>

    <div v-else class="not-found">
      <h2>Libro no encontrado</h2>
      <p>El libro que estás buscando no existe.</p>
      <router-link to="/catalogo">Volver al catálogo</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLibros } from '../composables/useLibros'
import BaseModal from '../components/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const { getLibroPorId, reservarLibro, reservasUsuario, MAX_RESERVAS } = useLibros()

const libro = computed(() => getLibroPorId(route.params.id))
const mostrarExito = ref(false)
const mostrarError = ref(false)

const reservar = () => {
  if (!libro.value) return

  const exito = reservarLibro(libro.value.id)
  if (exito) {
    mostrarExito.value = true
  } else {
    mostrarError.value = true
  }
}
</script>

<style scoped>
.libro-detail {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  color: var(--accent);
  text-decoration: none;
  margin-bottom: 1.5rem;
}

.back-link:hover {
  text-decoration: underline;
}

.libro-header {
  margin-bottom: 2rem;
}

.libro-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.autor {
  color: var(--text);
  font-size: 1.2rem;
}

.libro-body {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  text-align: left;
}

.libro-info {
  background: var(--code-bg);
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.stock-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.stock-label {
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.stock-value {
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
}

.stock-value.low {
  color: #e74c3c;
}

.reserve-btn {
  width: 100%;
  padding: 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
}

.reserve-btn:disabled {
  background: var(--border);
  cursor: not-allowed;
}

.reserve-btn:not(:disabled):hover {
  opacity: 0.9;
}

.limit-warning {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef9e7;
  color: #e67e22;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
}

.libro-description h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}

.libro-description p {
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found a {
  color: var(--accent);
  text-decoration: none;
}
</style>
