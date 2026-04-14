# Clase 3 — Vue Router: Navegación en SPAs
**Calendario:** Vue Router: rutas dinámicas, guards y decisiones de MVP

> **Tipo:** Práctica técnica + Decisiones de producto · **Duración:** ~90 min  
> **Prerequisitos:** Clase 2 completada, proyecto con componentes funcionando

---

## Guía para el Docente

### Objetivo de la clase
Que los estudiantes puedan configurar Vue Router, definir rutas estáticas y dinámicas, proteger rutas con guards y — igual de importante — tomar decisiones informadas sobre qué rutas incluir en un MVP.

### Flujo sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0–10 min | Motivación: abrir una SPA sin router. Mostrar que el botón "atrás" no funciona, no se puede compartir una URL específica, no se puede hacer bookmark. Esos son los problemas que Vue Router resuelve. |
| 10–20 min | Instalar Vue Router. Mostrar la estructura de `router/index.js`. Configurar 2 rutas básicas y verlas funcionar. |
| 20–32 min | `RouterView` y `RouterLink` en `App.vue`. Mostrar cómo cambia la URL sin recargar la página. Clase activa con `router-link-active`. |
| 32–45 min | Rutas dinámicas con `:id`. `useRoute()` para leer el parámetro. Rutas anidadas brevemente. |
| 45–55 min | Navigation Guards: `beforeEach` con un caso de ruta protegida. Diferencia entre `useRoute()` y `useRouter()`. |
| 55–65 min | Lazy loading: mostrar la sintaxis `() => import(...)` y explicar por qué existe (performance). |
| 65–78 min | Actividad práctica (ver ejercicios). |
| 78–87 min | Discusión: volver al proyecto de la librería. ¿Qué rutas van en el MVP? |
| 87–90 min | PR: `feat/vue-router`. |

### Tips para el docente
- **Mostrar el historial del browser** mientras navegás. Que vean cómo Vue Router maneja `pushState` sin recargar.
- El error más frecuente: confundir `useRoute()` con `useRouter()`. Aclararlo con una regla simple: `useRoute` **lee** (params, query, name), `useRouter` **navega** (push, replace, back).
- La discusión de MVP merece al menos 10 minutos genuinos. Es donde se conecta lo técnico con lo profesional.

### Conceptos clave para reforzar
- `RouterView` es el "slot" donde se renderiza la vista activa según la ruta.
- Los parámetros de ruta (`:id`) se leen con `useRoute().params.id`.
- Navigation Guards son el lugar correcto para lógica de autenticación — no dentro de los componentes.
- Lazy loading = el bundle de esa vista se descarga solo cuando el usuario navega a ella.

---

## Ejercicios / Actividades

### Ejercicio 1 — Setup del router (10 min, individual)

```bash
npm install vue-router@4
```

Crear la estructura:
```
src/
├── router/
│   └── index.js
└── views/
    ├── InicioView.vue
    ├── CatalogoView.vue
    ├── DetalleProductoView.vue
    └── NoEncontradoView.vue
```

Cada vista arranca con un `<h1>` descriptivo. El objetivo es tener navegación funcionando entre páginas.

---

### Ejercicio 2 — Rutas completas (25 min, individual)

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | `InicioView` | Página de bienvenida |
| `/catalogo` | `CatalogoView` | Lista de productos como links |
| `/producto/:id` | `DetalleProductoView` | Detalle del producto recibido por parámetro |
| `/:pathMatch(.*)*` | `NoEncontradoView` | 404 con link para volver |

`CatalogoView` debe listar al menos 4 productos. Al hacer click en uno, navegar a `/producto/:id`. `DetalleProductoView` debe leer el `:id` y buscar el producto correspondiente.

---

### Ejercicio 3 — Ruta protegida (15 min, individual)

1. Crear `AdminView.vue`
2. Agregar un navigation guard que verifique `localStorage.getItem('logueado')`
3. Si no está logueado, redirigir a `/` con `?mensaje=acceso-denegado`
4. En `InicioView`, mostrar el mensaje si existe el query param

