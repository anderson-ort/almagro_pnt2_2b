# Clase 5 — Git Flow, Code Review y Testing con IA
**Calendario:** Git flow, PRs, code review entre pares y pruebas automatizadas con Vitest asistidas por IA

> **Tipo:** Taller colaborativo + Práctica técnica · **Duración:** ~90 min  
> **Prerequisitos:** Clases 1–4 completadas, proyecto con componentes y stores

---

## Guía para el Docente

### Objetivo de la clase
Clase densa con dos mitades bien diferenciadas. La primera mitad convierte el flujo de trabajo en una práctica concreta: PRs reales con code review entre pares. La segunda mitad introduce Vitest y muestra cómo la IA acelera la escritura de tests sin reemplazar el criterio sobre qué testear.

La conexión entre ambas mitades es natural: los tests son parte del checklist de un buen PR.

### Flujo sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0–8 min | Mostrar un PR real open source (Vue o Pinia en GitHub). Señalar: título, descripción, comentarios de revisión. ¿Qué hace que este PR sea bueno? |
| 8–20 min | Git flow: `main`, `develop`, feature branches. Por qué no se commitea directo a `main`. Conventional Commits en 3 minutos. |
| 20–30 min | Anatomía de un buen PR con la plantilla. Ejemplos de PR bueno vs. PR malo en la pizarra. |
| 30–45 min | Actividad de code review entre pares (ejercicio 1). Cada uno abre un PR y revisa el del compañero. |
| 45–50 min | **Bisagra:** los tests son parte del PR. Un PR sin tests en código crítico es un PR incompleto. |
| 50–60 min | Instalar Vitest. Primer test de una función utilitaria. Correrlo. Ver que pasa. Romperlo a propósito para ver que falla. |
| 60–72 min | Testear la store del carrito: `setActivePinia(createPinia())` en `beforeEach`, tests de actions y getters. |
| 72–82 min | Usar IA para generar tests del componente `Contador` (ejercicio 2). Revisar críticamente lo generado. |
| 82–90 min | PR: `feat/tests-unitarios`. Mostrar cómo el PR ahora incluye tanto código como tests. |

### Tips para el docente
- **La primera mitad puede quedar corta si la gente tiene muchas dudas sobre Git.** Mantener el foco en el flujo de PRs — los detalles de Git avanzado (rebase, cherry-pick) no son el objetivo.
- Al hacer el code review, modelar la actitud correcta: **el foco es el código, no la persona**. Comentar sobre decisiones técnicas, nunca sobre capacidades.
- En la transición a Vitest, la frase clave es: "¿cómo sabemos que lo que construimos en las últimas 4 clases sigue funcionando después de agregar algo nuevo?" Ese es el problema que resuelven los tests.
- La IA es excelente generando **casos edge** que el desarrollador no pensó. Ese es su valor real en testing.

### Ejemplos: PR bueno vs. PR malo

**PR malo:**
```
Título: arreglos
Descripción: (vacía)
```

**PR bueno:**
```
Título: feat: agrega store del carrito con persistencia

## ¿Qué hace este PR?
Implementa la store de Pinia para el carrito con pinia-plugin-persistedstate.

## Cambios
- Nueva store carrito.js con state, getters y actions
- CarritoView.vue con lista de items y total
- NavBar actualizado con contador de items

## ¿Qué queda fuera?
- Integración con API de pagos (próximo PR)

## Checklist
- [x] Funciona localmente
- [x] Sin console.log
- [x] Tests de la store incluidos
```

### Conceptos clave para reforzar
- Un test tiene tres partes: **Arrange** (preparar), **Act** (ejecutar), **Assert** (verificar).
- El valor de un test no está en que pase, sino en que **falle cuando algo se rompe**.
- `setActivePinia(createPinia())` en `beforeEach` garantiza una store fresca por test — sin esto, los tests se contaminan entre sí.

---

## Ejercicios / Actividades

### Ejercicio 1 — PR y code review entre pares (25 min, en pares)

