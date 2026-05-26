<template>
  <div v-if="authStore.isLoggedIn" class="ai-chat">
    <button class="ai-chat-toggle" @click="open = !open" :title="open ? 'Cerrar chat' : 'Asistente IA'">
      {{ open ? 'x' : 'AI' }}
    </button>

    <div v-if="open" class="ai-chat-panel">
      <div class="ai-chat-header">
        <span>Asistente BiblioTech</span>
        <button class="modal-close" @click="open = false">x</button>
      </div>

      <div class="ai-chat-messages" ref="messagesEl">
        <div v-if="messages.length === 0" class="text-muted text-sm text-center" style="padding:var(--spacing-lg)">
          ¡Hola! Preguntame sobre libros, generos o recomendaciones
        </div>
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="`ai-message ${msg.role}`"
        >
          {{ msg.content }}
        </div>
        <div v-if="loading" class="ai-message assistant">
          <span class="spinner" style="width:16px;height:16px;border-width:2px"></span>
        </div>
      </div>

      <div class="ai-chat-input">
        <input
          v-model="input"
          class="form-input"
          placeholder="Escribe tu pregunta..."
          @keyup.enter="sendMessage"
          :disabled="loading"
        />
        <button class="btn btn-primary btn-sm" @click="sendMessage" :disabled="loading || !input.trim()">
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { chatWithGemini } from '../services/gemini.js'

const authStore = useAuthStore()
const open = ref(false)
const input = ref('')
const loading = ref(false)
const messages = ref([])
const messagesEl = ref(null)

async function sendMessage() {
  if (!input.value.trim() || loading.value) return
  const userMsg = input.value.trim()
  input.value = ''
  messages.value.push({ role: 'user', content: userMsg })
  loading.value = true

  try {
    const response = await chatWithGemini(messages.value)
    messages.value.push({ role: 'assistant', content: response })
  } catch {
    messages.value.push({ role: 'assistant', content: 'Error al conectar con la IA. Intenta de nuevo.' })
  } finally {
    loading.value = false
    await nextTick()
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}
</script>
