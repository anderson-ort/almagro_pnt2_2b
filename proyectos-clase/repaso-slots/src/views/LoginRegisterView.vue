<script setup>
import {reactive} from 'vue'
import { useAuthForm } from '../composables/useAuthForm.js'

const { form, submit, toggleMode } = useAuthForm()


</script>

<template>
  <div class="auth-container">
    <div class="auth-card glass-card">
      <div class="auth-header">
        <div class="icon-wrapper"></div>
        <h2>{{ form.isLogin ? 'Bienvenido' : 'Crea tu cuenta' }}</h2>
        <p class="subtitle">
          {{ form.isLogin ? 'Ingresa tus credenciales' : 'Regístrate para comenzar' }}
        </p>
      </div>
      
      <div v-if="form.error" class="error-message">
        {{ form.error }}
      </div>
      
      <form @submit.prevent="submit">
        <div class="field">
          <label>Email</label>
          <input 
            type="email" 
            v-model="form.email"
            placeholder="dev@example.com" 
            :disabled="form.loading"
          >
        </div>
        
        <div class="field">
          <label>Password</label>
          <input 
            type="password" 
            v-model="form.password"
            placeholder="••••••••" 
            :disabled="form.loading"
          >
        </div>
        
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="form.loading"
        >
          {{ form.loading ? 'Cargando...' : (form.isLogin ? 'Entrar' : 'Registrarme') }}
        </button>
        
        <a 
          href="#" 
          @click.prevent="toggleMode" 
          class="toggle-link"
        >
          {{ form.isLogin ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta' }}
        </a>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  transition: transform 0.2s;
}

.glass-card:hover {
  transform: translateY(-5px);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-header h2 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.field {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
}

.field input {
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;
}

.field input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.field input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-link {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  cursor: pointer;
}

.toggle-link:hover {
  color: white;
  text-decoration: underline;
}

.error-message {
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid rgba(220, 53, 69, 0.5);
  border-radius: 12px;
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .glass-card {
    padding: 1.5rem;
  }
  
  .auth-header h2 {
    font-size: 1.5rem;
  }
}
</style>