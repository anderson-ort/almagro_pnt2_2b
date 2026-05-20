<script setup>
import { useCounterStore } from "../stores/counterStorage.js";

const store = useCounterStore();
</script>

<template>
    <div>
        <button @click="store.increment">+ Increment</button>
        <button @click="store.decrement">- Decrement</button>
        <button @click="store.reset">Reset Value</button>
    </div>
    <div>
        <strong> El valor al cuadrado es: {{ store.doubleCounter }}</strong>
    </div>
</template>
