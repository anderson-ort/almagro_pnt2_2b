# Clase 5 — Consumo de API y Autenticación con Supabase
**Calendario:** Consumo de APIs, autenticación real con Supabase (BaaS) y manejo de estado de sesión

> **Tipo:** Práctica técnica + Integración backend · **Duración:** ~90 min  
> **Prerequisitos:** Clases 1–4 completadas, proyecto con router y Pinia funcionando, cuenta en Supabase

---

## Guía para el Docente

### Objetivo de la clase
Que los estudiantes consuman una API REST real, manejen autenticación con tokens, y conecten un backend como servicio (Supabase) sin escribir código de servidor. Al terminar, tienen login/signup funcional con persistencia de sesión y datos reales renderizados desde una base de datos.

### Flujo sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0–10 min | Motivación: mostrar el flujo actual con datos hardcodeados vs. datos reales. La diferencia entre mock data y una API: el dato que mostrás hoy puede no existir mañana, y eso cambia todo el código. |
| 10–22 min | Conceptos de API REST: GET, POST, PUT, DELETE. Headers, status codes, JSON. Mostrar una request en vivo con fetch en la consola del browser. |
| 22–35 min | Crear proyecto en Supabase. Configurar tabla `productos`. Generar anon key. Mostrar la interfaz de Supabase como "el backend que no tenés que programar". |
| 35–50 min | Instalar `@supabase/supabase-js`. Crear `src/lib/supabase.js`. Consumir la tabla con `.from('productos').select()` en vivo. |
| 50–65 min | Actividad práctica primera parte: refactorizar el catálogo para usar datos reales (ejercicio 1). |
| 65–78 min | Auth con Supabase: `signUp`, `signInWithPassword`, `signOut`. Crear `useAuth.js` composable. Integrar con la store de usuario de clase 4. |
| 78–85 min | Actividad práctica segunda parte: login y signup funcional (ejercicio 2 y 3). |
| 85–90 min | PR: `feat/api-auth-supabase`. Discusión: manejo de errores y experiencia de usuario. |

### Tips para el docente
- **No asumir que todos entienden HTTP.** Dedicar 5 minutos sólidos a GET vs POST con ejemplos concretos antes de tocar código.
- Supabase tiene mucha magia bajo el capó. Mostrar la pestaña de "Table Editor" y la de "Authentication" para que vean que hay una UI administrando todo eso.
- El error más común: olvidar el `await` en las llamadas a Supabase. El código no falla, simplemente devuelve una Promise sin resolver y el estudiante no entiende por qué `data` es `undefined`.
- La integración entre el composable `useAuth` y la store de Pinia cierra conceptos de dos clases anteriores. Reforzar esa conexión explícitamente.
- **Variables de entorno:** este es el momento de introducir `.env` — la anon key de Supabase no es un secreto crítico, pero es buen momento para practicar el patrón.

### Conceptos clave para reforzar
- **Asincronía**: `async/await` es esencial para consumir APIs. Reforzar que cada llamada a Supabase retorna una Promise.
- **Estado de carga y error**: toda petición HTTP puede fallar o tardar. El patrón `{ data, cargando, error }` debe ser consistente en toda la app.
- **Tokens de autenticación**: el JWT que Supabase retorna va en el header `Authorization` de cada request autenticado — Supabase lo maneja automáticamente, pero entender el concepto es clave.
- La diferencia entre **autenticación** (quién sos) y **autorización** (qué podés hacer): Supabase maneja auth, pero las Row Level Security policies manejan authz.

---

## Ejercicios / Actividades

### Ejercicio 1 — Configurar Supabase y consumir datos (25 min, individual)

