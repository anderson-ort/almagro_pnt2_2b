import { ref, computed } from 'vue'
import datosLibros from '../data/mockData.json'

export function useLibros() {
    const libros = ref(datosLibros)
    const filtro = ref('')
    const reservasUsuario = ref(0)
    const MAX_RESERVAS = 3

    const librosFiltrados = computed(() => {
        if (!filtro.value) return libros.value
        return libros.value.filter(l =>
            l.titulo.toLowerCase().includes(filtro.value.toLowerCase())
        )
    })

    function reservarLibro(id) {
        if (reservasUsuario.value >= MAX_RESERVAS) return false

        const libro = libros.value.find(l => l.id === id)
        if (libro && libro.stock > 0) {
            libro.stock--
            reservasUsuario.value++
            return true
        }
        return false
    }

    return { filtro, librosFiltrados, reservasUsuario, MAX_RESERVAS, reservarLibro }
}