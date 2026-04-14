# Clase 1 — Kickoff y Vue Core
**Calendario:** Vue KickOff: POC, MVP, PRs y primeros pasos con Composition API


## Guía para el Docente

### Objetivo de la clase
Dos objetivos en una sola sesión: establecer el "lenguaje común" del módulo (POC, MVP, PR, análisis de negocio) y tener un proyecto Vue 3 funcionando con reactividad básica antes de terminar la clase.

La primera mitad es conceptual y rápida — no profundizar. La segunda mitad es práctica e intensa.

### Flujo sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0–5 min | Presentación del módulo. Mostrar el resultado final esperado: un proyecto con rutas, estado global, tests y deploy automático. |
| 5–20 min | POC vs MVP vs Producto con ejemplos reales. Flujo básico de Git + PR: rama → commit → push → PR. Mostrar un PR real en GitHub. |
| 20–28 min | Análisis de negocio express: ejercicio rápido de clasificar funcionalidades (ver ejercicio 1). |
| 28–38 min | Crear el proyecto con Vite en vivo, todos siguiendo. Instalar Volar. Recorrer la estructura de carpetas. |
| 38–55 min | Anatomía de un SFC. `ref()`, `reactive()`, `computed()`. Codear en vivo el componente contador. |
| 55–70 min | Directivas: `v-bind`, `v-on`, `v-if`, `v-for`, `v-model`. Un ejemplo de cada una sobre el mismo componente. |
| 70–82 min | Actividad práctica: ejercicio 2. Usar OpenCode/Antigravity para generar el boilerplate y leerlo línea por línea. |
| 82–90 min | Abrir el primer PR del módulo: `feat/setup-inicial`. Cierre y adelanto de clase 2. |

### Tips para el docente
- El análisis de negocio tiene que ser rápido — 8 minutos máximo. El objetivo es introducir el vocabulario, no agotarlo.
- **Codear en vivo sin copiar-pegar.** Los errores que aparecen en el proceso son parte del aprendizaje.
- Al introducir la IA, hacerla generar el boilerplate del componente y luego leer cada línea en voz alta con el grupo. La pregunta recurrente: "¿por qué la IA escribió esto así?"
- Si el grupo ya conoce algún framework (React, Angular), aprovechar los contrastes: `ref()` vs `useState`, `<script setup>` vs JSX.

### Conceptos clave para reforzar
- **POC ≠ MVP ≠ Producto**: etapas con objetivos distintos, no versiones del mismo entregable.
- **Un PR es comunicación técnica**, no solo código.
- `<script setup>` no es magia: es azúcar sintáctico sobre `setup()`. Lo que se define adentro está automáticamente disponible en el template.
- La reactividad de Vue es automática: no hay que llamar a ningún método para que el DOM se actualice.

---

## Ejercicios / Actividades

### Ejercicio 1 — Clasificar funcionalidades (8 min, grupal rápido)

Dado este enunciado:
> *"El dueño de una librería quiere que sus clientes puedan ver el catálogo de libros y reservar uno para retirarlo en tienda."*

Clasificar en voz alta, sin escribir nada todavía:

| Funcionalidad | POC / MVP / V2 |
|---|---|
| Verificar que existe una API de libros y responde | |
| El usuario puede ver el catálogo | |
| El usuario puede reservar un libro | |
| El usuario puede pagar online | |
| El dueño ve todas las reservas en un panel | |
| Notificaciones por email al reservar | |

Objetivo: que surja la discusión, no que haya una respuesta "correcta".

---

### Ejercicio 2 — Setup y componente reactivo (22 min, individual)

**Paso 1:** Crear el proyecto:
```bash
npm create vite@latest mi-proyecto-vue -- --template vue
cd mi-proyecto-vue
npm install
npm run dev
```

**Paso 2:** Limpiar `App.vue` y borrar `HelloWorld.vue`.

**Paso 3:** Pedirle a la IA este componente con el prompt:
> *"Creá un componente Vue 3 con script setup llamado Contador.vue. Debe tener un contador con ref que muestre el valor, un botón para incrementar y uno para decrementar. No puede bajar de 0 ni superar 10. Si supera 7, el número se muestra en rojo. Si llega a 10, mostrar el mensaje '¡Máximo alcanzado!'."*

**Paso 4:** Leer el código generado línea por línea y responder en un comentario en el archivo:
```js
// ref() se usa acá porque...
// computed() se usa acá porque...
// v-if se usa acá porque...
```

**Paso 5:** Crear rama `feat/setup-inicial`, hacer commit y abrir PR con una descripción breve de qué incluye.

---

### Ejercicio 3 — Directivas en práctica (15 min, individual)

