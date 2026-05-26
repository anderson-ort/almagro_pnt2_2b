<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label class="form-label">Título *</label>
      <input v-model="form.titulo" class="form-input" required />
    </div>
    <div class="form-group">
      <label class="form-label">Autor *</label>
      <input v-model="form.autor" class="form-input" required />
    </div>
    <div class="form-group">
      <label class="form-label">ISBN</label>
      <input v-model="form.isbn" class="form-input" />
    </div>
    <div class="form-group">
      <label class="form-label">Género *</label>
      <input v-model="form.genero" class="form-input" required />
    </div>
    <div class="form-group">
      <label class="form-label">Descripción</label>
      <textarea v-model="form.descripcion" class="form-textarea"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">URL Portada</label>
      <input v-model="form.portada" class="form-input" type="url" />
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)">
      <div class="form-group">
        <label class="form-label">Unidades Totales *</label>
        <input v-model.number="form.unidades_totales" class="form-input" type="number" min="1" required />
      </div>
      <div class="form-group">
        <label class="form-label">Unidades Disponibles *</label>
        <input v-model.number="form.unidades_disponibles" class="form-input" type="number" min="0" :max="form.unidades_totales" required />
      </div>
    </div>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <div class="modal-footer" style="padding:0;margin-top:var(--spacing-md)">
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Guardando...' : (book ? 'Actualizar' : 'Crear Libro') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  book: { type: Object, default: null },
  loading: Boolean,
  error: String,
})
const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  titulo: '',
  autor: '',
  isbn: '',
  genero: '',
  descripcion: '',
  portada: '',
  unidades_totales: 1,
  unidades_disponibles: 1,
})

watch(() => props.book, (val) => {
  if (val) Object.assign(form.value, val)
}, { immediate: true })

function handleSubmit() {
  emit('submit', { ...form.value })
}
</script>