**Cada estudiante:**
1. Crea la rama `feat/proyecto-clase5` con el estado actual del proyecto
2. Abre un PR usando la plantilla (ver código de ejemplo)
3. El PR debe incluir: qué funcionalidades implementó, qué quedó fuera del MVP y por qué

**Como reviewer, comentar con al menos:**
- 1 comentario positivo (algo bien resuelto)
- 1 sugerencia constructiva con alternativa propuesta
- 1 pregunta técnica genuina ("¿por qué elegiste X en lugar de Y?")

**Checklist de revisión:**
- [ ] ¿Los nombres de variables/funciones/componentes son claros?
- [ ] ¿Hay componentes que hacen demasiado?
- [ ] ¿Se usa la store donde debería, o hay prop drilling innecesario?
- [ ] ¿Sin `console.log` olvidados?

---

### Ejercicio 2 — Tests con IA (30 min, individual)

**Setup:**
```bash
npm install -D vitest @vue/test-utils jsdom @vitest/coverage-v8
```

En `vite.config.js`:
```js
test: { environment: 'jsdom', globals: true }
```

**Parte A — Tests de la store (15 min):**

Crear `src/stores/carrito.test.js` y escribir manualmente tests para:
- El carrito empieza vacío
- `agregarProducto` agrega un producto nuevo
- `agregarProducto` incrementa la cantidad si el producto ya existe
- `eliminarProducto` quita el producto correcto
- `totalPrecio` calcula correctamente

**Parte B — Tests de componente con IA (15 min):**

Pegar el código de `Contador.vue` en la IA con este prompt:
> *"Sos un QA engineer experto en Vue 3 y Vitest. Generá tests para este componente usando @vue/test-utils. Identificá todos los casos edge: valores límite, estados extremos, interacciones inesperadas. Usá describe() para agrupar y la estructura Arrange-Act-Assert en cada it()."*

Revisar lo generado:
- ¿Cada `it()` tiene al menos un `expect` con aserción real?
- ¿Hay algún caso edge que la IA encontró y que no habías pensado?
- ¿Hay algún test que ejecuta código sin verificar nada?

---

## Código de Ejemplo

### Plantilla de PR

```markdown
## ¿Qué hace este PR?
Descripción en 1-3 oraciones.

## Cambios incluidos
- 
- 

## ¿Qué queda fuera?
- [funcionalidad X]: se deja porque...

## Cómo testear
1. npm install
2. Ir a la ruta /...
3. Verificar que...

## Checklist
- [ ] Funciona localmente
- [ ] Sin console.log
- [ ] Tests incluidos si corresponde
```

### Conventional Commits

```bash
feat: agrega store del carrito con persistencia    # nueva funcionalidad
fix: corrige contador que no decrementaba de 0     # corrección de bug
chore: actualiza dependencias                       # mantenimiento
refactor: extrae lógica de fetch a composable       # refactor sin cambio visible
docs: agrega README de componentes                  # documentación
test: agrega tests para la store del carrito        # tests
```

### Configuración de Vitest

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

```json
// package.json — agregar en scripts
"test": "vitest",
"test:coverage": "vitest --coverage"
```

### Tests de la store de Pinia