Crear `ListaTareas.vue` que:
- Tenga un array de 3 tareas hardcodeadas con `ref`
- Las renderice con `v-for` (con `:key`)
- Muestre "No hay tareas" con `v-if` cuando el array está vacío
- Cada tarea tenga un checkbox con `v-model` para marcarla completada
- Las tareas completadas tengan `text-decoration: line-through` via `:class`

---

## Código de Ejemplo

### Plantilla de análisis de requerimientos

```markdown
# Análisis de Requerimientos

## Contexto
[Descripción del problema]

## Preguntas al cliente (antes de escribir código)
1. 
2. 
3. 

## MVP — Funcionalidades incluidas
| # | Funcionalidad | Criterio de aceptación |
|---|---|---|
| 1 | | El usuario puede... |

## Fuera del MVP
| # | Funcionalidad | Motivo |
|---|---|---|
| 1 | | Complejidad alta, bajo impacto inicial |
```

### Plantilla de descripción de PR

```markdown
## ¿Qué hace este PR?
Breve descripción en 1-3 oraciones.

## ¿Por qué?
Requerimiento o contexto que lo justifica.

## Checklist
- [ ] Funciona localmente
- [ ] Sin console.log olvidados
- [ ] README actualizado si corresponde
```

### Vue 3 Core: lo esencial

```vue
<template>
  <!-- Interpolación -->
  <h1>{{ titulo }}</h1>

  <!-- v-bind (shorthand :) -->
  <img :src="imagen" :alt="titulo" />
  <button :disabled="cargando">Enviar</button>
  <p :class="{ rojo: contador > 7, negrita: esImportante }">{{ contador }}</p>

  <!-- v-on (shorthand @) -->
  <button @click="incrementar">+</button>
  <input @keyup.enter="buscar" />

  <!-- v-if / v-else -->
  <p v-if="estaVacio">Sin resultados</p>
  <ul v-else>
    <li v-for="item in lista" :key="item.id">{{ item.nombre }}</li>
  </ul>

  <!-- v-model: two-way binding -->
  <input v-model="nombre" />
  <p>Hola, {{ nombre }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

// ref: primitivos (string, number, boolean)
// Leer/escribir con .value en el script, sin .value en el template
const contador = ref(0)
const nombre = ref('')
const cargando = ref(false)
const esImportante = ref(true)
const imagen = ref('/logo.png')
const titulo = ref('Mi App')

// computed: valor derivado, se recalcula solo cuando cambia su dependencia
const estaVacio = computed(() => lista.value.length === 0)

const lista = ref([
  { id: 1, nombre: 'Vue' },
  { id: 2, nombre: 'Vite' },
])

function incrementar() {
  if (contador.value < 10) contador.value++
}

function buscar() {
  console.log('buscando:', nombre.value)
}
</script>

<style scoped>
.rojo    { color: #e53935; }
.negrita { font-weight: bold; }
</style>
```

### Options API vs Composition API (referencia rápida)

```vue
<!-- OPTIONS API — solo para reconocer código legacy -->
<script>
export default {
  data() { return { contador: 0 } },
  computed: { doble() { return this.contador * 2 } },
  methods:  { incrementar() { this.contador++ } }
}
</script>

<!-- COMPOSITION API — lo que usamos en este módulo -->
<script setup>
import { ref, computed } from 'vue'
const contador = ref(0)
const doble    = computed(() => contador.value * 2)
function incrementar() { contador.value++ }
</script>
```

### Comandos Git del flujo básico

```bash
git clone https://github.com/usuario/mi-proyecto-vue.git
cd mi-proyecto-vue

git checkout -b feat/setup-inicial
# ... trabajar ...
git add .
git commit -m "feat: setup inicial con Vite y componente contador"
git push origin feat/setup-inicial
# Abrir PR desde GitHub
```

---

## Preguntas para Disparar Debate

1. **¿Qué diferencia hay entre un POC y un prototipo de diseño?** ¿Uno reemplaza al otro o tienen propósitos distintos?

2. **¿Por qué Vue necesita `ref()` para hacer reactivo un número?** ¿No sería más simple que cualquier variable sea automáticamente reactiva?

3. **La IA generó el componente en 10 segundos.** ¿Qué valor aportás vos como desarrollador si la IA puede escribir el código? ¿Qué cosas no puede hacer la IA en este contexto?

4. **Un PR bien descrito vs. un PR con título "cambios".** ¿Qué pasa en un equipo de 10 personas si todos abren PRs sin descripción?

5. **Si tuvieran que lanzar una app en 2 semanas**, ¿qué dejarían en el MVP y qué sacarían? ¿Dónde está el límite?
