<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">Catalogo de Libros</h1>
        <p class="page-subtitle">{{ books.length }} libros disponibles</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="catalog-filters">
      <div class="form-group">
        <label class="form-label">Buscar</label>
        <input v-model="filters.search" class="form-input" placeholder="Titulo o autor..." />
      </div>
      <div class="form-group">
        <label class="form-label">Genero</label>
        <select v-model="filters.genre" class="form-select">
          <option value="">Todos</option>
          <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Disponibilidad</label>
        <select v-model="filters.avail" class="form-select">
          <option value="">Todos</option>
          <option value="available">Disponibles</option>
          <option value="unavailable">Sin stock</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-wrapper"><div class="spinner"></div></div>

    <!-- Grid -->
    <div v-else class="grid-books">
      <BookCard
        v-for="book in filteredBooks"
        :key="book.id"
        :book="book"
        @click="modal.open(book)"
      />
      <div v-if="filteredBooks.length === 0" class="empty-state" style="grid-column:1/-1">
        <p>No se encontraron libros</p>
      </div>
    </div>

    <!-- Modal Detalle del Libro -->
    <div v-if="modal.isOpen.value" class="modal-overlay" @click.self="modal.close()">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ modal.data.value.titulo }}</h2>
          <button class="modal-close" @click="modal.close()">x</button>
        </div>
        <div class="modal-body">
          <div style="display:flex;gap:var(--spacing-lg);align-items:flex-start">
            <img
              v-if="modal.data.value.portada"
              :src="modal.data.value.portada"
              :alt="modal.data.value.titulo"
              style="width:120px;border-radius:var(--border-radius);flex-shrink:0"
              @error="e => e.target.style.display='none'"
            />
            <div style="flex:1">
              <p><strong>Autor:</strong> {{ modal.data.value.autor }}</p>
              <p><strong>Genero:</strong> {{ modal.data.value.genero }}</p>
              <p><strong>ISBN:</strong> {{ modal.data.value.isbn }}</p>
              <p class="mt-sm">{{ modal.data.value.descripcion }}</p>
              <p class="mt-sm">
                <span :class="modal.data.value.unidades_disponibles > 0 ? 'badge badge-success' : 'badge badge-danger'">
                  {{ modal.data.value.unidades_disponibles }} / {{ modal.data.value.unidades_totales }} disponibles
                </span>
              </p>
            </div>
          </div>

          <!-- Recomendaciones IA -->
          <div class="mt-lg">
            <div class="flex-between mb-sm">
              <strong>Recomendaciones IA</strong>
              <button class="btn btn-sm btn-secondary" @click="loadRecommendations" :disabled="recoLoading">
                {{ recoLoading ? 'Cargando...' : recommendations.length ? 'Refrescar' : 'Obtener' }}
              </button>
            </div>
            <div v-if="recommendations.length" style="display:flex;flex-direction:column;gap:var(--spacing-sm)">
              <div
                v-for="(rec, i) in recommendations"
                :key="i"
                class="card"
                style="padding:var(--spacing-sm) var(--spacing-md)"
              >
                <div class="font-medium">{{ rec.titulo }}</div>
                <div class="text-sm text-muted">{{ rec.razon }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="modal.close()">Cerrar</button>
          <button
            class="btn btn-primary"
            :disabled="modal.data.value.unidades_disponibles === 0 || borrowing"
            @click="handleBorrow"
          >
            {{ borrowing ? 'Solicitando...' : 'Pedir Prestamo' }}
          </button>
        </div>
        <div v-if="borrowError" class="alert alert-error" style="margin:0 var(--spacing-lg) var(--spacing-md)">{{ borrowError }}</div>
        <div v-if="borrowSuccess" class="alert alert-success" style="margin:0 var(--spacing-lg) var(--spacing-md)">Prestamo registrado!</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useBooksStore } from '../stores/books.js'
import { useLoansStore } from '../stores/loans.js'
import { useRecommendationsStore } from '../stores/recommendations.js'
import { useAuth } from '../composables/useAuth.js'
import { useModal } from '../composables/useModal.js'
import { fetchRules } from '../services/api.js'
import BookCard from '../components/BookCard.vue'

const booksStore = useBooksStore()
const loansStore = useLoansStore()
const recoStore = useRecommendationsStore()
const { user } = useAuth()
const modal = useModal()

const filters = reactive({ search: '', genre: '', avail: '' })
const recommendations = ref([])
const borrowing = ref(false)
const borrowError = ref('')
const borrowSuccess = ref(false)

const books = computed(() => booksStore.books)
const loading = computed(() => booksStore.loading)
const genres = computed(() => booksStore.genres)
const recoLoading = computed(() => recoStore.loading)

const filteredBooks = computed(() => {
  return books.value.filter(b => {
    const matchSearch = !filters.search ||
      b.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
      b.autor.toLowerCase().includes(filters.search.toLowerCase())
    const matchGenre = !filters.genre || b.genero === filters.genre
    const matchAvail = !filters.avail ||
      (filters.avail === 'available' && b.unidades_disponibles > 0) ||
      (filters.avail === 'unavailable' && b.unidades_disponibles === 0)
    return matchSearch && matchGenre && matchAvail
  })
})

onMounted(() => {
  booksStore.load()
  loansStore.load(user.value?.id)
})

async function loadRecommendations() {
  recommendations.value = await recoStore.getRecommendations(modal.data.value)
}

async function handleBorrow() {
  borrowing.value = true
  borrowError.value = ''
  borrowSuccess.value = false
  try {
    const rules = await fetchRules()
    await loansStore.borrow(user.value.id, modal.data.value.id, rules)
    borrowSuccess.value = true
    modal.data.value = books.value.find(b => b.id === modal.data.value.id)
  } catch (e) {
    borrowError.value = e.message
  } finally {
    borrowing.value = false
  }
}
</script>