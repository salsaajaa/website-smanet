import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useAuthStore } from './auth'

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [],
    publishedNews: [], // Pastikan diinisialisasi sebagai array kosong
    currentNewsItem: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchNews() {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.get('/admin/news', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.news = Array.isArray(response.data) ? response.data : [] // Pastikan selalu array
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchNewsById(id) {
      this.loading = true
      this.error = null
      this.currentNewsItem = null
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.get(`/admin/news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.currentNewsItem = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async saveNews(newsData, id = null) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }

        const formData = new FormData()
        for (const key in newsData) {
          if (key === 'imageFile' && newsData[key] instanceof File) {
            formData.append('image', newsData[key])
          } else if (key !== 'image_url') {
            formData.append(key, newsData[key])
          } else if (key === 'image_url' && !newsData.imageFile && newsData.image_url !== null) {
            formData.append(key, newsData[key])
          } else if (key === 'image_url' && newsData.image_url === null && !newsData.imageFile) {
            formData.append(key, '')
          }
        }

        let response
        if (id) {
          response = await api.put(`/admin/news/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        } else {
          response = await api.post('/admin/news', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        }
        this.error = null
        return response.data
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    // Aksi BARU untuk mengambil SEMUA berita yang berstatus 'published' (untuk Publik)
    async fetchPublishedNews() {
      this.loading = true
      this.error = null
      try {
        // Panggil endpoint publik untuk berita - DIKOREKSI
        const response = await api.get('/news') // ✅ Benar
        this.publishedNews = Array.isArray(response.data) ? response.data : [] // Pastikan selalu array
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    // Aksi BARU untuk mengambil berita publik berdasarkan ID/Slug (jika ada halaman detail publik)
    async fetchPublishedNewsById(id) {
      this.loading = true
      this.error = null
      this.currentNewsItem = null
      try {
        // Panggil endpoint publik untuk detail berita
        const response = await api.get(`/news/${id}`) // ✅ Benar
        this.currentNewsItem = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async deleteNews(id) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.delete(`/admin/news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.error = null
        this.news = this.news.filter((item) => item.id !== id)
        this.publishedNews = this.publishedNews.filter((item) => item.id !== id)
        return response.data
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
