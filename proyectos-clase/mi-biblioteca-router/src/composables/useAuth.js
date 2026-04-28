import { ref, watch } from 'vue'

// Module-level singleton state - shared across all imports
const token = ref(localStorage.getItem('token') || null)
const usuario = ref(localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null)

// Watch for changes and sync to localStorage automatically
watch(token, (newValue) => {
    if (newValue) {
        localStorage.setItem('token', newValue)
    } else {
        localStorage.removeItem('token')
    }
})

watch(usuario, (newValue) => {
    if (newValue) {
        localStorage.setItem('usuario', JSON.stringify(newValue))
    } else {
        localStorage.removeItem('usuario')
    }
})

export function useAuth() {
    function login(credenciales) {
        const usuariosValidos = [
            { email: 'admin@biblioteca.com', password: 'admin123', rol: 'admin' },
            { email: 'user@biblioteca.com', password: 'user123', rol: 'user' }
        ]

        const usuarioEncontrado = usuariosValidos.find(
            u => u.email === credenciales.email && u.password === credenciales.password
        )

        if (usuarioEncontrado) {
            const tokenGenerado = 'token_' + Date.now()
            token.value = tokenGenerado
            usuario.value = { email: usuarioEncontrado.email, rol: usuarioEncontrado.rol }
            return { success: true, usuario: usuario.value }
        }

        return { success: false, error: 'Credenciales inválidas' }
    }

    function register(datos) {
        if (!datos.email || !datos.password) {
            return { success: false, error: 'Email y password son obligatorios' }
        }

        const tokenGenerado = 'token_' + Date.now()
        token.value = tokenGenerado
        usuario.value = { email: datos.email, rol: 'user' }
        return { success: true, usuario: usuario.value }
    }

    function logout() {
        token.value = null
        usuario.value = null
    }

    function isAuthenticated() {
        return token.value !== null
    }

    function isAdmin() {
        return usuario.value && usuario.value.rol === 'admin'
    }

    return {
        token,
        usuario,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin
    }
}
