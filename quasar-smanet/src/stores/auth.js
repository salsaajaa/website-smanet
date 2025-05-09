import { defineStore } from 'pinia'
import { api } from '../boot/axios'
import { LocalStorage } from 'quasar'

// Ganti 'auth' jika nama store Anda di defineStore beda
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: LocalStorage.getItem('token') || null,
    user: LocalStorage.getItem('user') ? JSON.parse(LocalStorage.getItem('user')) : null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },

  actions: {
    // UBAH DEFINISI ACTION UNTUK MENERIMA OBJEK { email, password }
    async login({ email, password }) {
      // this.loading = true;
      this.error = null // UBAH LOG UNTUK MENAMPILKAN EMAIL DAN PASSWORD YANG DITERIMA
      console.log('AuthStore Action: Calling login API with credentials:', { email, password })
      try {
        // Panggil POST http://localhost:3000/api/auth/login
        // baseURL di axios.js sudah '/api', jadi di sini hanya '/auth/login'
        // KIRIMKAN OBJEK { email, password } KE BACKEND
        const response = await api.post('/auth/login', { email, password }) // PASTIKAN URL INI BENAR

        console.log('AuthStore Action: Login API responded successfully!', response.data)

        const { token, user } = response.data

        LocalStorage.setItem('token', token)
        LocalStorage.setItem('user', JSON.stringify(user))

        this.token = token
        this.user = user

        console.log('AuthStore Action: User authenticated, token and info stored.')

        return response.data
      } catch (error) {
        this.error = error
        console.error('AuthStore Action: Login failed:', error)
        this.token = null
        this.user = null
        LocalStorage.remove('token')
        LocalStorage.remove('user')

        throw error
      } finally {
        // this.loading = false;
      }
    },

    async logout() {
      console.log('AuthStore Action: Logging out user...')
      this.token = null
      this.user = null
      LocalStorage.remove('token')
      LocalStorage.remove('user')

      console.log('AuthStore Action: Logout complete.')
    },

    initializeAuth() {
      const storedToken = LocalStorage.getItem('token')
      const storedUser = LocalStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          this.token = storedToken
          this.user = JSON.parse(storedUser)
          console.log('AuthStore Action: Auth state initialized from Local Storage.')
        } catch (e) {
          console.error('AuthStore Action: Error initializing auth state:', e)
          this.logout()
        }
      } else {
        this.logout()
      }
    },
  },
})
