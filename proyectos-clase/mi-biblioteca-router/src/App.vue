<template>
  <div id="app">
    <Navigation />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Navigation from './components/Navigation.vue'
</script>

<style>
/* Global styles are in style.css */
</style>
