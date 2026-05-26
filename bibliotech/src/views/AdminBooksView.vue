<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">Gestion de Libros</h1>
        <p class="page-subtitle">{{ books.length }} libros en catalogo</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ Nuevo Libro</button>
    </div>

    <div v-if="loading" class="loading-wrapper"><div class="spinner"></div></div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Genero</th>
            <th>Unidades</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>
              <div class="font-medium">{{ book.titulo }}</div>
              <div class="text-sm text-muted">{{ book.isbn }}</div>
            </td>
            <td>{{ book.autor }}</td>
            <td><span class="badge badge-muted">{{ book.genero }}</span></td>
            <td>
              <span :class="book.unidades_disponibles > 0 ? 'badge badge-success' : 'badge badge-danger'">
                {{ book.unidades_disponibles }}/{{ book.unidades_totales }}
              </span>
            </td>
            <td>
              <div class="flex gap-sm">
                <button class="btn btn-sm btn-secondary" @click="openEdit(book)">Editar</button>
                <button class="btn btn-sm btn-danger" @click="deleteModal.open(book)">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="formModal.isOpen.value" class="modal-overlay" @click.self="formModal.close()">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ formModal.data.value ? 'Editar Libro' : 'Nuevo Libro' }}</h2>
          <button class="modal-close" @click="formModal.close()">x</button>
        </div>
        <div class="modal-body">
          <BookForm
            :book="formModal.data.value"
            :loading="saving"
            :error="formError"
            @submit="handleSubmit"
            @cancel="formModal.close()"
          />
        </div>
      </div>
    </div>

    <!-- Modal Confirmacion Eliminar -->
    <div v-if="deleteModal.isOpen.value" class="modal-overlay" @click.self="deleteModal.close()">
      <div class="modal" style="max-width:400px">
        <div class="modal-header">
          <h2 class="modal-title">Confirmar eliminacion</h2>
          <button class="modal-close" @click="deleteModal.close()">x</button>
        </div>
        <div class="modal-body">
          <p>Estas seguro que deseas eliminar <strong>{{ deleteModal.data.value.titulo }}</strong>?</p>
          <p class="text-muted text-sm mt-sm">Esta accion no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="deleteModal.close()">Cancelar</button>
          <button class="btn btn-danger" @click="handleDelete" :disabled="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '../stores/books.js'
import { useModal } from '../composables/useModal.js'
import BookForm from '../components/BookForm.vue'

const booksStore = useBooksStore()
const formModal = useModal()
const deleteModal = useModal()

const saving = ref(false)
const deleting = ref(false)
const formError = ref('')

const books = computed(() => booksStore.books)
const loading = computed(() => booksStore.loading)

onMounted(() => booksStore.load())

function openCreate() {
  formModal.open(null)
}

function openEdit(book) {
  formModal.open({ ...book })
}

async function handleSubmit(data) {
  saving.value = true
  formError.value = ''
  try {
    if (formModal.data.value) {
      await booksStore.update(formModal.data.value.id, data)
    } else {
      await booksStore.create(data)
    }
    formModal.close()
  } catch (e) {
    formError.value = e.message
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  deleting.value = true
  try {
    await booksStore.remove(deleteModal.data.value.id)
    deleteModal.close()
  } catch (e) {
    console.error(e)
  } finally {
    deleting.value = false
  }
}
</script>