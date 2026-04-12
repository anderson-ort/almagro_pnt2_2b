# Clase 4 — Pinia: Estado Global y Arquitectura de Datos
**Calendario:** Pinia: estado global, getters, actions y persistencia

> **Tipo:** Práctica técnica + Arquitectura · **Duración:** ~90 min  
> **Prerequisitos:** Clase 3 completada, Vue Router funcionando

---

## 🗺️ Guía para el Docente

### Objetivo de la clase
Que los estudiantes entiendan el problema del prop drilling, lo experimenten brevemente en código, y luego lo resuelvan con Pinia. El foco no es solo la sintaxis: es entender cuándo el estado local de un componente deja de ser suficiente.

### Flujo sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0–10 min | Demo del problema: prop drilling en 3 niveles. Que lo vean antes de ver la solución. El dato que necesita `NavBar` tiene que pasar por 2 componentes que no lo usan. |
| 10–20 min | Instalar Pinia. Registrarlo en `main.js`. Anatomía de una store: la analogía es directa — `state` = `ref()`, `getters` = `computed()`, `actions` = funciones. |
| 20–35 min | Crear la store del carrito en vivo. Consumirla desde `NavBar` y desde `TarjetaProducto` sin pasar props. Mostrar Vue DevTools con el panel de Pinia. |
| 35–50 min | Actividad práctica primera parte: store completa (ejercicio 1 y 2). |
| 50–60 min | Persistencia con `pinia-plugin-persistedstate`. Verificar que el carrito sobrevive al F5. |
| 60–72 min | Store de usuario integrada con el navigation guard del router (ejercicio 3). |
| 72–83 min | Actividad: usar IA para generar la store y auditarla (ejercicio 4). |
| 83–90 min | PR: `feat/pinia-store`. |

### Tips para el docente
- **No saltear la demo del prop drilling.** Si los estudiantes no sienten el dolor, la solución no tiene peso.
- Vue DevTools es esencial en esta clase. Mostrar en tiempo real cómo cambia el estado en el panel de Pinia mientras el usuario interactúa.
- Pinia es deliberadamente más simple que Vuex. Si alguien pregunta por Vuex, una línea alcanza: es el predecesor oficial, Pinia lo reemplazó por ser más simple y mejor integrado con Vue 3.
- La integración con el router (store de usuario + guard) cierra el círculo de las últimas dos clases y muestra cómo las piezas se conectan.

### Conceptos clave para reforzar
- **State** es reactivo: cualquier componente que lo consuma se actualiza automáticamente cuando cambia.
- La diferencia entre un **composable** (clase 2) y una **store de Pinia**: ambos encapsulan lógica reactiva, pero la store es una instancia **singleton** — siempre hay un solo carrito, aunque lo llames desde 10 componentes distintos.
- Los secrets de **persistencia**: guardar estado en localStorage es conveniente pero hay datos que nunca deberían ir ahí (tokens de auth, información sensible).

---

## ✏️ Ejercicios / Actividades

### Ejercicio 1 — Setup y store del carrito (30 min, individual)

```bash
npm install pinia pinia-plugin-persistedstate
```

Crear `src/stores/carrito.js` con:

**State:** `items` (array de `{ id, nombre, precio, cantidad }`)

**Getters:**
- `totalItems` — suma de todas las cantidades
- `totalPrecio` — suma de precio × cantidad
- `estaVacio` — boolean

**Actions:**
- `agregarProducto(producto)` — si ya existe, sumar cantidad; si no, agregar con cantidad 1
- `eliminarProducto(id)` — filtrar del array
- `vaciarCarrito()` — resetear

Conectar con:
- `NavBar.vue` — mostrar el contador de items
- `TarjetaProducto.vue` — botón "Agregar" que llama a `agregarProducto`
- Vista nueva `CarritoView.vue` con la lista de items y el total

---

### Ejercicio 2 — Persistencia (8 min, individual)

Agregar `persist: true` a la store del carrito. Verificar que al hacer F5 los productos siguen. Luego discutir con el compañero de al lado: ¿qué datos tiene sentido persistir y cuáles no?

---

### Ejercicio 3 — Store de usuario + router (15 min, individual)

Crear `src/stores/usuario.js` con `usuario` (ref), `estaLogueado` (computed), `login(datos)` y `logout()`.

Actualizar el navigation guard de la clase 3 para que use `useUsuarioStore().estaLogueado` en lugar de `localStorage.getItem('logueado')` directamente.

---

### Ejercicio 4 — Auditar una store generada por IA (15 min, individual)

Usar este prompt:
> *"Generá una store de Pinia para un módulo de favoritos en una app Vue 3. El usuario puede agregar y quitar libros de favoritos. Incluye state, getters y actions. Usá Composition API dentro de defineStore."*

