import { createRouter, createWebHistory } from "vue-router"
import DashboardView from "../views/DashboardView.vue"
import HomeView from "../views/HomeView.vue"

const routes = [
    { path: "/", component: HomeView },
    { path: "/dashboard", component: DashboardView }, // standby para lazy
    { path: "/login", component: () => import("../views/LoginView.vue") },
    { path: "/:pathMatch(.*)*", component: () => import("../views/NotFoundView.vue") }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})


export { router }