<template>
    <div class="landing">
        <main>
            <h1>Gestiona tus tareas con <span>precisión.</span></h1>
            <p>Un dashboard diseñado para desarrolladores que valoran el orden y la estética dark.</p>
            <div class="actions">
                <router-link to="/login"><button>Empezar ahora</button></router-link>
                <router-link to="/login" class="secondary">Iniciar Sesión</router-link>
            </div>
        </main>
    </div>
</template>

<style scoped>
.landing {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

h1 {
    font-size: 3.5rem;
    max-width: 800px;
    margin-bottom: 1rem;
}

h1 span {
    color: var(--accent);
}

p {
    color: var(--text);
    max-width: 500px;
    margin-bottom: 2rem;
}

.actions {
    display: flex;
    gap: 20px;
    align-items: center;
}

.secondary {
    color: var(--text);
    text-decoration: none;
    font-weight: 600;
}

nav {
    position: absolute;
    top: 40px;
    left: 40px;
    font-weight: 800;
    letter-spacing: 2px;
}
</style>