import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'

// Import function, bukan array langsung
import getRoutes from './routes'

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: getRoutes(),
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Auth guard
  Router.beforeEach(async (to, from, next) => {
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()

    authStore.initializeAuth()

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

    if (requiresAuth) {
      if (authStore.isAuthenticated) {
        console.log(`Router Guard: Akses diizinkan ke ${to.fullPath}. User terautentikasi.`)
        next()
      } else {
        console.log(`Router Guard: Akses ke ${to.fullPath} ditolak. User belum login.`)
        next({ name: 'Login', query: { redirect: to.fullPath } })
      }
    } else {
      const isAuthPage = ['/login', '/register', '/forgot-password'].includes(to.path)

      if (isAuthPage && authStore.isAuthenticated) {
        console.log(`Router Guard: User sudah login, dialihkan ke dashboard admin.`)
        next('/admin')
      } else {
        next()
      }
    }
  })

  return Router
})
