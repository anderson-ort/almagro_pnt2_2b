### Descripción del Parcial – Vue.js  NT2B Almagro - Yatay

**Este parcial está diseñado para evaluar los conocimientos fundamentales sobre el desarrollo de aplicaciones modernas con Vue.js. A lo largo de esta evaluación se abordarán temas prácticos como el uso de la Composition API, la creación de directivas personalizadas, manipulación de objetos y arrays en JavaScript, funciones asíncronas, template literals, y la configuración de rutas con vue-router.**

**La evaluación consta de preguntas de opción múltiple (con respuesta única y múltiple), verdaderos/falsos, emparejamiento y una pregunta de desarrollo breve. Muchas de ellas incluyen fragmentos de código donde deberás analizar la sintaxis y seleccionar la opción más adecuada. Los temas se distribuyen en distintos niveles de dificultad y abarcan tanto aspectos teóricos como prácticos del ecosistema Vue.**

**Temas evaluados:**

- Acceso a propiedades reactivas con Composition API (`ref` y `.value`)
- Implementación correcta de directivas personalizadas en Vue 3
- Sintaxis y validación de objetos JSON
- Funciones flecha (arrow functions) y retorno implícito
- Estructura de componentes de un solo archivo (SFC): `<template>`, `<script>`, `<style>`
- Enlace dinámico de atributos con `v-bind` (sintaxis `:`)
- Template literals e interpolación de variables en JavaScript
- Manejo de operaciones asincrónicas con `async/await`
- Creación de objetos literales (sintaxis válida, propiedad abreviada y spread operator)
- Iteración de listas con la directiva `v-for` y el atributo `:key`
- Métos fundamentales de arrays: `find`, `map`, `filter`, `sort`
- Importación de vistas y configuración de rutas con `vue-router` (carga estática y lazy loading)

**Instrucciones:**

- Leé con atención cada consigna antes de responder.
- Algunas preguntas pueden tener más de una respuesta correcta. En los casos de verdadero/falso o emparejamiento, seguí las indicaciones específicas de cada enunciado.
- Tenés una única oportunidad para completar el examen.

**Docente**: *Anderson Ocaña*
---

## PARCIAL YA-NT2B - 2026 I Cuatrimestre

**Nombre del cuestionario:** Evaluacion Vue - Composition API, Directivas y JavaScript  

## Pregunta 1: Acceso a propiedad reactiva (Opción múltiple, única respuesta)

**Enunciado:** En un componente de Vue con Composition API, si tienes una propiedad reactiva llamada `miPropiedad`, como accedes a su valor desde un metodo del mismo componente?

**Opciones:**

A) `this.miPropiedad`  
B) `miPropiedad.value`  
C) `this.miPropiedad.value`  
D) `$data.miPropiedad`

**Retroalimentacion general:** En Composition API, las propiedades reactivas creadas con `ref` requieren el uso de `.value` para acceder a su valor dentro de `setup` o metodos del componente. No se utiliza `this` como en Options API.


## Pregunta 2: Directivas personalizadas (Opción múltiple, múltiples respuestas)

**Enunciado:** Cuales de estas implementaciones de directivas personalizadas en Vue 3 funcionarian correctamente?

**Opciones:**

A)
```javascript
const miDirectiva = {
  mounted(el, binding) {
    el.style.color = binding.value
  }
}
```

B)
```js

const miDirectiva = (el, binding) => {
  el.style.color = binding.value
}

```

C)
```javascript
const miDirectiva = {
  bind(el, binding) {
    el.style.color = binding.value
  }
}
```

D)
```javascript
const miDirectiva = {
  onMounted(el, binding) {
    el.style.color = binding.value
  }
}
```

**Retroalimentacion general:** En Vue 3, las directivas pueden definirse como objeto con hooks como `mounted`, o como funcion simplificada que se ejecuta en `mounted` y `updated`. La opcion C usa `bind`, que es un hook de Vue 2 y no funciona en Vue 3. La opcion D usa `onMounted`, que no es un hook valido de directivas.

---

## Pregunta 3: Objetos JSON validos (Opción múltiple, múltiples respuestas)

**Enunciado:** Cual o cuales de estos son objetos JSON validos?

**Opciones:**

A)
```json
{
  "nombre": "Juan",
  "edad": 25,
  "activo": true
}
```

B)
```json
{
  nombre: "Maria",
  edad: 30,
  activo: false
}
```

C)
```json
{
  "nombre": "Carlos",
  "edad": undefined,
  "hobbies": ["leer", "correr"]
}
```

D)
```json
{
  "producto": "Laptop",
  "precio": 1500.99,
  "disponible": null,
  "especificaciones": {
    "ram": "16GB",
    "almacenamiento": "512GB"
  }
}
```

**Retroalimentacion general:** JSON requiere comillas dobles en las claves y en los strings. No permite valores `undefined` (si permite `null`). La opcion B tiene claves sin comillas. La opcion C utiliza `undefined`, que no es un valor valido en JSON.

---

## Pregunta 4: Funcion flecha valida (Opción múltiple, múltiples respuestas)

