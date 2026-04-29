<script setup>
import CardTarea from '../components/CardTarea.vue';
import { useTasks } from '../composables/useTasks.js';

const { getTasks, taskCards, isLoadingTasks: isLoading, errorTasks: error } = useTasks();


function handleTareaAceptada(tarea) {
    console.log('Tarea aceptada:', tarea);
}

</script>

<template>

    <div>
        <h2 class="header"> Manager Dashboard Bello</h2>

        <div>
            <button @click="getTasks" :disabled="isLoading">{{ isLoading ? "Cargando task ..." : "Mostrar tareas"
                }}</button>
        </div>

        <p v-if="error"> No se recupero la informacion </p>

        <div class="tareas">
            <CardTarea v-for="task in taskCards" :key="task.id" :titulo="task.titulo" :prioridad="task.prioridad"
                :dev="task.infodeDevelopers" @tareaAceptada="handleTareaAceptada">
                <div v-html="task.comentarioHTML"></div>
            </CardTarea>
        </div>

    </div>
</template>


<style>
/* Contenedor principal del App */

.header {
    text-align: center;
}

.tareas {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    padding: 16px;
}


.error-msg {
    color: #ff4d4d;
    font-weight: bold;
}


.controles {
    margin-bottom: 20px;
}
</style>