```js
// src/stores/carrito.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCarritoStore } from './carrito'

describe('useCarritoStore', () => {
  beforeEach(() => {
    // Instancia fresca de Pinia antes de cada test
    setActivePinia(createPinia())
  })

  it('empieza vacío', () => {
    const carrito = useCarritoStore()
    expect(carrito.items).toHaveLength(0)
    expect(carrito.estaVacio).toBe(true)
  })

  it('agrega un producto nuevo', () => {
    const carrito = useCarritoStore()
    carrito.agregarProducto({ id: 1, nombre: 'Teclado', precio: 12000 })
    expect(carrito.items).toHaveLength(1)
    expect(carrito.items[0].cantidad).toBe(1)
  })

  it('incrementa la cantidad si el producto ya existe', () => {
    const carrito = useCarritoStore()
    const producto = { id: 1, nombre: 'Teclado', precio: 12000 }
    carrito.agregarProducto(producto)
    carrito.agregarProducto(producto)
    expect(carrito.items).toHaveLength(1)
    expect(carrito.items[0].cantidad).toBe(2)
  })

  it('elimina el producto correcto', () => {
    const carrito = useCarritoStore()
    carrito.agregarProducto({ id: 1, nombre: 'A', precio: 100 })
    carrito.agregarProducto({ id: 2, nombre: 'B', precio: 200 })
    carrito.eliminarProducto(1)
    expect(carrito.items).toHaveLength(1)
    expect(carrito.items[0].id).toBe(2)
  })

  it('calcula el precio total correctamente', () => {
    const carrito = useCarritoStore()
    carrito.agregarProducto({ id: 1, nombre: 'A', precio: 100 })
    carrito.agregarProducto({ id: 1, nombre: 'A', precio: 100 }) // cantidad: 2
    carrito.agregarProducto({ id: 2, nombre: 'B', precio: 300 }) // cantidad: 1
    expect(carrito.totalPrecio).toBe(500)
  })
})
```

### Tests de componente con Vue Test Utils

```js
// src/components/Contador.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Contador from './Contador.vue'

describe('Contador', () => {
  it('muestra el valor inicial 0', () => {
    const wrapper = mount(Contador)
    expect(wrapper.find('p').text()).toBe('0')
  })

  it('incrementa al hacer click en +', async () => {
    const wrapper = mount(Contador)
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.find('p').text()).toBe('1')
  })

  it('el botón − está deshabilitado en 0', () => {
    const wrapper = mount(Contador)
    expect(wrapper.findAll('button')[0].attributes('disabled')).toBeDefined()
  })

  it('muestra mensaje al llegar a 10', async () => {
    const wrapper = mount(Contador)
    const btn = wrapper.findAll('button')[1]
    for (let i = 0; i < 10; i++) await btn.trigger('click')
    expect(wrapper.text()).toContain('¡Máximo alcanzado!')
  })

  it('agrega clase rojo cuando supera 7', async () => {
    const wrapper = mount(Contador)
    const btn = wrapper.findAll('button')[1]
    for (let i = 0; i < 8; i++) await btn.trigger('click')
    expect(wrapper.find('p').classes()).toContain('rojo')
  })
})
```

### Prompt para generar tests con IA

```
Contexto: Vue 3 + Vitest + @vue/test-utils.

Componente a testear:
[pegar código del componente]

Store relacionada (si aplica):
[pegar store]

Tarea:
1. Identificá todos los casos de prueba incluyendo casos edge y
   comportamientos negativos (qué NO debería pasar).
2. Generá los tests con describe() y estructura Arrange-Act-Assert.
3. Cada it() debe tener al menos un expect con aserción real.
   No generes tests que ejecuten código sin verificar nada.
4. Para stores: usá setActivePinia(createPinia()) en beforeEach.
5. Para componentes: usá mount() de @vue/test-utils.
```

---

## Preguntas para Disparar Debate

1. **¿Alguna vez recibieron feedback sobre algo que crearon?** ¿Qué lo hizo útil o inútil? ¿Qué separa un comentario de code review constructivo de uno que solo frustra?

2. **Un PR sin tests en código crítico: ¿lo mergearían?** ¿Depende de la etapa del proyecto? ¿Cómo manejarían esa decisión en un equipo real?

3. **La IA encontró casos edge que no habías pensado.** ¿Eso significa que es mejor "testeadora" que un humano? ¿Qué cosas no puede detectar porque no conoce el negocio?

4. **Si trabajaran solos, ¿abrirían PRs igual?** ¿Tiene sentido un PR sin reviewer? ¿Para qué serviría?

5. **El coverage al 100% no garantiza ausencia de bugs.** ¿Qué garantiza entonces? ¿Para qué sirve el coverage como métrica si no es suficiente?
