<template>
  <div class="home-page">
    <h1>Bienvenido a la Biblioteca Digital</h1>
    <p>Explora nuestra colección de libros argentinos contemporáneos</p>

    <div class="home-actions">
      <router-link to="/catalogo" class="btn-primary">
        Ver Catálogo
      </router-link>
      <router-link to="/login" class="btn-secondary">
        Iniciar Sesión
      </router-link>
    </div>

    <div class="home-features">
      <div class="feature">
        <h3>📚 Catálogo Amplio</h3>
        <p>40 obras de la literatura argentina contemporánea</p>
      </div>
      <div class="feature">
        <h3>🔒 Reservas Seguras</h3>
        <p>Reserva hasta 3 libros simultáneamente</p>
      </div>
      <div class="feature">
        <h3>👤 Cuenta Personal</h3>
        <p>Regístrate para gestionar tus reservas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 2rem;
}

.home-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.btn-primary {
  background: var(--accent);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--code-bg);
  color: var(--text-h);
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.btn-secondary:hover {
  border-color: var(--accent-border);
}

.home-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature {
  background: var(--code-bg);
  padding: 1.5rem;
  border-radius: 8px;
}

.feature h3 {
  margin-bottom: 0.5rem;
}

.feature p {
  color: var(--text);
}
</style>