**Paso 1:** Crear cuenta en [supabase.com](https://supabase.com) y nuevo proyecto.

**Paso 2:** Crear tabla `productos`:
```sql
create table productos (
  id bigint primary key generated always as identity,
  nombre text not null,
  precio numeric not null,
  imagen text,
  stock int default 0,
  created_at timestamptz default now()
);

-- Insertar datos de prueba
insert into productos (nombre, precio, stock, imagen) values
  ('Teclado Mecánico', 12000, 5, '/img/teclado.jpg'),
  ('Mouse Inalámbrico', 8500, 0, '/img/mouse.jpg'),
  ('Monitor 24"', 85000, 2, '/img/monitor.jpg'),
  ('Auriculares', 6000, 10, '/img/auriculares.jpg');
```

**Paso 3:** Copiar la anon key y la URL del proyecto desde Settings → API.

**Paso 4:** Instalar el cliente:
```bash
npm install @supabase/supabase-js
```

**Paso 5:** Crear `src/lib/supabase.js` con la configuración.

**Paso 6:** Refactorizar `CatalogoView.vue` para cargar productos desde Supabase en lugar del array hardcodeado. Mostrar estados de carga y error.

---

### Ejercicio 2 — Composable useAuth (20 min, individual)

Crear `src/composables/useAuth.js` que encapsule:
- `registro(email, password)` → `supabase.auth.signUp()`
- `login(email, password)` → `supabase.auth.signInWithPassword()`
- `logout()` → `supabase.auth.signOut()`
- `usuario` (ref reactivo con el usuario actual)

El composable debe:
- Manejar errores y retornar `{ data, error }` consistentemente
- Actualizar la store de Pinia al hacer login/logout
- Verificar la sesión al cargar la app con `supabase.auth.getSession()`

---

### Ejercicio 3 — Vistas de Login y Signup (18 min, individual)

Crear `LoginView.vue` y `SignupView.vue` con formularios funcionales.

**Requisitos:**
- Validación básica: email válido, password mínimo 6 caracteres
- Mostrar errores de Supabase en español (traducir los mensajes)
- Redirección automática al `/catalogo` tras login exitoso
- Link entre login y signup para cambiar de vista

**Bonus:** usar el composable `useFormulario.js` de clase 2 si lo tienen implementado.

---

### Ejercicio 4 — Protección de rutas con sesión real (10 min, individual)

Actualizar el navigation guard de clase 3:
- Reemplazar `localStorage.getItem('logueado')` por verificación de sesión de Supabase
- Usar `supabase.auth.getSession()` para saber si hay usuario activo
- Redirigir a `/login` si la ruta requiere auth y no hay sesión

---

### Ejercicio 5 — Auditar manejo de errores con IA (12 min, individual)

Usar este prompt:
> *"Revisá este código de login con Supabase. Identificá problemas en el manejo de errores, casos edge no contemplados, y mejoras en la experiencia de usuario. Sugerí correcciones específicas."*

```js
async function login() {
  const { data } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (data.user) router.push('/catalogo')
}
```

Checklist de revisión:
- [ ] ¿Maneja el caso donde `error` existe pero `data.user` es null?
- [ ] ¿Qué pasa si el usuario está en offline?
- [ ] ¿Muestra feedback visual mientras carga?
- [ ] ¿Valida el formulario antes de enviar?

---

## Código de Ejemplo

### Configuración de Supabase

```bash
# .env — nunca commitear este archivo
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

```bash
# .env.example — SÍ commitear
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

```js
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno de Supabase. Verificá el archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Consumir datos de Supabase

```vue
<!-- CatalogoView.vue -->
<template>
  <div>
    <h1>Catálogo</h1>
    
    <p v-if="cargando">Cargando productos...</p>
    
    <div v-else-if="error" class="error">
      <p>Error al cargar productos: {{ error }}</p>
      <button @click="cargarProductos">Reintentar</button>
    </div>
    
    <div v-else class="grilla">
      <TarjetaProducto
        v-for="p in productos"
        :key="p.id"
        v-bind="p"
        @agregar="carrito.agregarProducto(p)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useCarritoStore } from '../stores/carrito'
import TarjetaProducto from '../components/TarjetaProducto.vue'

const carrito   = useCarritoStore()
const productos = ref([])
const cargando  = ref(false)
const error     = ref(null)

async function cargarProductos() {
  cargando.value = true
  error.value    = null
  
  try {
    const { data, error: supabaseError } = await supabase
      .from('productos')
      .select('*')
      .order('nombre')
    
    if (supabaseError) throw supabaseError
    
    productos.value = data
  } catch (err) {
    error.value = err.message
    console.error('Error cargando productos:', err)
  } finally {
    cargando.value = false
  }
}

onMounted(cargarProductos)
</script>
```

### Composable useAuth

```js
// src/composables/useAuth.js
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useUsuarioStore } from '../stores/usuario'

