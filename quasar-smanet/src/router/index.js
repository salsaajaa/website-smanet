import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

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
        console.log(
          `Router Guard: Akses ke ${to.fullPath} ditolak. User belum login. Mengalihkan ke halaman login.`,
        )
        next({ name: 'Login', query: { redirect: to.fullPath } })
      }
    } else {
      const isAuthPage =
        to.path === '/login' || to.path === '/register' || to.path === '/forgot-password'

      if (isAuthPage && authStore.isAuthenticated) {
        console.log(
          `Router Guard: User sudah login, mencoba mengakses ${to.fullPath}. Mengalihkan ke dashboard admin.`,
        )
        next('/admin')
      } else {
        console.log(
          `Router Guard: Akses diizinkan ke ${to.fullPath}. Rute publik atau user belum login.`,
        )
        next()
      }
    }
  })

  return Router
})
