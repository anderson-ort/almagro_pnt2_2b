<template>
  <div class="card book-card" @click="$emit('click', book)">
    <img
      v-if="book.portada"
      :src="book.portada"
      :alt="book.titulo"
      class="book-cover"
      @error="imgError = true"
    />
    <div v-if="!book.portada || imgError" class="book-cover-placeholder">-</div>

    <div class="book-info">
      <div class="book-title">{{ book.titulo }}</div>
      <div class="book-author">{{ book.autor }}</div>
      <div class="book-meta">
        <span class="badge badge-muted">{{ book.genero }}</span>
        <span
          :class="book.unidades_disponibles > 0 ? 'badge badge-success' : 'badge badge-danger'"
        >
          {{ book.unidades_disponibles > 0 ? `${book.unidades_disponibles} disp.` : 'Sin stock' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ book: Object })
defineEmits(['click'])
const imgError = ref(false)
</script>
