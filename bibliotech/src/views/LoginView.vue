<template>
  <div class="login-page">
    <div class="card login-card">
      <div class="card-body">
        <div class="login-title">BiblioTech</div>
        <div class="login-subtitle">Sistema de Gestion de Biblioteca</div>

        <!-- Tabs -->
        <div class="flex gap-sm mb-lg" style="border-bottom:1px solid var(--border-color);margin-bottom:var(--spacing-lg)">
          <button
            class="btn"
            :style="tab==='login' ? 'border-bottom:2px solid var(--color-primary);border-radius:0;color:var(--color-primary)' : 'color:var(--text-muted)'"
            @click="tab='login'"
          >Ingresar</button>
          <button
            class="btn"
            :style="tab==='register' ? 'border-bottom:2px solid var(--color-primary);border-radius:0;color:var(--color-primary)' : 'color:var(--text-muted)'"
            @click="tab='register'"
          >Registrarse</button>
        </div>

        <!-- Login Form -->
        <form v-if="tab==='login'" @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="admin@bibliotech.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Contrasena</label>
            <input v-model="form.password" type="password" class="form-input" placeholder="cualquier contrasena" required />
          </div>
          <div v-if="error" class="alert alert-error">{{ error }}</div>
          <button type="submit" class="btn btn-primary" style="width:100%" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
          <p class="text-muted text-sm text-center mt-md">
            Demo: <code>admin@bibliotech.com</code> o <code>lector@bibliotech.com</code>
          </p>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister">
          <div class="form-group">
            <label class="form-label">Nombre completo</label>
            <input v-model="form.nombre" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Contrasena</label>
            <input v-model="form.password" type="password" class="form-input" minlength="6" required />
          </div>
          <div v-if="error" class="alert alert-error">{{ error }}</div>
          <button type="submit" class="btn btn-primary" style="width:100%" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Crear cuenta' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login, register, loading, error } = useAuth()

const tab = ref('login')
const form = reactive({ email: '', password: '', nombre: '' })

async function handleLogin() {
  error.value = ''
  try {
    await login(form.email, form.password)
    router.push('/catalogo')
  } catch (e) {
    error.value = e.message
  }
}

async function handleRegister() {
  error.value = ''
  try {
    await register(form.email, form.password, form.nombre)
    router.push('/catalogo')
  } catch (e) {
    error.value = e.message
  }
}
</script>