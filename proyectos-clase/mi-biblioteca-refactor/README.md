# Mi Biblioteca Refactor - Arquitectura de Componentes

## Flujo de Datos

```
┌──────────────────┐
│  useLibros.js    │ ← Fuente única de verdad
│  (Composable)    │
│                  │
│  • libros        │
│  • filtro        │
│  • reservasUsuario
│  • MAX_RESERVAS  │
│  • reservarLibro │
└────────┬─────────┘
         │
         │ retorna estado y métodos
         ↓
    ┌────────────┐
    │  App.vue   │ ← Orquestador principal
    │            │   • Define mostrarError
    │            │   • Define handleReserva(id)
    └─────┬──────┘
          │
          │ Pasa: mode, reservasUsuario, maxReservas
          │ Escucha: @reservar
          ↓
    ┌─────────────────┐
    │CatalogoLibros.vue│ ← Capa intermedia
    │                 │
    │ Props:          │
    │  • mode         │
    │  • reservasUsuario
    │  • maxReservas  │
    │                 │
    │ Emits:          │
    │  • reservar(id) │
    └────────┬────────┘
             │
             │ Renderiza múltiples
             │ :libro="l"
             ↓
    ┌─────────────────┐
    │  LibroCard.vue  │ ← Componente de presentación
    │                 │
    │ Props:          │
    │  • libro        │
    │                 │
    │ Emits:          │
    │  • intentar-reserva(id)
    │                 │
    │ Slots:          │
    │  • #etiqueta    │
    └─────────────────┘

           ┌─────────────────┐
           │  BaseModal.vue  │ ← Demo de slots
           │                 │
           │ Slots:          │
           │  • #header      │
           │  • default      │
           └─────────────────┘
```

## Props, Emits y Slots

### Props

#### App.vue → CatalogoLibros.vue

```vue
<CatalogoLibros
  mode="grid"
  :reservasUsuario="reservasUsuario"
  :maxReservas="MAX_RESERVAS"
  @reservar="handleReserva"
/>
```

**Props recibidas por CatalogoLibros.vue:**

```javascript
defineProps({
  mode: { type: String, default: 'grid' },
  showStats: { type: Boolean, default: true },
  showFilter: { type: Boolean, default: true },
  reservasUsuario: { type: Object, required: true },
  maxReservas: { type: Number, required: true }
})
```

#### CatalogoLibros.vue → LibroCard.vue

```vue
<LibroCard
  v-for="l in librosFiltrados"
  :key="l.id"
  :libro="l"
  @intentar-reserva="$emit('reservar', l.id)"
>
  <template #etiqueta v-if="l.stock < 3 && l.stock > 0">
    <span class="catalogo-warning">¡Casi agotado!</span>
  </template>
</LibroCard>
```

**Props recibidas por LibroCard.vue:**

```javascript
defineProps({
  libro: { type: Object, required: true }
})
```

### Emits

#### LibroCard.vue → CatalogoLibros.vue

```vue
<template>
  <button @click="$emit('intentar-reserva', libro.id)" :disabled="libro.stock === 0">
    {{ libro.stock > 0 ? 'Reservar' : 'Sin Stock' }}
  </button>
</template>

<script setup>
defineEmits(['intentar-reserva'])
</script>
```

**Evento emitido:** `intentar-reserva` con payload `libro.id`

#### CatalogoLibros.vue → App.vue

```vue
<!-- En modo grid -->
<LibroCard
  @intentar-reserva="$emit('reservar', l.id)"
/>

<!-- En modo lista -->
<button @click="$emit('reservar', l.id)" :disabled="l.stock === 0">Reservar</button>
```

```javascript
defineEmits(['reservar'])
```

**Evento emitido:** `reservar` con payload `libro.id` (transforma el evento de LibroCard)

#### App.vue escucha el evento

```vue
<CatalogoLibros
  mode="grid"
  :reservasUsuario="reservasUsuario"
  :maxReservas="MAX_RESERVAS"
  @reservar="handleReserva"
/>
```

### Slots

#### BaseModal.vue define los slots

```vue
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header>
        <slot name="header">
          <h3>Aviso</h3>
        </slot>
        <button @click="$emit('close')">X</button>
      </header>

      <section class="modal-body">
        <slot></slot> <!-- Slot por defecto -->
      </section>
    </div>
  </div>
</template>
```

**Slots disponibles:**
- `header` (named slot) – Contenido personalizable para el encabezado
- `default` – Contenido principal del modal

#### App.vue utiliza los slots

```vue
<BaseModal v-if="mostrarError" @close="mostrarError = false">
  <template #header>
    <h3 style="color: red">¡Límite alcanzado!</h3>
  </template>
  <p>Ya tenés {{ MAX_RESERVAS }} reservas activas. Dejá algo para el resto, estimado.</p>
</BaseModal>
```

## Composable (useLibros.js)

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

**Estado gestionado:**
- `libros` – Lista de libros (reactiva)
- `filtro` – Texto de búsqueda (reactivo)
- `reservasUsuario` – Contador de reservas (reactivo)
- `MAX_RESERVAS` – Constante (3)
- `librosFiltrados` – Computed based en filtro

**Función principal:**
- `reservarLibro(id)` – Valida y ejecuta la reserva, retorna `true`/`false`

## Secuencia de Reserva

1. **Usuario hace clic** en el botón "Reservar" dentro de `LibroCard.vue` (línea 8)

2. **LibroCard.vue emite** `intentar-reserva` con el `libro.id`:
   ```javascript
   $emit('intentar-reserva', libro.id)
   ```

3. **CatalogoLibros.vue captura** el evento y lo transforma emitiendo `reservar`:
   ```vue
   <LibroCard @intentar-reserva="$emit('reservar', l.id)" />
   ```

4. **App.vue escucha** el evento `@reservar` y ejecuta `handleReserva(id)`

5. **handleReserva** (App.vue:25) llama a:
   ```javascript
   const exito = reservarLibro(id)
   ```

6. **reservarLibro** (useLibros.js:17) realiza validaciones:
   - Verifica `reservasUsuario >= MAX_RESERVAS` → retorna `false`
   - Busca el libro por `id`
   - Verifica `libro.stock > 0` → si no, retorna `false`

7. **Si válido:**
   - Decrementa `libro.stock`
   - Incrementa `reservasUsuario`
   - Retorna `true`

8. **Si NO válido** (límite alcanzado):
   - `handleReserva` detecta `!exito && reservasUsuario.value >= MAX_RESERVAS`
   - Establece `mostrarError.value = true`

9. **BaseModal.vue aparece** gracias a `v-if="mostrarError"` en App.vue

10. **Usuario cierra el modal** → emite `close` → `mostrarError = false`

---

**Patrones utilizados:**
- **Composable pattern** – Lógica de estado centralizada en `useLibros.js`
- **Event bubbling** – Componentes hijo → padre mediante `$emit`
- **Props down, Events up** – Flujo unidireccional de datos
- **Slots** – Personalización de contenido en BaseModal
- **Computed properties** – Filtrado reactivo