Testear desde la consola: `localStorage.setItem('logueado', 'true')`.

---

### Ejercicio 4 — Decisiones de MVP (10 min, grupal)

Proyecto de la librería. Clasificar cada ruta:

| Ruta | MVP o V2 | Justificación |
|------|----------|---------------|
| `/` — Inicio | | |
| `/catalogo` — Lista de libros | | |
| `/libro/:id` — Detalle | | |
| `/reservar/:id` — Formulario de reserva | | |
| `/mis-reservas` — Historial del usuario | | |
| `/admin` — Panel del dueño | | |
| `/login` — Autenticación | | |

---

## Código de Ejemplo

### Configuración del router

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: () => import('../views/InicioView.vue')    // lazy loading
  },
  {
    path: '/catalogo',
    name: 'catalogo',
    component: () => import('../views/CatalogoView.vue')
  },
  {
    path: '/producto/:id',
    name: 'detalle-producto',
    component: () => import('../views/DetalleProductoView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'no-encontrado',
    component: () => import('../views/NoEncontradoView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard global
router.beforeEach((to, from, next) => {
  const rutasProtegidas = ['admin']
  const estaLogueado    = !!localStorage.getItem('logueado')

  if (rutasProtegidas.includes(to.name) && !estaLogueado) {
    next({ name: 'inicio', query: { mensaje: 'acceso-denegado' } })
  } else {
    next()
  }
})

export default router
```

```js
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

### RouterView y RouterLink

```vue
<!-- App.vue -->
<template>
  <nav>
    <RouterLink to="/">Inicio</RouterLink>
    <RouterLink to="/catalogo">Catálogo</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
nav { display: flex; gap: 1rem; padding: 1rem; background: #1e3a5f; }
nav a { color: white; text-decoration: none; }
nav a.router-link-active { font-weight: bold; text-decoration: underline; }
</style>
```

### Leer parámetros y navegar

```vue
<!-- DetalleProductoView.vue -->
<template>
  <div>
    <h1>Producto #{{ id }}</h1>
    <p>{{ producto?.nombre ?? 'Producto no encontrado' }}</p>
    <RouterLink to="/catalogo">← Volver</RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id    = computed(() => route.params.id)

const productos = [
  { id: '1', nombre: 'Teclado Mecánico' },
  { id: '2', nombre: 'Mouse Inalámbrico' },
  { id: '3', nombre: 'Monitor 24"' },
]

const producto = computed(() => productos.find(p => p.id === id.value))
</script>
```

```vue
<!-- Navegación programática -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function irAlProducto(id) {
  router.push({ name: 'detalle-producto', params: { id } })
}

function irConQuery() {
  router.push({ path: '/catalogo', query: { categoria: 'libros' } })
}
</script>
```

### Leer query params

```vue
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route   = useRoute()
const mensaje = computed(() => route.query.mensaje)
</script>

<template>
  <div v-if="mensaje === 'acceso-denegado'" class="alerta">
    Necesitás iniciar sesión para acceder a esa sección.
  </div>
</template>
```

---

## Preguntas para Disparar Debate

1. **¿Por qué una SPA necesita un router si es una sola página?** ¿Qué problemas concretos resuelve que el browser no resuelve solo?

2. **¿Dónde debería vivir la lógica de autenticación?** ¿En un navigation guard, en el componente, en ambos? ¿Qué pasa si la ponés solo en el componente?

3. **Lazy loading carga las vistas solo cuando se necesitan.** ¿Cuándo podría ser mejor NO usarlo? ¿Hay rutas que valga la pena cargar siempre?

4. **Al decidir las rutas del MVP**, ¿usaron algún criterio consistente? ¿Valor para el usuario, esfuerzo, dependencias técnicas?

5. **Si el cliente cambia `/producto/:id` a `/libro/:slug`**, ¿qué impacto tiene en el código? ¿Cómo lo mitigarían desde el principio?
