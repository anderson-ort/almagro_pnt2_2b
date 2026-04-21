# Guía práctica para la Clase 1: Mi Biblioteca Digital con Vue 3

## Resumen del proyecto

Construiremos una **aplicación de catálogo de libros** que permita:
- Visualizar lista de libros con stock
- Buscar por título
- Reservar ejemplares (con límite y validaciones)
- Ver feedback visual condicional

Este proyecto cubre **todos los conceptos clave** de la clase: POC→MVP, setup con Vite, Composition API, reactividad, directivas y flujo Git+PR.

---

## Objetivos de aprendizaje por etapa

| Etapa | Tiempo | Conceptos | Entregable |
|-------|--------|-----------|-------------|
| 1. Setup | 10 min | Vite, estructura SFC | Proyecto funcionando |
| 2. Componente base | 15 min | `ref()`, `v-for`, `:key`, eventos | Lista de libros reactiva |
| 3. Filtro | 10 min | `v-model`, `computed()` | Búsqueda en tiempo real |
| 4. Condicionales | 5 min | `v-if`/`v-else` | Mensaje "sin resultados" |
| 5. Contador reservas | 10 min | Estado compartido, validación | Límite de 3 reservas |
| 6. PR final | 10 min | Git flow, descripción PR | Pull request creado |

---

## Estructura final del proyecto

```
mi-biblioteca/
├── index.html
├── package.json
├── src/
│   ├── main.js
│   ├── App.vue
│   └── components/
│       └── CatalogoLibros.vue   ← todo el código estará aquí
```

---

## Desarrollo paso a paso

### Etapa 1: Setup (10 min)

**Comandos (todos ejecutan en vivo):**
```bash
npm create vite@latest mi-biblioteca -- --template vue
cd mi-biblioteca
npm install
npm run dev
```

**Explicación clave:**  
*"Vite es un bundler ultrarrápido. El template `vue` ya viene con `<script setup>` que es la forma moderna de escribir Vue. Abran http://localhost:5173"*

**Limpieza inicial:**
- Borrar `src/components/HelloWorld.vue`
- Reemplazar `src/App.vue` con:

```vue
<template>
  <div>
    <h1>Mi Biblioteca Digital</h1>
    <CatalogoLibros />
  </div>
</template>

<script setup>
import CatalogoLibros from './components/CatalogoLibros.vue'
</script>
```

- Crear `src/components/CatalogoLibros.vue` (vacío por ahora)

---

### Etapa 2: Componente base con lista de libros (15 min)

**Explicación previa:**  
*"`ref()` convierte una variable en reactiva. En el script usamos `.value`, pero en el template Vue lo desempaqueta automáticamente."*

**Código completo de `CatalogoLibros.vue` (versión inicial):**

```vue
<template>
  <div>
    <h2>Catálogo de libros</h2>
    <ul>
      <li v-for="libro in libros" :key="libro.id">
        <strong>{{ libro.titulo }}</strong> - {{ libro.autor }}
        <span :class="{ 'stock-bajo': libro.stock < 3 }">
          (Stock: {{ libro.stock }})
        </span>
        <button @click="reservar(libro.id)" :disabled="libro.stock === 0">
          Reservar
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const libros = ref([
  { id: 1, titulo: 'El Quijote', autor: 'Cervantes', stock: 5 },
  { id: 2, titulo: 'Cien años de soledad', autor: 'García Márquez', stock: 2 },
  { id: 3, titulo: '1984', autor: 'Orwell', stock: 0 },
])

function reservar(id) {
  const libro = libros.value.find(l => l.id === id)
  if (libro && libro.stock > 0) {
    libro.stock--
    alert(`Reservaste "${libro.titulo}". Quedan ${libro.stock} ejemplares.`)
  }
}
</script>

<style scoped>
.stock-bajo {
  color: #e67e22;
  font-weight: bold;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

**Preguntas para debate mientras codean:**
- *¿Por qué `libros` es un `ref` y no una variable normal?* (Para que Vue detecte cambios en el stock)
- *¿Qué pasa si omitimos `:key` en `v-for`?* (Problemas de rendimiento y estado)
- *¿Por qué en `:class` usamos objeto y no string?* (Para aplicar clase condicionalmente)

---

### Etapa 3: Filtro de búsqueda (10 min)

**Agregar input antes del `<ul>`:**
```vue
<input 
  type="text" 
  v-model="filtro" 
  placeholder="Buscar por título..." 
  class="filtro-input"
/>
```

**Agregar en `<script setup>`:**
```js
import { ref, computed } from 'vue'  // ← agregamos computed

const filtro = ref('')

const librosFiltrados = computed(() => {
  if (!filtro.value) return libros.value
  const termino = filtro.value.toLowerCase()
  return libros.value.filter(libro => 
    libro.titulo.toLowerCase().includes(termino)
  )
})
```

**Modificar el `v-for`:**
```vue
<li v-for="libro in librosFiltrados" :key="libro.id">
```

**Explicación:**  
*"`computed` es como una fórmula de Excel: solo se recalcula cuando cambia `filtro` o `libros`. Es más eficiente que una función normal."*

---

### Etapa 4: Mensaje condicional (5 min)

**Reemplazar el `<ul>` con:**
```vue
<p v-if="librosFiltrados.length === 0" class="sin-resultados">
  No se encontraron libros con "{{ filtro }}"
