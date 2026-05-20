import HomeView from "../views/Home.View.vue";
import MetricsView from "../views/Metrics.View.vue";
import LoginView from "../views/Login.View.vue";
import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/useAuth";

const routes = [
    {
        path: "/",
        name: "Home.View.vue",
        component: HomeView,
    },
    {
        path: "/metrics",
        name: "Metrics.View.vue",
        component: MetricsView,
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "Login.View.vue",
        component: LoginView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: "Login.View.vue" };
    }
});

export { router };
