<template>
  <div class="app-container">

    <section class="hero">
      <div class="overlay">
        <h1>BibliotecaDigital</h1>
        <p>Explorá, reservá y descubrí nuevos libros</p>
      </div>
    </section>

    <section class="catalog-section">
      <Catalogo />
    </section>
  </div>
</template>

<script setup>
import Catalogo from './components/Catalogo.vue'
import bookshelf from '/book-shelf.png'
</script>

