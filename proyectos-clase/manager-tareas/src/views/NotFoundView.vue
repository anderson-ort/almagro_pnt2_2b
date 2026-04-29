<template>
    <div class="not-found">
        <h1 class="glitch">404</h1>
        <p>Parece que esta ruta no ha sido deployada todavía.</p>
        <router-link to="/"><button>Volver al inicio</button></router-link>
    </div>
</template>

<style scoped>
.not-found {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    font-size: 8rem;
    color: var(--accent-border);
    margin: 0;
}

p {
    margin-bottom: 2rem;
}
</style>