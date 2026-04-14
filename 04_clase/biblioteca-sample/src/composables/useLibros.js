import { ref, computed } from 'vue'
import mockLibros from '../data/mockData.json'

export function useLibros() {
  // Constantes internas
  const MAX_RESERVAS = 3

  // Estado
  const libros = ref([...mockLibros])
  const filtro = ref('')
  const reservasUsuario = ref(0)

  // Computed
  const librosFiltrados = computed(() => {
    
    if (!filtro.value) return libros.value

    const termino = filtro.value.toLowerCase()

    return libros.value.filter(libro => libro.titulo.toLowerCase().includes(termino))
  })

  const maximoAlcanzado = computed(() => reservasUsuario.value >= MAX_RESERVAS)

  // Métodos
  function reservar(id) {
    if (reservasUsuario.value >= MAX_RESERVAS) {
      alert(`Solo puedes reservar hasta ${MAX_RESERVAS} libros.`)
      return
    }

    const libro = libros.value.find(l => l.id === id)
    if (libro && libro.stock > 0) {
      libro.stock--
      reservasUsuario.value++
      alert(`Reservaste "${libro.titulo}". Reservas activas: ${reservasUsuario.value}`)
    }
  }

  // Exposición pública
  return {
    librosFiltrados,
    filtro,
    reservasUsuario,
    MAX_RESERVAS,
    maximoAlcanzado,
    reservar
  }
}