**Enunciado:** Cuales de las siguientes opciones explican por que esta funcion es valida en JavaScript?

```js
const validateProcess = () => "hola mundo"
```

**Opciones:**

A) Porque las arrow functions permiten retorno implicito cuando el cuerpo es una sola expresion, sin necesidad de llaves ni la palabra clave `return`.  
B) Porque "hola mundo" es un string, y JavaScript acepta que cualquier funcion devuelva cualquier tipo de dato.  
C) Porque al no tener parametros, la funcion puede omitir la palabra clave `function` y ejecutarse directamente.  
D) Porque las arrow functions siempre retornan el ultimo valor evaluado, incluso si usan llaves.

**Retroalimentacion general:** La funcion usa retorno implicito porque el cuerpo es una sola expresion sin llaves. JavaScript no restringe el tipo de dato retornado por una funcion. La opcion C es incorrecta porque la sintaxis de arrow function no consiste simplemente en omitir la palabra `function`. La opcion D es falsa, ya que si una arrow function usa llaves, se requiere la palabra clave `return` de forma explicita.

---

## Pregunta 5: Estructura de componente Vue (Pregunta abierta o ensayo corto)

**Enunciado:** Que hace el siguiente codigo del componente?

```vue
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script>
export default {
  props: ['title', 'description']
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
```

## Opción A (Correcta)

**Respuesta:**  
El componente define una tarjeta (`card`) reutilizable que recibe dos propiedades (`title` y `description`) desde el componente padre. El bloque `<template>` muestra un `div` con clase `card` que contiene un título `<h3>` y un párrafo `<p>`, interpolando los valores de las props. El bloque `<style scoped>` aplica estilos CSS exclusivos a este componente: borde, borde redondeado, relleno interno y sombra. Así, el componente renderiza una tarjeta visualmente estilizada con contenido dinámico.

**Retroalimentación:** **Correcta.** Describe fielmente el propósito del SFC: un componente de tarjeta con props y estilos encapsulados.

---

## Opción B (Incorrecta)

**Respuesta:**  
El componente crea un formulario con campos de entrada para título y descripción, y al enviarlo guarda los datos en el estado global de Vuex.

**Retroalimentación:** ❌ **Incorrecta.** No hay ningún elemento de formulario (`<input>`, `<form>`) en el `<template>`, ni se importa o usa Vuex. El componente solo muestra texto estático (aunque dinámico mediante props) y carece de lógica de eventos o almacenamiento.

---

## Opción C (Incorrecta)

**Respuesta:**  
El componente no renderiza nada en pantalla porque la etiqueta `<template>` está vacía. Los bloques `<script>` y `<style>` son opcionales y no afectan la visualización.

**Retroalimentación:** ❌ **Incorrecta.** El `<template>` **no está vacío**; contiene un `div` con clase `card` y elementos `h3` y `p`. Por lo tanto, sí renderiza contenido visible. Además, `<script>` define props necesarias para que el contenido sea dinámico, y `<style>` sí afecta la apariencia.

---

## Opción D (Incorrecta)

**Respuesta:**  
El componente implementa un botón que, al hacer clic, muestra una alerta con el título y la descripción. Para eso utiliza la Composition API con `setup()` y las funciones `ref` y `computed`.

**Retroalimentación:** ❌ **Incorrecta.** No hay ningún botón en el `<template>`, no hay eventos (`@click`), ni se usa Composition API. El código emplea la Options API (con `export default { props }`) y no contiene ninguna función de alerta o interacción.

---

## Pregunta 6: Atributo dinamico (Opción múltiple, única respuesta)

**Enunciado:** Si quiero manejar el valor de un atributo dinamicamente (en este caso el atributo `disabled`), cual de estas sentencias me lo permite?

**Opciones:**

A) `:disabled="unMetodo()"`  
B) `disabled="unMetodo()"`  
C) `disabled=unMetodo()`

**Retroalimentacion general:** En Vue, la directiva `v-bind` o su forma abreviada `:` permite enlazar dinamicamente atributos HTML a expresiones de JavaScript. Sin los dos puntos, el valor se interpreta como un string literal.

---

## Pregunta 7: Template literals (Opción múltiple o respuesta corta)

**Enunciado:** Observa el siguiente fragmento de codigo. Cuales de estas afirmaciones NO son correctas?

```js
const aux = 20
const mensaje = `${aux} -> ${aux}`

console.log(mensaje)
```

### Afirmación A (Correcta)
El código imprime en consola el mensaje `"20 -> 20"`.

**Retroalimentación:** Correcta. El template literal `` `${aux} -> ${aux}` `` interpola dos veces el valor de `aux` (que es 20) y lo convierte automáticamente a string, dando como resultado la cadena `"20 -> 20"`. `console.log` muestra exactamente ese valor.


### Afirmación B (Incorrecta)
Los template literals se escriben con comillas simples o dobles, igual que los strings normales.

