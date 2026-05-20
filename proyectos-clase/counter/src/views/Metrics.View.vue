<script setup>
import { useAuthStore } from "../stores/useAuth";

const authStore = useAuthStore();
</script>

<template>
    <div>
        <h1>Metricas</h1>
        <p>Contenido exclusivo para usuarios autenticados.</p>
        <p v-if="authStore.user">Usuario actual: {{ authStore.user.email }}</p>
    </div>
</template>
