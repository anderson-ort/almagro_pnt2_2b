# Guía Teórico-Práctica para la Clase 2: Arquitectura de Componentes y Composables

## Introducción Conceptual

En la clase anterior construimos un prototipo funcional en un solo archivo. Sin embargo, para que una aplicación sea escalable y mantenible, debemos aplicar el **Principio de Responsabilidad Única (SRP)**. En esta sesión, aprenderemos a separar la interfaz de usuario de la lógica de negocio.

### Objetivos de aprendizaje
1.  **Componentización**: Dividir la UI en piezas atómicas y reutilizables.
2.  **Comunicación Inter-componente**: Implementar el flujo de datos unidireccional (Props y Emits).
3.  **Distribución de Contenido**: Utilizar Slots para crear componentes flexibles.
4.  **Abstracción de Lógica**: Extraer la reactividad a funciones externas mediante Composables.

---

## Fundamentos Teóricos

### 1. El Flujo de Datos Unidireccional
En Vue, los datos fluyen de arriba hacia abajo (del padre al hijo) mediante **Props**. Los eventos fluyen de abajo hacia arriba (del hijo al padre) mediante **Emits**.
* **Props**: Son atributos de solo lectura. Un componente hijo nunca debe modificar una prop directamente para evitar efectos secundarios impredecibles.
* **Emits**: Son notificaciones que el hijo envía al padre para solicitar un cambio de estado.

### 2. Componentes de Presentación vs. Contenedores
* **Presentación (Dumb Components)**: Se encargan exclusivamente de cómo se ven las cosas. Reciben datos y emiten eventos. No conocen la lógica de la base de datos o APIs.
* **Contenedores (Smart Components)**: Gestionan el estado, coordinan otros componentes y se comunican con los servicios de lógica.

### 3. Composables (Pattern: Composition Function)
Un Composable es una función que aprovecha la Composition API de Vue para encapsular y reutilizar lógica reactiva. A diferencia de las funciones de utilidad comunes, un Composable mantiene un estado interno que Vue puede rastrear.

---

## Desarrollo de la Clase por Etapas

### Etapa 1: Creación del Componente de Presentación (LibroCard)

El primer paso es extraer la visualización de un libro individual a un componente propio para desacoplarlo de la lista principal.

**Definición de la interfaz del componente (`src/components/LibroCard.vue`):**

```vue
<script setup>
// Definición de Props: Entrada de datos
const props = defineProps({
  libro: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'titulo' in value && 'stock' in value
    }
  }
})

// Definición de Emits: Salida de eventos
const emit = defineEmits(['reservar'])

function manejarClick() {
  emit('reservar', props.libro.id)
}
</script>

<template>
  <div class="libro-card">
    <h3>{{ libro.titulo }}</h3>
    <p>Autor: {{ libro.autor }}</p>
    <p :class="{ 'alerta': libro.stock < 3 }">Stock: {{ libro.stock }}</p>
    
    <button 
      @click="manejarClick" 
      :disabled="libro.stock === 0"
    >
      Confirmar Reserva
    </button>
  </div>
</template>

<style scoped>
.libro-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.alerta {
  color: red;
  font-weight: bold;
}
</style>
```

---

### Etapa 2: Flexibilidad mediante Slots

A veces necesitamos que el componente padre decida qué contenido mostrar en ciertas áreas del componente hijo sin usar props de texto.

**Modificación de `LibroCard.vue` para incluir Slots:**

```vue
<template>
  <div class="libro-card">
    <div class="header">
      <slot name="titulo">
        <h3>{{ libro.titulo }}</h3> </slot>
    </div>

    <slot name="detalles">
      <p>Autor: {{ libro.autor }}</p>
    </slot>

    <button @click="manejarClick" :disabled="libro.stock === 0">
      Reservar
    </button>
  </div>
</template>
```

---

### Etapa 3: Abstracción de Lógica en Composables

Para evitar que nuestro componente principal crezca demasiado, extraemos la lógica de gestión de libros a un archivo externo. Esto permite que la lógica sea testeable y reutilizable.

**Creación del Composable (`src/composables/useLibros.js`):**

```javascript
import { ref, computed } from 'vue'

export function useLibros() {
  // Estado privado
  const libros = ref([
    { id: 1, titulo: 'Clean Code', autor: 'Robert Martin', stock: 5 },
    { id: 2, titulo: 'Refactoring', autor: 'Martin Fowler', stock: 2 },
    { id: 3, titulo: 'The Pragmatic Programmer', autor: 'Andrew Hunt', stock: 1 }
  ])

  // Lógica computada
  const hayStockGlobal = computed(() => {
    return libros.value.some(libro => libro.stock > 0)
  })

  // Acciones (funciones que modifican el estado)
  function disminuirStock(id) {
    const libro = libros.value.find(l => l.id === id)
    if (libro && libro.stock > 0) {
      libro.stock--
    }
  }

  // Interfaz pública del composable
  return {
    libros,
    hayStockGlobal,
    disminuirStock
  }
}
```

---

### Etapa 4: Integración y Refactorización Final

Finalmente, conectamos todas las piezas en el componente principal.

**Actualización de `src/App.vue`:**

```vue
<script setup>
import LibroCard from './components/LibroCard.vue'
import { useLibros } from './composables/useLibros'

const { libros, hayStockGlobal, disminuirStock } = useLibros()
</script>

<template>
  <div class="container">
    <h1>Gestión de Biblioteca</h1>
    <p v-if="!hayStockGlobal">Atención: No hay stock disponible en el catálogo.</p>
    
    <div class="grid">
      <LibroCard 
        v-for="libro in libros" 
        :key="libro.id" 
        :libro="libro"
        @reservar="disminuirStock"
      >
        <template #titulo>
          <h3 class="highlight">{{ libro.titulo }}</h3>
        </template>
      </LibroCard>
    </div>
  </div>
</template>
```

---

## Preguntas de Evaluación Teórica

1.  **Diferencia entre Prop y Atributo**: ¿Por qué las props se declaran explícitamente en el script?
2.  **Encapsulamiento**: ¿Cuáles son las ventajas de tener la función `disminuirStock` en un Composable en lugar de tenerla directamente en el componente?
3.  **Ciclo de vida de los datos**: Si el componente hijo intenta modificar la propiedad `libro.stock` directamente, ¿qué advertencia mostrará Vue en la consola y por qué es una mala práctica?

---

## Errores Comunes y Soluciones

| Error Conceptual | Consecuencia | Solución Correcta |
|:---|:---|:---|
| Mutar Props directamente | El estado del padre se vuelve inconsistente. | Emitir un evento para que el padre realice el cambio. |
| No usar `.value` en Composables | Se pierde la reactividad o se producen errores de referencia. | Recordar que en el script de los composables trabajamos con objetos Ref. |
| Sobrecargar componentes de presentación | Dificulta el testeo unitario y la reutilización. | Extraer la lógica compleja a funciones o composables independientes. |