export function useAuth() {
  const usuarioStore = useUsuarioStore()
  const cargando     = ref(false)
  
  // Verificar sesión al montar
  onMounted(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      usuarioStore.login(session.user)
    }
  })
  
  // Escuchar cambios de auth
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      usuarioStore.login(session.user)
    } else if (event === 'SIGNED_OUT') {
      usuarioStore.logout()
    }
  })
  
  async function registro(email, password) {
    cargando.value = true
    const { data, error } = await supabase.auth.signUp({ email, password })
    cargando.value = false
    
    if (error) return { data: null, error: traducirError(error.message) }
    if (data.user) usuarioStore.login(data.user)
    
    return { data, error: null }
  }
  
  async function login(email, password) {
    cargando.value = true
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    cargando.value = false
    
    if (error) return { data: null, error: traducirError(error.message) }
    if (data.user) usuarioStore.login(data.user)
    
    return { data, error: null }
  }
  
  async function logout() {
    cargando.value = true
    const { error } = await supabase.auth.signOut()
    cargando.value = false
    
    if (!error) usuarioStore.logout()
    
    return { error: error ? traducirError(error.message) : null }
  }
  
  function traducirError(mensaje) {
    const errores = {
      'Invalid login credentials': 'Email o contraseña incorrectos',
      'User already registered': 'Este email ya está registrado',
      'Email not confirmed': 'Debes confirmar tu email antes de iniciar sesión'
    }
    return errores[mensaje] || mensaje
  }
  
  return {
    registro,
    login,
    logout,
    cargando,
    usuario: usuarioStore.usuario,
    estaLogueado: usuarioStore.estaLogueado
  }
}
```

### Vistas de Login y Signup

```vue
<!-- LoginView.vue -->
<template>
  <div class="auth-container">
    <form @submit.prevent="handleLogin" class="auth-form">
      <h2>Iniciar Sesión</h2>
      
      <div v-if="errorMensaje" class="error">{{ errorMensaje }}</div>
      
      <div class="input-grupo">
        <label>Email</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          placeholder="tu@email.com"
        />
      </div>
      
      <div class="input-grupo">
        <label>Contraseña</label>
        <input 
          v-model="password" 
          type="password" 
          required 
          minlength="6"
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      
      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Ingresando...' : 'Ingresar' }}
      </button>
      
      <p class="link-secundario">
        ¿No tenés cuenta? <RouterLink to="/signup">Registrate</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, cargando } = useAuth()

const email        = ref('')
const password     = ref('')
const errorMensaje = ref(null)

