# Clase 2 — Componentes y Composables
**Calendario:** Componentes Vue: props, emits, slots y lógica reutilizable con composables

> **Tipo:** Práctica técnica + Arquitectura · **Duración:** ~90 min  
> **Prerequisitos:** Clase 1 completada, proyecto Vue funcionando

---

## Guía para el Docente

### Objetivo de la clase
Dos conceptos que se complementan: los componentes organizan la **UI** en piezas reutilizables, los composables organizan la **lógica** en funciones reutilizables. Al terminar la clase, los estudiantes deberían poder partir cualquier componente demasiado grande en responsabilidades más pequeñas.

### Flujo sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0–10 min | Motivación: mostrar un componente de 200 líneas que hace todo. Preguntar: ¿qué problema tiene esto? → introducir responsabilidad única. |
| 10–25 min | Props y emits en vivo: crear `TarjetaProducto.vue` que recibe datos y emite eventos. Diagrama en pizarra del flujo unidireccional. |
| 25–35 min | `defineProps()` y `defineEmits()` con tipado. Mostrar el warning de Vue cuando se intenta mutar una prop. |
| 35–42 min | Slots: cuándo una prop de string no alcanza y necesitamos pasar HTML arbitrario. |
| 42–55 min | **Composables**: qué son, cuándo usarlos, cómo se diferencian de un componente y de un helper. Crear `useFetch.js` en vivo. |
| 55–70 min | Actividad práctica primera parte: componentes (ejercicio 1 y 2). |
| 70–83 min | Actividad práctica segunda parte: composable (ejercicio 3). Usar IA para generar el composable y revisarlo. |
| 83–90 min | PR: `feat/componentes-composables`. Puesta en común: comparar diseños. |

### Tips para el docente
- El error más común: **modificar una prop directamente en el hijo**. Anticiparlo con una demo que muestra el warning. La regla es simple: props bajan, eventos suben.
- Los composables son el concepto más nuevo para estudiantes que vienen de Options API o de otros frameworks. La analogía más clara: *un composable es como un componente sin template — tiene estado reactivo, lógica y puede usarse en cualquier componente.*
- Al mostrar composables, empezar por el problema que resuelven: el mismo `fetch + cargando + error` copy-pasted en 5 componentes. Luego mostrar cómo `useFetch()` lo centraliza.
- La IA es muy buena generando composables porque el patrón es muy estructurado. Es un buen momento para mostrar el valor de un prompt con contexto específico.

### Conceptos clave para reforzar
- **Flujo de datos unidireccional**: props bajan, emits suben. Nunca al revés.
- **Responsabilidad única**: si un componente hace demasiadas cosas, hay que partirlo. Si la misma lógica aparece en varios componentes, hay que extraerla a un composable.
- Los composables **siempre empiezan con `use`** por convención: `useCarrito`, `useFetch`, `useAuth`.
- `v-model` en componentes personalizados es azúcar sobre `:modelValue` + `@update:modelValue`.

---

## Ejercicios / Actividades

### Ejercicio 1 — Identificar componentes (8 min, grupal)

Dada esta pantalla de una tienda:

```
┌─────────────────────────────────────┐
│  Mi Tienda           [Carrito: 3]│
├─────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐         │
│  │ [imagen] │  │ [imagen] │         │
│  │ Producto │  │ Producto │         │
│  │ $1.200   │  │ $800     │         │
│  │[Agregar] │  │[Agregar] │         │
│  └──────────┘  └──────────┘         │
├─────────────────────────────────────┤
│  Nombre: [___________]              │
│  Email:  [___________]              │
│                    [Enviar consulta]│
└─────────────────────────────────────┘
```

Identificar: ¿qué componentes harían? ¿Cuáles se repiten? ¿Qué props necesitaría cada uno? ¿Qué datos viven en el padre?

---

### Ejercicio 2 — Props y emits (25 min, individual)

**`TarjetaProducto.vue`** recibe: `nombre`, `precio`, `imagen`, `stock`. Debe:
- Mostrar la info del producto
- Tener un botón "Agregar" deshabilitado si `stock === 0`
- Emitir el evento `agregar` con el id del producto al hacer click

**`ListaProductos.vue`** (padre):
- Define un array de 4 productos
- Renderiza un `TarjetaProducto` por cada uno
- Escucha `agregar` y muestra "Agregaste: [nombre]" por 3 segundos

---

### Ejercicio 3 — Composable useFetch (22 min, individual)

Crear `src/composables/useFetch.js` que encapsule la lógica de fetch con estado de carga y error.

**Primero, pedirlo a la IA:**
> *"Creá un composable Vue 3 llamado useFetch que acepte una URL como parámetro. Debe retornar: data (ref con los datos), cargando (ref boolean), error (ref con el mensaje de error). Debe hacer el fetch automáticamente al montarse y manejar errores con try/catch. Usá onMounted de Vue."*

**Luego, revisarlo:**
- ¿Resetea `error` antes de cada fetch?
- ¿Verifica `response.ok` además de atrapar excepciones?
- ¿Funciona si la URL cambia después del montaje?

**Usarlo en un componente** que muestre una lista de posts de `https://jsonplaceholder.typicode.com/posts?_limit=5`.

