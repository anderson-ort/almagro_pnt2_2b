<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Mis Prestamos</h1>
      <p class="page-subtitle">Historial de tus prestamos</p>
    </div>

    <div v-if="loading" class="loading-wrapper"><div class="spinner"></div></div>

    <div v-else>
      <!-- Activos y vencidos -->
      <div v-if="activeLoans.length" class="mb-lg">
        <h2 style="font-size:var(--font-size-lg);margin-bottom:var(--spacing-md)">Prestamos activos</h2>
        <LoanTable
          :loans="activeLoans"
          :books="books"
          :users="[]"
          :show-user="false"
          :show-actions="true"
          @return="handleReturn"
        />
      </div>

      <div v-if="returnedLoans.length">
        <h2 style="font-size:var(--font-size-lg);margin-bottom:var(--spacing-md)">Historial devueltos</h2>
        <LoanTable
          :loans="returnedLoans"
          :books="books"
          :users="[]"
          :show-user="false"
          :show-actions="false"
        />
      </div>

      <div v-if="!loans.length" class="empty-state">
        <p>Aun no tienes prestamos</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLoansStore } from '../stores/loans.js'
import { useBooksStore } from '../stores/books.js'
import { useAuth } from '../composables/useAuth.js'
import LoanTable from '../components/LoanTable.vue'

const loansStore = useLoansStore()
const booksStore = useBooksStore()
const { user } = useAuth()

const loans = computed(() => loansStore.loans)
const loading = computed(() => loansStore.loading)
const books = computed(() => booksStore.books)
const activeLoans = computed(() => loans.value.filter(l => l.estado !== 'devuelto'))
const returnedLoans = computed(() => loans.value.filter(l => l.estado === 'devuelto'))

onMounted(() => {
  booksStore.load()
  loansStore.load(user.value?.id)
})

async function handleReturn(loan) {
  await loansStore.returnBook(loan.id, loan.libro_id)
}
</script>