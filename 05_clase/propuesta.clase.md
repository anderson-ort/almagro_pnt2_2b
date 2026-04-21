### Card de pedido: Manager → Dev

Un componente `CardTarea` que:
- Reciba por `props` los datos de la tarea (desde el Manager).
- Lance un evento por `emit` cuando el Dev hace clic en “Aceptar tarea”.
- Permita al Manager pasar notas extra por `slot`.

***

### 1. Componente hijo: `CardTarea.vue`

```vue
<script setup>
// 1. PROPS: datos de la tarea (enviados por el Manager)
defineProps({
  titulo: {
    type: String,
    required: true
  },
  prioridad: {
    type: String,
    default: 'baja'
  }
})

// 2. EMIT: notificar al Manager cuando el Dev acepta la tarea
const emit = defineEmits(['tareaAceptada'])

function aceptarTarea() {
  emit('tareaAceptada', {
    titulo: titulo,
    prioridad: prioridad
  })
}
</script>

<template>
  <div class="card-tarea">
    <h3>{{ titulo }}</h3>
    <p>Prioridad: {{ prioridad }}</p>

    <button @click="aceptarTarea">Aceptar tarea</button>

    <!-- 3. SLOT: el Manager puede agregar notas extra -->
    <div class="notas">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card-tarea {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  margin: 10px 0;
  background-color: #f0f7ff;
}
</style>
```

***

### 2. Uso en el “Manager” (App.vue o componente de la clase)

```vue
<script setup>
import CardTarea from './CardTarea.vue'

// Cuando el Dev acepta la tarea, el Manager lo sabe
function manejarTareaAceptada(tarea) {
  console.log('Tarea aceptada por el Dev:', tarea)
}
</script>

<template>
  <div>
    <h2>Panel de tareas (Manager)</h2>

    <CardTarea
      titulo="Arreglar formulario de login"
      prioridad="alta"
      @tareaAceptada="manejarTareaAceptada"
    >
      <!-- Notas del Manager al Dev -->
      <p class="nota">Prioridad: debe ir a producción hoy.</p>
    </CardTarea>

    <CardTarea
      titulo="Mejorar performance de listado"
      prioridad="media"
      @tareaAceptada="manejarTareaAceptada"
    >
      <p class="nota">Puede ser mañana, pero antes del viernes.</p>
    </CardTarea>
  </div>
</template>
```

***

### Para explicar en clase

- **Props**: `titulo` y `prioridad` = datos que el Manager pasa al Dev.
- **Emit**: `@tareaAceptada` = el Dev “levanta la mano” y dice que acepta la tarea.
- **Slot**: las `<p class="nota">` son notas adicionales del Manager que el Dev puede ver dentro de la tarjeta.
