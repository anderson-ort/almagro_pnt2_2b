<script setup>
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>

  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/login">Login-Register</RouterLink>
    <RouterLink to="/dashboard">Dashboard</RouterLink>
    <RouterLink to="/about-us">AboutUs</RouterLink>
  </nav>

  <RouterView/>


</template>