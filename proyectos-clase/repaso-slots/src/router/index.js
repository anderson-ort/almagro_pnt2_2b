import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'


const routes = [
    { path: "/", component: () => import("../views/HomeView.vue") },
    { path: "/about-us", component: () => import("../views/AboutUsView.vue") },
    { path: "/about-us/:email", component: () => import("../views/AboutUsView.vue") },
    { path: "/dashboard", component: () => import("../views/DashboardView.vue") , meta:{ requiresAuth: true}},
    { path: "/login", component: () => import("../views/LoginRegisterView.vue") },
    { path: "/:pathMatch(.*)*", component: () => import("../views/NotFoundView.vue") },

]


const router = createRouter(
    {
        history: createWebHistory(),
        routes,
        linkActiveClass: 'active-link',
        
    }
)




// aca generar un Global Guardian
router.beforeEach(
    (to) => {
        const {isAuthenticated} = useAuth()
        
        if(
            to.meta.requiresAuth && !isAuthenticated.value
        ) return {path: "/login"}
        
        
        
    }
)


export { router }