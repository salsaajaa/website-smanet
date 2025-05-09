import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Buat instance axios kita
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// Menggunakan interceptor untuk menambahkan token di setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage atau sessionStorage
    const token = localStorage.getItem('jwt_token') // atau sessionStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}` // Menambahkan token di header Authorization
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default boot(({ app }) => {
  // untuk penggunaan di dalam file Vue (Options API) dengan this.$api
  app.config.globalProperties.$api = api
})

export { api }
