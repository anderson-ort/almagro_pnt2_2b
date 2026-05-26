import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    redirect: '/catalogo'
  },
  {
    path: '/catalogo',
    name: 'Catalogo',
    component: () => import('../views/CatalogView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-prestamos',
    name: 'MisPrestamos',
    component: () => import('../views/MyLoansView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reglas',
    name: 'Reglas',
    component: () => import('../views/RulesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/libros',
    name: 'AdminLibros',
    component: () => import('../views/AdminBooksView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/metricas',
    name: 'Metricas',
    component: () => import('../views/MetricsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/catalogo'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'Login' }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'Catalogo' }
  }

  if (to.name === 'Login' && auth.isLoggedIn) {
    return { name: 'Catalogo' }
  }
})

export default router
