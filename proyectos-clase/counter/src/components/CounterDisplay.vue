<script setup>
import { useCounterStore } from "../stores/counterStorage.js";

const store = useCounterStore();
</script>

<template>
    <div>
        <h3>Este es el valor de estado:</h3>
        <p>{{ store.counter }}</p>
    </div>
</template>
