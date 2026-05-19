## 1. Instalación y registro en `main.js`

Instalá Pinia y el plugin de persistencia (aunque lo usaremos con criterio, no para todo):

```bash
npm install pinia pinia-plugin-persistedstate
```

Configuralo en `main.js`:

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
```

Con esto ya tenés Pinia listo y el plugin de persistencia disponible.

## 2. Store de autenticación (`stores/auth.js`)

Vamos a migrar la lógica que hoy tenés en `useAuth.js` a una store. La clave es que la store será **la fuente única de verdad del estado de autenticación**, sincronizada con Supabase.

Creá `src/stores/auth.js`:

```js
// src/stores/auth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  // ---- STATE ----
  const user = ref(null)          // objeto user de Supabase
  const loading = ref(false)      // para mostrar spinners
  const error = ref(null)         // mensaje de error amigable

  // ---- GETTERS ----
  const isAuthenticated = computed(() => user.value !== null)
  const userEmail = computed(() => user.value?.email ?? '')

  // ---- ACTIONS ----
  async function login(email, password) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    loading.value = false

    if (err) {
      error.value = err.message
      return { success: false, error: err }
    }
    user.value = data.user
    return { success: true, user: data.user }
  }

  async function register(email, password, metadata = {}) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    loading.value = false

    if (err) {
      error.value = err.message
      return { success: false, error: err }
    }
    // Si el registro requiere confirmación de mail, data.user existe pero no hay sesión.
    // Actualizamos user solo si hay sesión (para flujo automático).
    if (data.user && data.session) {
      user.value = data.user
    }
    return { success: true, user: data.user }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  // Sincronizar con el listener de Supabase para mantener el estado reactivo
  function initAuthListener() {
    // Recuperar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      user.value = session?.user ?? null
    })

    // Escuchar cambios (login/logout/refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userEmail,
    login,
    register,
    logout,
    initAuthListener,
  }
}, {
  // Persistencia: guardamos solo el user y no la sesión sensible.
  // Supabase ya maneja cookies/localStorage, así que solo persistimos el objeto user
  // para evitar llamadas innecesarias al cargar la app.
  persist: {
    key: 'auth-store',
    storage: localStorage,
    pick: ['user'], // solo persistir user, no loading/error
  },
})
```

**Puntos importantes:**
- **`initAuthListener()`**: se llamará una sola vez al inicio de la app (por ejemplo, en `App.vue` o en `main.js` antes de montar) para que la store se mantenga sincronizada con los cambios de sesión de Supabase (ej. cuando expira el token y se refresca automáticamente).
- **Persistencia selectiva**: solo guardamos `user` en localStorage. No persistimos la sesión real (eso lo hace Supabase). Esto evita tener que llamar a `getSession` en cada recarga y mantiene el estado reactivo entre F5. Si preferís no persistir nada, simplemente quitá el objeto `persist`.

## 3. Integrar el listener en la app

En `App.vue` o en el punto de entrada, ejecutá `initAuthListener()` una vez. Si querés mantenerlo centralizado, podés hacerlo en `main.js` justo después de crear la app, o en el `App.vue` con `onMounted`.

Ejemplo en `App.vue` (setup):

```vue
<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue' // suponiendo que tengas un NavBar

const auth = useAuthStore()

onMounted(() => {
  auth.initAuthListener()
})
</script>
```

Ahora la store se mantiene actualizada automáticamente.

## 4. Actualizar el guard de rutas

Actualmente tu `router/index.js` seguramente usa una importación de `useAuth` directamente. Con Pinia queda más limpio y sin dependencias circulares.

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  // ... tus rutas con meta.requiresAuth
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirigir al login, opcionalmente con un mensaje
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
```

**Nota:** Como `useAuthStore()` se llama dentro de un guard de navegación, Pinia se asegura de que la store exista (ya fue instalada). No necesitás pasar nada por prop drilling.

## 5. Modificar componentes que consumían `useAuth`

Reemplazá las importaciones de `useAuth` por `useAuthStore` y ajustá el acceso a las propiedades.

Ejemplo en `LoginRegisterView.vue` (actualmente usa `useAuthForm`, que internamente llama a `useAuth`). Lo ideal es que `useAuthForm` siga existiendo como composable local de la vista, pero que en lugar de importar `useAuth`, use la store.

Refactorizá tu `useAuthForm.js`:

```js
// composables/useAuthForm.js
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export function useAuthForm() {
  const authStore = useAuthStore()
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const isLogin = ref(true)
  const errorMessage = ref('')

  async function submit() {
    errorMessage.value = ''
    const result = isLogin.value
      ? await authStore.login(email.value, password.value)
      : await authStore.register(email.value, password.value)

    if (result.success) {
      router.push({ name: 'dashboard' })
    } else {
      errorMessage.value = result.error.message || 'Error desconocido'
    }
  }

  function toggleMode() {
    isLogin.value = !isLogin.value
    errorMessage.value = ''
  }

  return { email, password, isLogin, errorMessage, submit, toggleMode }
}
```

De esta manera tu vista sigue limpia y la lógica de autenticación queda en la store.

En `DashboardView.vue` o `NavBar.vue` simplemente hacés:

```vue
<script setup>
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>

<template>
  <button v-if="auth.isAuthenticated" @click="auth.logout()">Cerrar sesión</button>
  <span v-else>No autenticado</span>
</template>
```

## 6. (Opcional) Store para los datos del dashboard

Si en el futuro querés compartir las `tarjetitas` entre varias vistas o necesitás un estado centralizado para ellas, podés crear otra store (`stores/dashboard.js`). De momento, si solo se usan en `DashboardView`, pueden quedarse como estado local con `ref()`. El criterio es simple: si los datos viajan entre componentes hermanos o aparecen en lugares muy distintos de la app, van a Pinia.

## 7. (Aclaración) ¿Qué pasa con la persistencia del token de Supabase?

El token de sesión y el refresh token **no deben almacenarse en el localStorage de forma explícita** por vos, porque Supabase ya lo hace de forma segura en cookies o localStorage según la configuración de tu cliente. Nuestra store solo persiste `user` (email, id, metadata) para poder mostrar la UI rápido sin esperar la llamada a `getSession`. El guard de autenticación y las llamadas a la API de Supabase seguirán usando la sesión real que maneja el cliente. Esto es seguro y mejora la experiencia de usuario.

---

## Resumen de acciones para tu proyecto

1. Instalá `pinia` y el plugin de persistencia.
2. Crea `stores/auth.js` con la lógica que te di (adaptá nombres si preferís `useAuthStore`).
3. Registrá Pinia en `main.js`.
4. Llamá a `initAuthListener()` en `App.vue` dentro de `onMounted`.
5. Actualizá el router guard para usar `useAuthStore()`.
6. Refactorizá `useAuthForm` para que consuma la store en lugar del viejo composable.
7. Eliminá el composable `useAuth` (o mantenelo comentado hasta que verifiques que todo funciona).
8. Verificá con Vue DevTools: abrí la pestaña Pinia y mirá cómo cambia el estado en tiempo real cuando iniciás sesión, cerrás sesión, etc.

Con esto tenés Pinia integrado exactamente a los casos de uso que ya tiene tu proyecto, y además dejás la base para crecer (favoritos, carrito, configuración de tema) sin prop drilling y con todo el poder de DevTools.
