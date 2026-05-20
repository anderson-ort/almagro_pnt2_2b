<script setup>
import { useThemeStore } from "../stores/useTheme";
import { useAuthStore } from "../stores/useAuth";
import { RouterLink } from "vue-router";

const storeTheme = useThemeStore();
const storeAuth = useAuthStore();
</script>

<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/metrics">Metricas</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <button @click="storeAuth.signOut">Cerrar Sesion</button>
        <button @click="storeTheme.toggle">
            Modo {{ storeTheme.isDark ? "🌙" : "☀️" }}
        </button>
    </nav>
</template>
