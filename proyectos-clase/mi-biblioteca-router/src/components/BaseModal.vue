<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header>
        <slot name="header">
          <h3>Aviso</h3>
        </slot>
        <button @click="$emit('close')">X</button>
      </header>

      <section class="modal-body">
        <slot></slot>
      </section>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg);
  padding: 20px;
  border-radius: 12px;
  min-width: 300px;
  border: 1px solid var(--border);
}

header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
}

header button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text);
}

.modal-body {
  padding: 20px 0;
}
</style>
