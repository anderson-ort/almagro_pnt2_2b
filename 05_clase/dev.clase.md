# Guía práctica para la Clase 2: Refactorizando la Biblioteca (Componentes y Composables)

## Repaso de la clase pasada

**Temas dados en clase**

La clase arranco con el setup del proyecto usando Vite con el template de Vue, cubriendo la estructura de un Single File Component (SFC) y como levantar el servidor local. Despues se trabajo la Composition API con `script setup`, introduciendo `ref()` como mecanismo de reactividad para variables primitivas y arrays, y la diferencia entre usar `.value` en el script vs el template.

Se vio el renderizado de listas con `v-for` y la importancia de `:key`, el binding dinamico con `:class` para estilos condicionales, el manejo de eventos con `@click`, y como deshabilitar elementos con `:disabled`. Luego se agrego busqueda en tiempo real combinando `v-model` con `computed()`, entendiendo por que `computed` es mas eficiente que una funcion comun. Se cerraron las directivas con `v-if` y `v-else` para mostrar mensajes condicionales. Finalmente se implemento un contador de reservas con validaciones, y se hizo el flujo completo de Git: commit, rama, push y creacion de un Pull Request con descripcion estructurada.


| Tema | Qué cubre |
|------|-----------|
| Setup con Vite | Estructura del proyecto, Single File Components, servidor local |
| `script setup` | Composition API, diferencia con Options API |
| `ref()` | Reactividad para primitivos y arrays; `.value` en script vs template |
| `v-for` + `:key` | Renderizado de listas |
| `:class` | Binding dinámico para estilos condicionales |
| `@click` | Manejo de eventos |
| `:disabled` | Deshabilitar elementos reactivamente |
| `v-model` + `computed()` | Búsqueda en tiempo real; por qué `computed` es más eficiente que una función |
| `v-if` / `v-else` | Renderizado condicional de mensajes |
| Contador con validaciones | Lógica de negocio reactiva |
| Flujo Git | Commit, rama, push, Pull Request con descripción estructurada |

### Temas para investigar

| Tema | Para qué sirve |
|------|----------------|
| `watch()` / `watchEffect()` | Ejecutar lógica cuando cambia un valor reactivo; útil para efectos secundarios |
| Composables | Extraer y reutilizar lógica entre componentes (ej: `useReservas.js`) |
| Pinia | Estado global compartido entre muchos componentes |
| Vue Router | Navegación entre páginas dentro de una SPA |
| `provide` / `inject` | Alternativa a pasar props en cadenas largas |
| Vitest + Vue Test Utils | Tests unitarios de componentes |


## 2. Arquitectura: "El Cerebro y los Músculos"
Separamos las responsabilidades para no tener un código espagueti. 



* **Composables (Cerebro):** Manejan el estado y la lógica de negocio (el "qué hace").
* **Componentes (Músculos):** Se encargan de la UI y de interactuar con el usuario (el "cómo se ve").
* **App.vue (Director de Orquesta):** Une las piezas.

---

## 3. Desarrollo Paso a Paso

### Etapa 1: El Componente de Presentación (`LibroCard.vue`)
**Concepto:** Es un "Dumb Component". Recibe datos por `props` y avisa acciones por `emits`.

```vue
<template>
  <div class="card">
    <h3>{{ libro.titulo }}</h3>
    <p>Autor: {{ libro.autor }}</p>
    
    <slot name="etiqueta"></slot>

    <button 
      @click="$emit('intentar-reserva', libro.id)" 
      :disabled="libro.stock === 0"
    >
      {{ libro.stock > 0 ? 'Reservar' : 'Sin Stock' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  libro: { type: Object, required: true }
})
// Definimos los eventos que este componente puede disparar
defineEmits(['intentar-reserva'])
</script>

<style scoped>
.card { border: 1px solid #ccc; padding: 1rem; margin: 0.5rem; border-radius: 8px; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
```

---