**Retroalimentación:** Incorrecta. Los template literals **deben** delimitarse con **backticks** (`` ` ``), no con comillas simples (`'`) ni dobles (`"`). Si se usaran comillas dobles, no se podría interpolar con `${}`.


### Afirmación C (Incorrecta)
La interpolación `${aux}` inserta el valor de `aux` manteniendo su tipo original (número), por lo que `mensaje` sería un número con una flecha dentro.

**Retroalimentación:** Incorrecta. El resultado de un template literal es **siempre una cadena de texto** (string). Aunque `aux` sea un número, `${aux}` lo convierte implícitamente a string antes de insertarlo. No es posible mantener el tipo número dentro de un string.


### Afirmación D (Correcta)
Si la variable `aux` cambiara a un string, por ejemplo `"10"`, el mensaje impreso sería `"10 -> 10"`.

**Retroalimentación:** Correcta. Los template literals funcionan con cualquier tipo de dato que pueda convertirse a string. Si `aux` es el string `"10"`, la interpolación lo usará directamente, resultando en `"10 -> 10"`.


---

## Pregunta 8: Proposito de async/await (Opción múltiple, única respuesta)

**Enunciado:** Cual es el proposito principal de `async/await` en JavaScript?

**Opciones:**

A) Realizar operaciones de red  
B) Iterar sobre arrays  
C) Trabajar sobre archivos JSON  
D) Manejo de operaciones asincronicas

**Retroalimentacion general:** `async/await` es una sintaxis que facilita el trabajo con codigo asincronico, permitiendo escribir promesas de forma mas legible y secuencial, similar al codigo sincronico.

---

## Pregunta 9: Creacion de objetos en JavaScript (Opción múltiple, única respuesta)

**Enunciado:** Cual de las siguientes opciones NO es valida para crear un objeto en JavaScript?

**Aclaracion:** `domicilio` es un objeto valido que ya existe y contiene al menos una propiedad.

**Opciones:**

A) `{}`  
B) `{ id = 1, nombre = "Juan" }`  
C) `{ id: 1, nombre: "Juan", domicilio: { domicilio } }`  
D) `{ id: 1, nombre: "Juan", domicilio: { ...domicilio } }`

**Retroalimentacion general:** En JavaScript, las propiedades de un objeto se definen con la sintaxis `clave: valor`. La opcion B usa el operador `=`, que no es valido para definir propiedades en un objeto literal. Las opciones C y D utilizan tecnicas validas de ES6: propiedad abreviada (shorthand) y operador spread respectivamente.

---

## Pregunta 10: Directiva v-for (Verdadero/Falso)

**Enunciado:** Observa el siguiente codigo. Es valido iterar una lista de esta manera en Vue?

```vue
<li v-for="e in lista" :key="e">{{e}}</li>
```

**Opciones:**

Verdadero  
Falso

**Retroalimentacion general:** La directiva `v-for` permite iterar sobre arrays usando la sintaxis `elemento in array`. El atributo `:key` es una buena practica para ayudar a Vue a identificar elementos unicos y optimizar el renderizado.

---

## Pregunta 11: Metodos de Array (Emparejamiento)

**Enunciado:** Une segun el uso que tenga cada metodo de la clase Array.

**Elementos a emparejar:**

| Metodo | Funcion correcta |
|--------|------------------|
| `find` | Obtiene el primer elemento que cumpla la condicion |
| `map` | Retorna un nuevo array con cierta logica aplicada a cada elemento |
| `filter` | Obtiene un subconjunto de elementos que cumplan la condicion |
| `sort` | Ordena los elementos segun la funcion de comparacion pasada al metodo |

**Opciones distractoras (no validas):**
- Multiplica cada elemento por 2 y devuelve un nuevo array
- Obtiene el unico elemento que cumpla la condicion
- Obtiene un subconjunto desde el primer elemento hasta el primero que cumpla la condicion

**Retroalimentacion general:** Estos metodos son fundamentales para la programacion funcional en JavaScript. `find` retorna el primer elemento coincidente, `map` transforma cada elemento, `filter` crea un subconjunto segun condicion, y `sort` ordena el array in-place.

---

## Pregunta 12: Importacion de vistas con vue-router (Opción múltiple, única respuesta)

**Enunciado:** Usando la dependencia vue-router, cual de estas opciones es valida para importar una vista?

**Opciones:**

A)
```javascript
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }
]
```

B)
```javascript
const routes = [
  {
    path: "/about",
    name: 'about',
    component: () => import('../views/AboutViews.vue')
  }
]
```

C)
```javascript
import { ref } from 'vue'

const componentRef = ref(null)

const routes = [
  {
    path: '/profile',
    component: componentRef
  }
]
```

D)
```javascript
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const HomeView = import('../views/HomeView.vue')
    return { HomeView }
  }
})
```

**Retroalimentacion general:** En vue-router, la propiedad `component` debe recibir directamente un componente importado estaticamente (opcion A) o una funcion que retorne una promesa con el componente, conocida como lazy loading (opcion B). La opcion C es incorrecta porque pasa un `ref`, no un componente. La opcion D muestra una importacion dentro de `setup`, lo cual no define rutas validas para vue-router.
