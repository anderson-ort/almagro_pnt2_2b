import { reactive, computed } from 'vue'
import mockLibros from '../data/mockData.json'

export function useLibros() {
  // Estado reactivo con reactive
  const estado = reactive({
    libros: [...mockLibros],
    filtro: '',
    reservasUsuario: 0,
    MAX_RESERVAS: 3
  })

  // Computed: acceden directamente a estado.propiedad
  const librosFiltrados = computed(() => {
    if (!estado.filtro) return estado.libros

    const termino = estado.filtro.toLowerCase()
    
    return estado.libros.filter(libro =>
      libro.titulo.toLowerCase().includes(termino)
    )
  })

  const maximoAlcanzado = computed(() => 
    estado.reservasUsuario >= estado.MAX_RESERVAS
  )

  function reservar(id) {
    if (estado.reservasUsuario >= estado.MAX_RESERVAS) {
      alert(`Solo puedes reservar hasta ${estado.MAX_RESERVAS} libros.`)
      return
    }

    const libro = estado.libros.find(l => l.id === id)
    if (libro && libro.stock > 0) {
      libro.stock--
      estado.reservasUsuario++
      alert(`Reservaste "${libro.titulo}". Reservas activas: ${estado.reservasUsuario}`)
    }
  }

  return {
    
    librosFiltrados,
    filtro: estado.filtro,
    reservasUsuario: estado.reservasUsuario,
    MAX_RESERVAS: estado.MAX_RESERVAS,
    maximoAlcanzado,
    reservar
  }
}