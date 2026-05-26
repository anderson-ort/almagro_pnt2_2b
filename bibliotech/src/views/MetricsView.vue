<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Metricas</h1>
      <p class="page-subtitle">Estadisticas generales de la biblioteca</p>
    </div>

    <div v-if="loading" class="loading-wrapper"><div class="spinner"></div></div>

    <div v-else>
      <!-- Tarjetas de metricas -->
      <div class="metrics-grid">
        <div class="card metric-card">
          <div class="metric-value">{{ totalLoans }}</div>
          <div class="metric-label">Total prestamos</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value">{{ activeLoans }}</div>
          <div class="metric-label">Prestamos activos</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value" style="color:var(--color-danger)">{{ overdueLoans }}</div>
          <div class="metric-label">Prestamos vencidos</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value" style="color:var(--color-success)">{{ returnedLoans }}</div>
          <div class="metric-label">Libros devueltos</div>
        </div>
      </div>

      <!-- Prestamos por usuario -->
      <div class="card mb-lg">
        <div class="card-header">Prestamos por usuario</div>
        <div class="card-body">
          <div v-for="(count, userId) in loansByUser" :key="userId" style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-color)">
            <span>{{ getUserName(userId) }}</span>
            <span class="badge badge-muted">{{ count }} prestamos</span>
          </div>
        </div>
      </div>

      <!-- Historial completo -->
      <div class="card">
        <div class="card-header">Historial completo de prestamos</div>
        <div class="card-body" style="padding:0">
          <LoanTable
            :loans="allLoans"
            :books="books"
            :users="mockUsers"
            :show-user="true"
            :show-actions="true"
            @return="handleReturn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLoansStore } from '../stores/loans.js'
import { useBooksStore } from '../stores/books.js'
import { getMockUsers } from '../services/api.js'
import LoanTable from '../components/LoanTable.vue'

const loansStore = useLoansStore()
const booksStore = useBooksStore()
const loading = ref(true)
const mockUsers = getMockUsers()

const allLoans = computed(() => loansStore.loans)
const books = computed(() => booksStore.books)
const totalLoans = computed(() => loansStore.loans.length)
const activeLoans = computed(() => loansStore.loans.filter(l => l.estado === 'activo').length)
const overdueLoans = computed(() => loansStore.loans.filter(l => l.estado === 'vencido').length)
const returnedLoans = computed(() => loansStore.loans.filter(l => l.estado === 'devuelto').length)

const loansByUser = computed(() => {
  return loansStore.loans.reduce((acc, l) => {
    acc[l.usuario_id] = (acc[l.usuario_id] || 0) + 1
    return acc
  }, {})
})

function getUserName(id) {
  return mockUsers.find(u => u.id === id)?.nombre || id
}

onMounted(async () => {
  await Promise.all([booksStore.load(), loansStore.load()])
  loading.value = false
})

async function handleReturn(loan) {
  await loansStore.returnBook(loan.id, loan.libro_id)
}
</script>