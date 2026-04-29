<script>
import { RouterView, RouterLink } from 'vue-router';
import { router } from './router';

</script>

<template>

  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/login">Login/Register</RouterLink>
    <RouterLink to="/dashboard">Dashboard</RouterLink>
  </nav>

  <RouterView />


</template>