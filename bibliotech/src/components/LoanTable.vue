<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Libro</th>
          <th v-if="showUser">Usuario</th>
          <th>Préstamo</th>
          <th>Devolución esperada</th>
          <th>Estado</th>
          <th v-if="showActions">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loans.length === 0">
          <td :colspan="showUser ? 6 : 5" class="text-center text-muted" style="padding:var(--spacing-xl)">
            No hay préstamos
          </td>
        </tr>
        <tr v-for="loan in loans" :key="loan.id">
          <td>
            <div class="font-medium">{{ getBookTitle(loan.libro_id) }}</div>
          </td>
          <td v-if="showUser">
            <div class="text-sm">{{ getUserName(loan.usuario_id) }}</div>
          </td>
          <td>{{ formatDate(loan.fecha_prestamo) }}</td>
          <td>{{ formatDate(loan.fecha_devolucion_esperada) }}</td>
          <td>
            <span :class="statusBadge(loan.estado)">{{ loan.estado }}</span>
          </td>
          <td v-if="showActions">
            <button
              v-if="loan.estado === 'activo' || loan.estado === 'vencido'"
              class="btn btn-sm btn-secondary"
              @click="$emit('return', loan)"
            >
              Devolver
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatDate } from '../utils/dateHelpers.js'

const props = defineProps({
  loans: { type: Array, default: () => [] },
  books: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
  showUser: { type: Boolean, default: false },
  showActions: { type: Boolean, default: true },
})
defineEmits(['return'])

function getBookTitle(id) {
  return props.books.find(b => b.id === id)?.titulo || id
}

function getUserName(id) {
  return props.users.find(u => u.id === id)?.nombre || id
}

function statusBadge(estado) {
  const map = { activo: 'badge badge-success', devuelto: 'badge badge-muted', vencido: 'badge badge-danger' }
  return map[estado] || 'badge'
}
</script>
