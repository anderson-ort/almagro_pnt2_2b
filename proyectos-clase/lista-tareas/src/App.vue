<!-- logica de js -->
<script setup>
import { ref, computed, watch } from 'vue';

const tareas = ref([
  {
    id: 1,
    texto: 'Tarea 1',
    completada: false
  }
  ,
  {
    id: 2,
    texto: 'Tarea 2',
    completada: false
  }
])


const newTarea = ref('')

// funcionalidad

const addTarea = () => {

  let tarea = newTarea.value.trim()

  if (tarea.length > 0) {

    const newTaskClean = {
      id: tareas.value.length + 1,
      texto: tarea,
      completada: false
    }

    tareas.value.push(newTaskClean)
    newTarea.value = ''

  }

}

const tareasCompletadas = computed(() => {
  return tareas.value.filter(tarea => tarea.completada).length
})

const totalPendientes = computed(() => {
  return tareas.value.filter(tarea => !tarea.completada).length
})

const totalTareas = computed(() => {
  return tareas.value.length
})


watch(
  tareasCompletadas, (nuevoConteo, viejoConteo) => {

    if (nuevoConteo === tareas.value.length && nuevoConteo > 0) [
      console.log("El usuario termino la tarea")
    ]
  }

)


</script>


<!-- manejamos las etiquetas y las directivas -->
<template>
  <div>

    <h1>Lista de tareas</h1>

    <p> Completadas : {{ tareasCompletadas }} | Pendientes : {{ totalPendientes }} | Totales : {{ totalTareas }}</p>

    <hr>

    <div class="task-item" v-for="(tarea, index) in tareas" :key="tarea.id" :class="{ completed: tarea.completada }">

      <input type="checkbox" v-model="tarea.completada">

      <label>{{ index }} - {{ tarea.texto }}</label>

    </div>

    <div class="newtask">

      <p class="task">{{ newTarea }}</p>

      <input type="text" @keyup.enter="addTarea" placeholder="Ingrese nombre de la tarea ..." v-model="newTarea">
      <button @click="addTarea"> Agregar tarea</button>

    </div>


  </div>
</template>

<!-- los estilos -->
<style>
.task-item.completed {
  text-decoration: line-through;
  color: gray;
}

.newtask.task {
  color: peru;
  font-style: italic;
}
</style>