</p>
<ul v-else>
  <!-- mismo contenido del li -->
</ul>
```

**Agregar estilo:**
```css
.sin-resultados {
  padding: 1rem;
  background: #fef9e7;
  border-radius: 8px;
  color: #e67e22;
}
.filtro-input {
  padding: 8px;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 300px;
}
```

---

### Etapa 5: Contador de reservas con límite (10 min)

**Agregar estado del contador (después de `const filtro`):**
```js
const reservasUsuario = ref(0)
const MAX_RESERVAS = 3
```

**Modificar la función `reservar`:**
```js
function reservar(id) {
  // Validar límite
  if (reservasUsuario.value >= MAX_RESERVAS) {
    alert(`Solo puedes reservar hasta ${MAX_RESERVAS} libros.`)
    return
  }
  
  const libro = libros.value.find(l => l.id === id)
  if (libro && libro.stock > 0) {
    libro.stock--
    reservasUsuario.value++
    alert(`Reservaste "${libro.titulo}". Reservas activas: ${reservasUsuario.value}`)
  }
}
```

**Mostrar el contador en el template (arriba del input):**
```vue
<div class="reservas-info">
  <p>Tus reservas: <strong>{{ reservasUsuario }}</strong> / {{ MAX_RESERVAS }}</p>
  <p v-if="reservasUsuario === MAX_RESERVAS" class="max-alert">
    ¡Llegaste al máximo de reservas!
  </p>
</div>
```

**Estilos adicionales:**
```css
.reservas-info {
  background: #e8f8f5;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.max-alert {
  color: #c0392b;
  font-weight: bold;
}
```

---

### Etapa 6: PR y cierre (10 min)

**Comandos Git (todos ejecutan):**
```bash
git init
git add .
git commit -m "feat: MVP catálogo de libros con reservas y búsqueda"

# Conectar con repositorio remoto (el docente provee URL)
git remote add origin https://github.com/tu-usuario/mi-biblioteca.git
git branch -M main
git push -u origin main

# Crear rama para el PR
git checkout -b feat/mvp-biblioteca
# (hacer un cambio pequeño, ej: agregar un console.log o mejorar estilo)
git add .
git commit -m "feat: mejora visual y mensajes de feedback"
git push origin feat/mvp-biblioteca
```

**Plantilla para la descripción del PR:**
```markdown
## ¿Qué hace este PR?
Implementa el MVP de "Mi Biblioteca Digital" con:
- Listado de libros reactivo
- Búsqueda por título
- Reserva con límite de 3 ejemplares
- Feedback visual (stock bajo, sin resultados, máximo alcanzado)

## ¿Por qué?
Cumple con los requisitos base del cliente para validar la idea.

## Checklist
- [x] Funciona localmente
- [x] Sin errores en consola
- [x] Respeta límite de reservas
```

---

## Preguntas para cerrar la clase

1. **¿Esto es un MVP o un POC?**  
   *"Es un MVP porque es usable y entrega valor (reservar libros). Un POC solo probaría que Vue puede mostrar una lista."*

2. **¿Qué cambiarían si el cliente pide pagos online?**  
   *"Sería V2. Implica backend, pasarela de pagos, autenticación - mucho más complejo."*

3. **¿Dónde está la reactividad "automágica" de Vue?**  
   *"En que solo modificamos `libro.stock--` y el DOM se actualiza solo. En React tendríamos que setear estado."*

4. **¿Qué valor aporta el desarrollador si la IA genera este código?**  
   *"Decidir el límite de reservas, la experiencia de usuario, validar requisitos, y saber integrarlo con un backend real."*

---

## Errores comunes y cómo solucionarlos

| Error | Síntoma | Solución |
|-------|---------|----------|
| Olvidar `.value` | El contador no aumenta | En el script usar `reservasUsuario.value++` |
| `v-for` sin `:key` | El orden de los elementos se rompe al filtrar | Agregar `:key="libro.id"` |
| Mutar `computed` | Error en consola | Los `computed` son solo lectura |
| Usar `reactive` con primitivo | Pierde reactividad | Usar `ref` para números/strings |

---

## Extensiones posibles (si sobra tiempo)

1. **Persistir reservas en localStorage** - Mostrar `watch` effect
2. **Botón para resetear reservas** - Refuerza eventos
3. **Mostrar total de libros en stock** - Otro `computed`
4. **Extraer lógica a composable** - `useReservas.js`

---

## Recursos

- [Documentación oficial de Vue - Reactividad](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Playground interactivo](https://play.vuejs.org/) - para experimentar
- [Cheatsheet de Vue 3](https://vuejs.org/tutorial/#step-2)
