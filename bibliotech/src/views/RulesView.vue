<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">Reglas de la Biblioteca</h1>
        <p class="page-subtitle">Normas y condiciones de prestamo</p>
      </div>
      <button v-if="isAdmin && !editing" class="btn btn-primary" @click="editing = true">
        Editar Reglas
      </button>
    </div>

    <div v-if="loading" class="loading-wrapper"><div class="spinner"></div></div>

    <div v-else>
      <!-- Vista publica -->
      <div v-if="!editing" class="card" style="max-width:600px">
        <div class="card-body">
          <div style="display:grid;gap:var(--spacing-lg)">
            <div class="card" style="background:var(--color-primary-light);border-color:var(--color-primary)">
              <div class="card-body" style="text-align:center">
                <div style="font-size:2.5rem;font-weight:700;color:var(--color-primary)">{{ rules.dias_prestamo }}</div>
                <div class="text-secondary">dias de prestamo por libro</div>
              </div>
            </div>
            <div class="card" style="background:var(--color-success-light);border-color:var(--color-success)">
              <div class="card-body" style="text-align:center">
                <div style="font-size:2.5rem;font-weight:700;color:var(--color-success)">{{ rules.max_libros_simultaneos }}</div>
                <div class="text-secondary">maximo de libros simultaneos</div>
              </div>
            </div>
          </div>
          <p class="text-muted text-sm mt-lg">
            Ultima actualizacion: {{ formatDate(rules.updated_at) }}
          </p>
        </div>
      </div>

      <!-- Formulario de edicion (admin) -->
      <div v-if="editing" class="card" style="max-width:400px">
        <div class="card-header">Editar Reglas</div>
        <div class="card-body">
          <form @submit.prevent="saveRules">
            <div class="form-group">
              <label class="form-label">Dias de prestamo</label>
              <input v-model.number="form.dias_prestamo" type="number" min="1" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Maximo libros simultaneos</label>
              <input v-model.number="form.max_libros_simultaneos" type="number" min="1" class="form-input" required />
            </div>
            <div v-if="saveError" class="alert alert-error">{{ saveError }}</div>
            <div v-if="saveSuccess" class="alert alert-success">Reglas actualizadas!</div>
            <div class="flex gap-sm mt-md">
              <button type="button" class="btn btn-secondary" @click="editing = false">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { fetchRules, updateRules } from '../services/api.js'
import { formatDate } from '../utils/dateHelpers.js'

const { user, isAdmin } = useAuth()
const loading = ref(true)
const editing = ref(false)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)
const rules = ref({ dias_prestamo: 14, max_libros_simultaneos: 3, updated_at: null })
const form = reactive({ dias_prestamo: 14, max_libros_simultaneos: 3 })

onMounted(async () => {
  rules.value = await fetchRules()
  form.dias_prestamo = rules.value.dias_prestamo
  form.max_libros_simultaneos = rules.value.max_libros_simultaneos
  loading.value = false
})

async function saveRules() {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    rules.value = await updateRules({ ...form, updated_by: user.value?.id })
    saveSuccess.value = true
    editing.value = false
  } catch (e) {
    saveError.value = e.message
  } finally {
    saving.value = false
  }
}
</script>