<script setup>
import { ref } from 'vue'


const isLogin = ref(true)

const handleSubmit = (e) => {
    e.preventDefault()
}




</script>

<template>
    <div class="auth-container">
        <form @submit.prevent="handleSubmit" class="auth-form">
            <h2>{{ isLogin ? 'Bienvenido' : 'Crea tu cuenta' }}</h2>
            <div class="field">
                <label>Email</label>
                <input type="email" placeholder="dev@example.com" required>
            </div>
            <div class="field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="full-width">
                {{ isLogin ? 'Entrar' : 'Registrarme' }}
            </button>
            <router-link :to="isLogin ? '/register' : '/login'" class="switch">
                {{ isLogin ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta' }}
            </router-link>
        </form>
    </div>
</template>

<style scoped>
.auth-container {
    height: 100vh;
    display: grid;
    place-items: center;
}

.auth-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg);
}

.field {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

input {
    padding: 12px;
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-h);
}

.full-width {
    width: 100%;
    margin-top: 1rem;
}

.switch {
    display: block;
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
    color: var(--accent);
    text-decoration: none;
}
</style>