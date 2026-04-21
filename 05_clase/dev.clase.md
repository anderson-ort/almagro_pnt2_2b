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

---

## Resumen del proyecto

Vamos a evolucionar la **Biblioteca Digital**. El objetivo es romper el "Componente Dios" (`CatalogoLibros.vue`) en piezas atómicas y extraer la lógica de negocio a funciones puras. 
- **UI:** Componentes especializados con Props, Emits y Slots.
- **Lógica:** Creación de nuestro primer Composable para manejar los datos.

Este es el salto de "hacer que funcione" a "diseñar software".

---

## Objetivos de aprendizaje por etapa

| Etapa | Tiempo | Conceptos | Entregable |
|-------|--------|-----------|-------------|
| 1. Átomos de UI | 20 min | `defineProps`, `defineEmits` | `LibroCard.vue` independiente |
| 2. Contenedores | 15 min | Slots (Contenido arbitrario) | `BaseCard.vue` o `Alerta.vue` |
| 3. Abstracción | 25 min | Composables (Logic extraction) | `useLibros.js` funcionando |
| 4. Integración | 15 min | Comunicación Padre-Hijo | App funcionando refactorizada |
| 5. Code Review | 15 min | Calidad de código | PR con refactor listo |

---

## Estructura final del proyecto (Arquitectura Limpia)

```
mi-biblioteca/
├── src/
│   ├── components/
│   │   ├── LibroCard.vue   ← Presentación (Dumb Component)
│   │   └── BaseModal.vue   ← Reutilización con Slots
│   ├── composables/
│   │   └── useLibros.js    ← El "cerebro" de la lógica
│   ├── App.vue
│   └── ...
```

---

## Desarrollo paso a paso

### Etapa 1: El Componente de Presentación (20 min)

**Explicación "Senior":** *"Un componente no debería saber de dónde vienen los datos, solo cómo mostrarlos. Vamos a pasarle el libro por `props` y avisar que queremos reservar con un `emit`. Si intentás modificar una prop desde el hijo, Vue te va a sacar a patadas: el flujo es unidireccional."*

**Nuevo archivo: `src/components/LibroCard.vue`**

```vue
<template>
  <div class="card">
    <h3>{{ libro.titulo }}</h3>
    <p>Autor: {{ libro.autor }}</p>
    <slot name="badge"></slot> <button 
      @click="$emit('intentar-reserva', libro.id)" 
      :disabled="libro.stock === 0"
    >
      {{ libro.stock > 0 ? 'Reservar' : 'Sin Stock' }}
    </button>
  </div>
</template>

<script setup>
// Definimos qué entra (Props)
defineProps({
  libro: {
    type: Object,
    required: true
  }
})

// Definimos qué sale (Emits)
defineEmits(['intentar-reserva'])
</script>

<style scoped>
.card { border: 1px solid #ccc; padding: 1rem; margin: 0.5rem; border-radius: 8px; }
</style>
```

---

### Etapa 2: Slots - Flexibilidad total (15 min)

**Explicación:** *"A veces no sabés qué vas a meter adentro de un componente (un texto, un icono, otro componente). Para eso están los Slots. Es como dejar un 'agujero' en el HTML para que el padre lo llene."*

**Modificar `LibroCard.vue` agregando el slot arriba del botón:**
```vue
<div v-if="libro.stock < 3" class="alerta-stock">
  <slot name="footer">⚠️ ¡Últimas unidades!</slot>
</div>
```

---

### Etapa 3: El Composable - El cerebro (25 min)

**Explicación:** *"¿Por qué la lógica de reservar tiene que estar pegada al HTML? Si mañana queremos usar la misma lógica en una app de mobile, estamos al horno. Vamos a encapsular el estado y las funciones en un Composable."*

**Crear `src/composables/useLibros.js`**

```javascript
import { ref, computed } from 'vue'

export function useLibros() {
  const libros = ref([
    { id: 1, titulo: 'El Quijote', autor: 'Cervantes', stock: 5 },
    { id: 2, titulo: '1984', autor: 'Orwell', stock: 2 }
  ])

  const totalStock = computed(() => 
    libros.value.reduce((acc, libro) => acc + libro.stock, 0)
  )

  function reservarLibro(id) {
    const libro = libros.value.find(l => l.id === id)
    if (libro && libro.stock > 0) {
      libro.stock--
    }
  }

  // Exponemos solo lo necesario
  return {
    libros,
    totalStock,
    reservarLibro
  }
}
```

---

### Etapa 4: Integración en el Padre (15 min)

**Refactorizar `App.vue` (o `CatalogoLibros.vue`):**

```vue
<template>
  <main>
    <h1>Biblioteca (Stock total: {{ totalStock }})</h1>
    
    <div class="grid">
      <LibroCard 
        v-for="l in libros" 
        :key="l.id" 
        :libro="l"
        @intentar-reserva="reservarLibro"
      >
        <template #footer v-if="l.stock === 1">
          <span class="urgente">¡CORRE QUE SE ACABA!</span>
        </template>
      </LibroCard>
    </div>
  </main>
</template>

<script setup>
import LibroCard from './components/LibroCard.vue'
import { useLibros } from './composables/useLibros'

const { libros, totalStock, reservarLibro } = useLibros()
</script>
```

---

## Preguntas para disparar debate

1. **¿Por qué no puedo hacer `props.libro.stock--` adentro de `LibroCard`?**
   *"Porque rompés la 'Single Source of Truth'. El hijo no manda, el hijo obedece y avisa."*

2. **¿Cuál es la diferencia entre un Composable y un archivo `.js` común?**
   *"El Composable usa la Reactivity API (`ref`, `computed`). Es código de JS que Vue 'entiende' y puede reaccionar a sus cambios."*

3. **¿Cuándo un componente es 'demasiado grande'?**
   *"Si tenés que scrollear tres veces para ver el final del `<script setup>`, ya te pasaste de rosca. Ponete las pilas y dividilo."*

---

## Errores comunes (Para que no se manden macanas)

| Error | Consecuencia | Solución |
|-------|---------|----------|
| Prop Mutation | Warning gigante en consola y estado inconsistente. | Usar `emit` para que el padre cambie el dato. |
| Olvidar exportar en Composable | `undefined` al intentar usar la función. | Siempre retornar un objeto con las variables y funciones. |
| No usar `v-bind` (`:`) | Pasás un string literal "l" en vez del objeto libro. | Usar `:libro="l"` para pasar la variable real. |

---

## Recursos adicionales
- [Vue Patterns: Props & Emits](https://vuejs.org/guide/components/props.html)
- [Mastering Composables](https://vueschool.io/articles/vuejs-tutorials/what-is-a-vue-js-composable/)