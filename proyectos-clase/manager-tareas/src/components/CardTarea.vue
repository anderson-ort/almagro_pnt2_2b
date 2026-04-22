<script setup>

const props = defineProps(

    {
        titulo: {
            type: String,
            required: true
        },
        prioridad: {
            type: String,
            // default: 'Baja',
            required: true

        },
        dev: {
            type: Object,
            required: true
        }

    }
)


const emit = defineEmits(
    ['tareaAceptada']
)

function aceptarTarea() {
    emit('tareaAceptada', { titulo: props.titulo, prioridad: props.prioridad })
}


</script>

<template>

    <div class="tarea">
        <h3>{{ titulo }}</h3>
        <p>Prioridad: {{ prioridad }}</p>

        <button @click="aceptarTarea"> Aceptar tarea</button>

        <div class="notas">
            <slot />
        </div>

        <div class="dev">
            <h4>{{ dev.nombre }}</h4>
            <h4>{{ dev.email }}</h4>
        </div>


    </div>


</template>

<style>
.tarea {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 12px;
    margin: 10px 0;
    background-color: #1111;
}
</style>