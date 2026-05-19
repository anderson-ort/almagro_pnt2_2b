# Pinia para Vue.js - Guía Básica (1 hora)

## ¿Qué es Pinia?

Pinia es la biblioteca oficial de gestión de estado para Vue.js. Reemplaza a Vuex como la solución recomendada. Piensa en Pinia como un almacén centralizado donde guardas datos que necesitan compartirse entre múltiples componentes de tu aplicación.

## ¿Por qué usar Pinia?

Sin Pinia, si tienes datos que varios componentes necesitan (usuario logueado, carrito de compras, configuración), tendrías que pasarlos de padre a hijo a nieto... con Pinia, cualquier componente puede acceder directamente a ese dato.

## Conceptos Fundamentales

**Store (Tienda)**: Es un contenedor de estado. Cada store tiene:
- **State**: Los datos (como `data()` en componentes)
- **Getters**: Valores computados (como `computed`)
- **Actions**: Funciones que modifican el state (como `methods`)

## Instalación

```bash
npm install pinia
```

## Configuración Inicial

En tu `main.js`:

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

## Ejemplo 1: Contador Simple (15 min)

Vamos a crear tu primer store. Crea `stores/counter.js`:

```javascript
import { defineStore } from 'pinia'

// defineStore recibe un ID único y un objeto de configuración
export const useCounterStore = defineStore('counter', {
  // State: función que retorna el estado inicial
  state: () => ({
    count: 0
  }),
  
  // Getters: valores computados basados en el state
  getters: {
    doubleCount: (state) => state.count * 2,
    isPositive: (state) => state.count > 0
  },
  
  // Actions: funciones que modifican el state
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    incrementBy(amount) {
      this.count += amount
    }
  }
})
```

**Usando el store en un componente:**

```vue
<template>
  <div>
    <h2>Contador: {{ counter.count }}</h2>
    <p>Doble: {{ counter.doubleCount }}</p>
    <p>Es positivo: {{ counter.isPositive ? 'Sí' : 'No' }}</p>
    
    <button @click="counter.increment()">+1</button>
    <button @click="counter.decrement()">-1</button>
    <button @click="counter.incrementBy(5)">+5</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>
```

**Puntos clave:**
- `useCounterStore()` crea/accede a la instancia del store
- Accedes al state directamente: `counter.count`
- Llamas a actions como métodos normales: `counter.increment()`

## Ejemplo 2: Lista de Tareas (20 min)

Crear `stores/todos.js`:

```javascript
import { defineStore } from 'pinia'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [],
    filter: 'all' // 'all', 'completed', 'pending'
  }),
  
  getters: {
    // Getter que retorna una lista filtrada
    filteredTodos: (state) => {
      if (state.filter === 'completed') {
        return state.todos.filter(todo => todo.completed)
      }
      if (state.filter === 'pending') {
        return state.todos.filter(todo => !todo.completed)
      }
      return state.todos
    },
    
    // Getter que accede a otro getter
    completedCount: (state) => {
      return state.todos.filter(todo => todo.completed).length
    },
    
    totalCount: (state) => state.todos.length
  },
  
  actions: {
    addTodo(text) {
      this.todos.push({
        id: Date.now(),
        text,
        completed: false
      })
    },
    
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    
    deleteTodo(id) {
      const index = this.todos.findIndex(t => t.id === id)
      if (index > -1) {
        this.todos.splice(index, 1)
      }
    },
    
    setFilter(newFilter) {
      this.filter = newFilter
    }
  }
})
```

**Componente que usa el store:**

```vue
<template>
  <div>
    <h2>Lista de Tareas</h2>
    
    <!-- Formulario para agregar -->
    <input v-model="newTodo" @keyup.enter="addNewTodo" placeholder="Nueva tarea">
    <button @click="addNewTodo">Agregar</button>
    
    <!-- Filtros -->
    <div>
      <button @click="todosStore.setFilter('all')">Todas ({{ todosStore.totalCount }})</button>
      <button @click="todosStore.setFilter('pending')">Pendientes</button>
      <button @click="todosStore.setFilter('completed')">Completadas ({{ todosStore.completedCount }})</button>
    </div>
    
    <!-- Lista -->
    <ul>
      <li v-for="todo in todosStore.filteredTodos" :key="todo.id">
        <input 
          type="checkbox" 
          :checked="todo.completed"
          @change="todosStore.toggleTodo(todo.id)"
        >
        <span :style="{ textDecoration: todo.completed ? 'line-through' : 'none' }">
          {{ todo.text }}
        </span>
        <button @click="todosStore.deleteTodo(todo.id)">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodosStore } from '@/stores/todos'

const todosStore = useTodosStore()
const newTodo = ref('')

function addNewTodo() {
  if (newTodo.value.trim()) {
    todosStore.addTodo(newTodo.value)
    newTodo.value = ''
  }
}
</script>
```

## Destructuring (Desestructuración)

Si quieres extraer valores del store, usa `storeToRefs` para mantener la reactividad:

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// CORRECTO: mantiene reactividad
const { count, doubleCount } = storeToRefs(counter)
// Las actions se pueden desestructurar directamente
const { increment, decrement } = counter

// INCORRECTO: pierde reactividad
// const { count } = counter // No hagas esto
</script>

<template>
  <p>{{ count }}</p> <!-- Reactivo -->
  <button @click="increment()">+</button>
</template>
```

## Modificar State directamente

Puedes modificar el state directamente (a diferencia de Vuex):

```javascript
// Esto funciona en Pinia
counter.count = 10

// O con $patch para múltiples cambios
counter.$patch({
  count: 10,
  name: 'Nuevo valor'
})
```

## Ejemplo 3: Store con API (15 min)

```javascript
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getUserById: (state) => {
      // Getter que retorna una función
      return (id) => state.users.find(user => user.id === id)
    }
  },
  
  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        this.users = await response.json()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
```

**Uso en componente:**

```vue
<template>
  <div>
    <button @click="usersStore.fetchUsers()">Cargar Usuarios</button>
    
    <p v-if="usersStore.loading">Cargando...</p>
    <p v-if="usersStore.error">Error: {{ usersStore.error }}</p>
    
    <ul v-if="usersStore.users.length">
      <li v-for="user in usersStore.users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

// Cargar al montar el componente
onMounted(() => {
  usersStore.fetchUsers()
})
</script>
```

## Composición de Stores

Los stores pueden usar otros stores:

```javascript
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async checkout() {
      const userStore = useUserStore()
      
      if (!userStore.isLoggedIn) {
        throw new Error('Debes iniciar sesión')
      }
      
      // Lógica de checkout usando datos del usuario
    }
  }
})
```

## Persistencia (Bonus - 5 min)

Para guardar el state en localStorage:

```bash
npm install pinia-plugin-persistedstate
```

```javascript
// main.js
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```javascript
// En tu store
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: { increment() { this.count++ } },
  persist: true // Esto guarda automáticamente en localStorage
})
```

## Resumen de Conceptos Clave

1. **Store**: Contenedor centralizado de estado
2. **State**: Los datos (reactivos)
3. **Getters**: Valores derivados/computados
4. **Actions**: Funciones que modifican el state
5. **storeToRefs**: Para desestructurar manteniendo reactividad
6. Puedes modificar state directamente o usar `$patch`
7. Actions pueden ser asíncronas
8. Stores pueden usar otros stores

## Diferencias con Vuex

- Sintaxis más simple, menos boilerplate
- No necesitas mutations (modificas state directamente)
- Mejor soporte TypeScript
- No hay módulos, cada store es independiente
- DevTools integradas automáticamente