### Etapa 2: Slots y Reutilización (`BaseModal.vue`)
**Concepto:** Creamos un componente "cáscara". El padre decide qué poner adentro usando Slots.

```vue
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header>
        <slot name="header"><h3>Aviso</h3></slot>
        <button @click="$emit('close')">X</button>
      </header>
      
      <section class="modal-body">
        <slot></slot>
      </section>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content { background: white; padding: 20px; border-radius: 12px; min-width: 300px; }
header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.modal-body { padding: 20px 0; }
</style>
```

---

### Etapa 3: El Composable (`useLibros.js`)
**Concepto:** Extraemos la lógica. El componente ya no sabe de dónde vienen los datos, solo los usa.

```javascript
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
```

---

### Etapa 4: Integración en `App.vue`
**Concepto:** Unimos todo. Fíjate cómo usamos los slots con `#` (shorthand de `v-slot`).

```vue
<template>
  <main>
    <h1>Biblioteca Digital</h1>
    
    <div class="stats">
      Reservas: <strong>{{ reservasUsuario }} / {{ MAX_RESERVAS }}</strong>
    </div>

    <input v-model="filtro" placeholder="Buscar libro..." class="filtro-input" />

    <div class="grid">
      <LibroCard 
        v-for="l in librosFiltrados" 
        :key="l.id" 
        :libro="l"
        @intentar-reserva="handleReserva"
      >
        <template #etiqueta v-if="l.stock < 3 && l.stock > 0">
          <span class="warning">¡Casi agotado!</span>
        </template>
      </LibroCard>
    </div>

    <BaseModal v-if="mostrarError" @close="mostrarError = false">
      <template #header><h3 style="color: red">¡Límite alcanzado!</h3></template>
      
      <p>Ya tenés {{ MAX_RESERVAS }} reservas activas. Dejá algo para el resto, boludo.</p>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import LibroCard from './components/LibroCard.vue'
import BaseModal from './components/BaseModal.vue'
import { useLibros } from './composables/useLibros'

const { filtro, librosFiltrados, reservasUsuario, MAX_RESERVAS, reservarLibro } = useLibros()
const mostrarError = ref(false)

const handleReserva = (id) => {
  const exito = reservarLibro(id)
  if (!exito && reservasUsuario.value >= MAX_RESERVAS) {
    mostrarError.value = true
  }
}
</script>
```

---

## 4. Tabla de Errores Comunes (Para no mandarse macanas)

| Situación | Error Común | Consecuencia | Solución |
|-----------|-------------|--------------|----------|
| **Props** | Intentar hacer `props.libro.stock--` | Error de "Set" en consola. Vue protege la inmutabilidad de las props. | El hijo **emite** un evento; el padre (o el composable) cambia el dato. |
| **Slots** | Poner contenido en el hijo sin usar `<template #nombre>` | El contenido no aparece o se pisa con el slot por defecto. | Asegurarse que el nombre del slot en el `template` del padre coincida con el `name` en el hijo. |
| **Composables** | Olvidar el `return` de una variable | La variable será `undefined` en el componente. | Siempre retornar un objeto con todo lo que el componente necesite usar. |
| **V-bind** | Escribir `libro="l"` en vez de `:libro="l"` | Le pasás el texto "l" literal en lugar del objeto del bucle. | No te olvides de los dos puntos (`:`) para binding dinámico. |

---

## Debate: ¿Cuándo un componente es "demasiado grande"?
Si el `<template>` tiene más de 100 líneas o el `<script setup>` maneja 5 lógicas distintas (filtrado, login, carrito, etc.), **ponete las pilas y dividilo**. La regla de oro: un componente debería hacer una sola cosa bien.

---

## Recursos adicionales
- [Vue Patterns: Props & Emits](https://vuejs.org/guide/components/props.html)
- [Mastering Composables](https://vueschool.io/articles/vuejs-tutorials/what-is-a-vue-js-composable/)

