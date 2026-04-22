<template>
    <div class="card">
        <h3>{{ libro.titulo }}</h3>
        <p>Autor: {{ libro.autor }}</p>

        <slot name="etiqueta"></slot>

        <button @click="$emit('intentar-reserva', libro.id)" :disabled="libro.stock === 0">
            {{ libro.stock > 0 ? 'Reservar' : 'Sin Stock' }}
        </button>
    </div>
</template>

<script setup>
defineProps({
    libro: { type: Object, required: true }
})
// Definimos los eventos que este componente puede disparar
defineEmits(['intentar-reserva'])
</script>

<style scoped>
.card {
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 8px;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>