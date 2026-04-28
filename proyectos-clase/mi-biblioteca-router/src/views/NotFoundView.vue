<template>
  <div class="not-found-page">
    <h1>404</h1>
    <h2>Página no encontrada</h2>
    <p>La página que estás buscando no existe.</p>
    <div class="actions">
      <router-link to="/" class="btn">Ir al Inicio</router-link>
      <router-link to="/catalogo" class="btn">Ver Catálogo</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found-page {
  text-align: center;
  padding: 4rem 2rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: var(--accent);
}

h2 {
  margin: 0 0 1rem 0;
}

p {
  color: var(--text);
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  background: var(--accent);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}

.btn:hover {
  opacity: 0.9;
}
</style>
