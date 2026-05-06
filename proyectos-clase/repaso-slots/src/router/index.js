import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: "/", component: () => import("../views/HomeView.vue") },
    { path: "/about-us", component: () => import("../views/AboutUsView.vue") },
    { path: "/about-us/:email", component: () => import("../views/AboutUsView.vue") },
    { path: "/dashboard", component: () => import("../views/DashboardView.vue") },
    { path: "/login", component: () => import("../views/LoginRegisterView.vue") },
    { path: "/:pathMatch(.*)*", component: () => import("../views/NotFoundView.vue") },

]


const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
)


export { router }