async function handleLogin() {
  errorMensaje.value = null
  
  const { data, error } = await login(email.value, password.value)
  
  if (error) {
    errorMensaje.value = error
  } else if (data.user) {
    router.push('/catalogo')
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.input-grupo {
  margin-bottom: 1rem;
}

.input-grupo label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-grupo input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button[type="submit"] {
  width: 100%;
  padding: 0.75rem;
  background: #1e3a5f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  padding: 0.75rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c00;
  margin-bottom: 1rem;
}

.link-secundario {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.link-secundario a {
  color: #1e3a5f;
  text-decoration: none;
  font-weight: 500;
}
</style>
```

```vue
<!-- SignupView.vue -->
<template>
  <div class="auth-container">
    <form @submit.prevent="handleSignup" class="auth-form">
      <h2>Crear Cuenta</h2>
      
      <div v-if="errorMensaje" class="error">{{ errorMensaje }}</div>
      <div v-if="exitoMensaje" class="exito">{{ exitoMensaje }}</div>
      
      <div class="input-grupo">
        <label>Email</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          placeholder="tu@email.com"
        />
      </div>
      
      <div class="input-grupo">
        <label>Contraseña</label>
        <input 
          v-model="password" 
          type="password" 
          required 
          minlength="6"
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      
      <div class="input-grupo">
        <label>Confirmar Contraseña</label>
        <input 
          v-model="passwordConfirm" 
          type="password" 
          required 
          minlength="6"
          placeholder="Repetí tu contraseña"
        />
      </div>
      
      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Creando cuenta...' : 'Registrarse' }}
      </button>
      
      <p class="link-secundario">
        ¿Ya tenés cuenta? <RouterLink to="/login">Ingresá</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { registro, cargando } = useAuth()

const email           = ref('')
const password        = ref('')
const passwordConfirm = ref('')
const errorMensaje    = ref(null)
const exitoMensaje    = ref(null)

async function handleSignup() {
  errorMensaje.value = null
  exitoMensaje.value = null
  
  // Validación local
  if (password.value !== passwordConfirm.value) {
    errorMensaje.value = 'Las contraseñas no coinciden'
    return
  }
  
  if (password.value.length < 6) {
    errorMensaje.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  
  const { data, error } = await registro(email.value, password.value)
  
  if (error) {
    errorMensaje.value = error
  } else if (data.user) {
    exitoMensaje.value = 'Cuenta creada. Revisá tu email para confirmarla.'
    // Supabase envía email de confirmación automáticamente
    setTimeout(() => router.push('/login'), 3000)
  }
}
</script>

<style scoped>
/* Reutilizar estilos de LoginView.vue */
.exito {
  padding: 0.75rem;
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 4px;
  color: #060;
  margin-bottom: 1rem;
}
</style>
```

### Actualizar navigation guard con sesión real

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'

const routes = [
  // ... rutas existentes
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignupView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiereAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiereAuth && !session) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
```

### Actualizar store de usuario

```js
// src/stores/usuario.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', () => {
  const usuario      = ref(null)
  const estaLogueado = computed(() => usuario.value !== null)
  
  function login(datosUsuario) { 
    usuario.value = {
      id: datosUsuario.id,
      email: datosUsuario.email,
      // Agregar otros campos que necesites
    }
  }
  
  function logout() { 
    usuario.value = null  
  }
  
  return { usuario, estaLogueado, login, logout }
}, { persist: true })
```

---

## Preguntas para Disparar Debate

1. **¿Qué diferencia hay entre usar Supabase y escribir un backend propio en Node.js?** ¿Cuándo elegirían uno sobre el otro? ¿Qué control perdés con un BaaS?

2. **El composable `useAuth` maneja errores pero los traduce al español.** ¿Es responsabilidad del composable traducir mensajes o debería retornar códigos de error y que el componente decida qué mostrar?

3. **La anon key de Supabase está en el código del frontend.** ¿Eso es un problema de seguridad? ¿Qué pasa si alguien la copia? ¿Cómo protege Supabase contra abuso?

4. **Persistir la sesión en localStorage vs. confiar en el token de Supabase.** ¿Cuál es más seguro? ¿Qué pasa si alguien roba el token del localStorage?

5. **La IA sugirió mejoras al código de login.** ¿Alguna de esas mejoras era crítica (un bug real) y cuáles eran "nice to have"? ¿Cómo priorizarían esas correcciones en un contexto de producto real?

6. **Ahora tienen datos reales fluyendo desde una base de datos.** ¿Qué nuevos problemas aparecen que no existían con datos hardcodeados? (latencia, datos faltantes, cambios de schema...)