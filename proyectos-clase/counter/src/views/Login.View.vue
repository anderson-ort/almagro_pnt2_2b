<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useAuthStore } from "../stores/useAuth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const isLogin = ref(true);
const error = ref("");

function toggleMode() {
    isLogin.value = !isLogin.value;
    error.value = "";
}

async function handleSubmit() {
    error.value = "";

    try {
        if (isLogin.value) {
            await authStore.signIn(email.value, password.value);
        } else {
            await authStore.signUp(email.value, password.value);
        }
        // Redirigir a la pagina que el usuario intentó visitar, o a home
        const redirect = route.query.redirect || "/";
        router.push(redirect);
    } catch (err) {
        error.value = err.message;
    }
}
</script>

<template>
    <div>
        <h1>{{ isLogin ? "Iniciar sesion" : "Registrarse" }}</h1>
        <form @submit.prevent="handleSubmit">
            <input v-model="email" type="email" placeholder="Email" required />
            <input
                v-model="password"
                type="password"
                placeholder="Contrasena"
                required
            />
            <button type="submit" :disabled="authStore.loading">
                {{
                    authStore.loading
                        ? "Procesando..."
                        : isLogin
                          ? "Entrar"
                          : "Crear cuenta"
                }}
            </button>
        </form>
        <p v-if="error" style="color: red">{{ error }}</p>
        <p>
            <a href="#" @click.prevent="toggleMode">
                {{
                    isLogin
                        ? "No tenes cuenta? Registrate"
                        : "Ya tenes cuenta? Inicia sesion"
                }}
            </a>
        </p>
    </div>
</template>
