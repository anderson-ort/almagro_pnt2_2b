<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Iniciar Sesión</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="login-info">
        <p><strong>Cuentas de prueba:</strong></p>
        <p>Admin: admin@biblioteca.com / admin123</p>
        <p>Usuario: user@biblioteca.com / user123</p>
      </div>

      <p class="register-link">
        ¿No tenés cuenta? <router-link to="/register">Registrate</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  setTimeout(() => {
    const resultado = login({ email: email.value, password: password.value })

    if (resultado.success) {
      if (resultado.usuario.rol === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } else {
      error.value = resultado.error
    }

    loading.value = false
  }, 500)
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.login-container {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-align: left;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fef9e7;
  color: #e74c3c;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
}

.login-info {
  background: var(--code-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: left;
  font-size: 0.9rem;
}

.login-info p {
  margin: 0.25rem 0;
}

.register-link {
  text-align: center;
}

.register-link a {
  color: var(--accent);
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