Revisar el resultado con esta checklist:
- [ ] ¿Usa `defineStore` con Composition API (no Options API)?
- [ ] ¿Retorna todo lo que necesitan los componentes?
- [ ] ¿Las actions mutan el state directamente (correcto) o retornan un nuevo array sin asignarlo (bug silencioso)?
- [ ] ¿Los getters son `computed()` o funciones normales?
- [ ] ¿Hay algo que haría diferente considerando el contexto del proyecto?

---

## 💻 Código de Ejemplo

### Instalación y configuración

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')
```

### Store del carrito

```js
// src/stores/carrito.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', () => {
  // STATE
  const items = ref([])

  // GETTERS
  const totalItems  = computed(() => items.value.reduce((sum, i) => sum + i.cantidad, 0))
  const totalPrecio = computed(() => items.value.reduce((sum, i) => sum + i.precio * i.cantidad, 0))
  const estaVacio   = computed(() => items.value.length === 0)

  // ACTIONS
  function agregarProducto(producto) {
    const existente = items.value.find(i => i.id === producto.id)
    if (existente) {
      existente.cantidad++
    } else {
      items.value.push({ ...producto, cantidad: 1 })
    }
  }

  function eliminarProducto(id) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function vaciarCarrito() {
    items.value = []
  }

  return { items, totalItems, totalPrecio, estaVacio, agregarProducto, eliminarProducto, vaciarCarrito }
}, {
  persist: true   // pinia-plugin-persistedstate: guarda en localStorage
})
```

### Consumir la store en componentes

```vue
<!-- NavBar.vue -->
<template>
  <nav>
    <RouterLink to="/carrito">
      Carrito
      <span v-if="carrito.totalItems > 0" class="badge">{{ carrito.totalItems }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useCarritoStore } from '../stores/carrito'
const carrito = useCarritoStore()
</script>
```

```vue
<!-- CarritoView.vue -->
<template>
  <div>
    <h1>Tu Carrito</h1>
    <p v-if="carrito.estaVacio">El carrito está vacío.</p>
    <div v-else>
      <div v-for="item in carrito.items" :key="item.id" class="item">
        <span>{{ item.nombre }}</span>
        <span>x{{ item.cantidad }}</span>
        <span>${{ (item.precio * item.cantidad).toLocaleString('es-AR') }}</span>
        <button @click="carrito.eliminarProducto(item.id)">✕</button>
      </div>
      <hr />
      <p><strong>Total: ${{ carrito.totalPrecio.toLocaleString('es-AR') }}</strong></p>
      <button @click="carrito.vaciarCarrito()">Vaciar</button>
    </div>
  </div>
</template>

<script setup>
import { useCarritoStore } from '../stores/carrito'
const carrito = useCarritoStore()
</script>
```

### Store de usuario con integración al router

```js
// src/stores/usuario.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', () => {
  const usuario      = ref(null)
  const estaLogueado = computed(() => usuario.value !== null)

  function login(datos) { usuario.value = datos }
  function logout()     { usuario.value = null  }

  return { usuario, estaLogueado, login, logout }
}, { persist: true })
```

```js
// router/index.js — guard actualizado
import { useUsuarioStore } from '../stores/usuario'

router.beforeEach((to, from, next) => {
  const usuario = useUsuarioStore()
  if (to.meta.requiereAuth && !usuario.estaLogueado) {
    next({ name: 'inicio', query: { mensaje: 'acceso-denegado' } })
  } else {
    next()
  }
})

// En las rutas que necesitan protección:
// { path: '/admin', name: 'admin', meta: { requiereAuth: true }, component: ... }
```

---

## 💬 Preguntas para Disparar Debate

1. **¿Todo el estado de la app debería estar en Pinia?** ¿O hay estado que tenga más sentido quedarse local en un componente? ¿Cuál es el criterio?

2. **¿Cuál es la diferencia real entre un composable y una store de Pinia?** Ambos encapsulan lógica reactiva. ¿Cuándo elegirían uno sobre el otro?

3. **La persistencia en localStorage es conveniente pero tiene riesgos.** ¿Qué información guardarían y cuál no? ¿Hay datos que nunca deberían persistirse en el cliente?

4. **La IA generó una store funcional, pero ¿captó el contexto del proyecto?** ¿Qué cosas de la lógica de negocio no podía saber?

5. **Pinia reemplazó a Vuex como el estado oficial de Vue.** ¿Qué les dice eso sobre la estabilidad de los ecosistemas frontend? ¿Cómo manejan como desarrolladores el riesgo de aprender algo que puede cambiar?