---

### Ejercicio 4 — v-model personalizado (15 min, individual)

Crear `InputTexto.vue` que:
- Reciba `label`, `modelValue` y `placeholder` como props
- Emita `update:modelValue` al escribir
- Tenga estilos propios (`scoped`)

Usarlo en un formulario de contacto con `v-model` en el padre.

---

## Código de Ejemplo

### Props y emits

```vue
<!-- TarjetaProducto.vue -->
<template>
  <div class="tarjeta">
    <img :src="imagen || '/placeholder.png'" :alt="nombre" />
    <h3>{{ nombre }}</h3>
    <p>${{ precio.toLocaleString('es-AR') }}</p>
    <span v-if="stock === 0" class="sin-stock">Sin stock</span>
    <button @click="emit('agregar', id)" :disabled="stock === 0">
      Agregar al carrito
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  id:     { type: Number, required: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String, default: '' },
  stock:  { type: Number, default: 0 }
})

const emit = defineEmits(['agregar'])
</script>
```

```vue
<!-- ListaProductos.vue -->
<template>
  <div>
    <Transition name="fade">
      <p v-if="ultimoAgregado" class="aviso">Agregaste: {{ ultimoAgregado }}</p>
    </Transition>
    <div class="grilla">
      <TarjetaProducto
        v-for="p in productos"
        :key="p.id"
        v-bind="p"
        @agregar="manejarAgregar"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TarjetaProducto from './TarjetaProducto.vue'

const ultimoAgregado = ref(null)

const productos = ref([
  { id: 1, nombre: 'Teclado Mecánico', precio: 12000, stock: 5 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 8500,  stock: 0 },
  { id: 3, nombre: 'Monitor 24"',       precio: 85000, stock: 2 },
  { id: 4, nombre: 'Auriculares',       precio: 6000,  stock: 10 },
])

function manejarAgregar(id) {
  const producto = productos.value.find(p => p.id === id)
  ultimoAgregado.value = producto?.nombre
  setTimeout(() => ultimoAgregado.value = null, 3000)
}
</script>
```

### Slots

```vue
<!-- Panel.vue -->
<template>
  <div class="panel">
    <div class="panel-header">
      <slot name="header"><h3>Título por defecto</h3></slot>
    </div>
    <div class="panel-body">
      <slot />
    </div>
    <div class="panel-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<!-- Uso -->
<Panel>
  <template #header><h2>Mi título</h2></template>
  <p>Contenido principal del panel.</p>
  <template #footer><button>Cerrar</button></template>
</Panel>
```

### Composable useFetch

```js
// src/composables/useFetch.js
import { ref, onMounted } from 'vue'

export function useFetch(url) {
  const data     = ref(null)
  const cargando = ref(false)
  const error    = ref(null)

  async function fetchData() {
    cargando.value = true
    error.value    = null       // resetear antes de cada intento

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  onMounted(fetchData)

  return { data, cargando, error, refetch: fetchData }
}
```

```vue
<!-- Uso del composable -->
<template>
  <div>
    <p v-if="cargando">Cargando...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <ul v-else>
      <li v-for="post in data" :key="post.id">{{ post.title }}</li>
    </ul>
    <button @click="refetch">Recargar</button>
  </div>
</template>

<script setup>
import { useFetch } from '../composables/useFetch'

const { data, cargando, error, refetch } =
  useFetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
</script>
```

### v-model en componentes personalizados

```vue
<!-- InputTexto.vue -->
<template>
  <div class="input-grupo">
    <label>{{ label }}</label>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue:  { type: String, default: '' },
  label:       { type: String, required: true },
  placeholder: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])
</script>

<!-- Uso en el padre:
<InputTexto v-model="nombre" label="Nombre completo" />
Es equivalente a:
<InputTexto :modelValue="nombre" @update:modelValue="nombre = $event" label="..." />
-->
```

### Estructura de carpetas con composables

```
src/
├── components/
│   ├── TarjetaProducto.vue
│   ├── InputTexto.vue
│   └── Panel.vue
├── composables/
│   ├── useFetch.js       ← lógica de fetch reutilizable
│   ├── useCarrito.js     ← lógica del carrito (antes de Pinia)
│   └── useFormulario.js  ← validación de formularios
└── App.vue
```

---

## Preguntas para Disparar Debate

1. **¿Por qué Vue no permite modificar una prop directamente en el hijo?** ¿Qué problema concreto evita esa restricción?

2. **La diferencia entre un composable y un helper (función utilitaria) no siempre es obvia.** ¿Cuál sería el criterio para decidir si algo va en un composable o en una función normal?

3. **Le pedimos a la IA que genere `useFetch` y lo hizo bien, pero olvidó resetear el error antes de cada intento.** ¿Qué tipo de bugs causa ese olvido? ¿Cómo lo detectarían sin tests?

4. **¿Cuándo un componente es "demasiado grande"?** ¿Tienen alguna regla mental para decidir cuándo partir un componente?

5. **`v-model` en componentes personalizados hace que el padre no sepa cómo el hijo implementa el input.** ¿Eso es una ventaja o una desventaja? ¿Cuándo cada cosa?
