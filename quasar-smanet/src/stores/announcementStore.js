import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useAuthStore } from './auth'

export const useAnnouncementStore = defineStore('announcement', {
  state: () => ({
    announcements: [],
    publishedAnnouncements: [], // Pastikan diinisialisasi sebagai array kosong
    currentAnnouncementItem: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAllAnnouncements() {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.get('/admin/announcements')
        this.announcements = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchAnnouncementById(id) {
      this.loading = true
      this.error = null
      this.currentAnnouncementItem = null
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.get(`/admin/announcements/${id}`)
        this.currentAnnouncementItem = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async saveAnnouncement(announcementData, id = null) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }

        const formData = new FormData()
        for (const key in announcementData) {
          if (key === 'imageFile' && announcementData[key] instanceof File) {
            formData.append('image', announcementData[key])
          } else if (key !== 'image_url') {
            formData.append(key, announcementData[key])
          } else if (
            key === 'image_url' &&
            !announcementData.imageFile &&
            announcementData.image_url !== null
          ) {
            formData.append(key, announcementData[key])
          } else if (
            key === 'image_url' &&
            announcementData.image_url === null &&
            !announcementData.imageFile
          ) {
            formData.append(key, '')
          }
        }

        let response
        if (id) {
          response = await api.put(`/admin/announcements/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        } else {
          response = await api.post('/admin/announcements', formData, {
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

    async deleteAnnouncement(id) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.delete(`/admin/announcements/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.error = null
        this.announcements = this.announcements.filter((item) => item.id !== id)
        return response.data
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    // Aksi untuk mengambil SEMUA pengumuman yang berstatus 'published' (untuk Publik)
    async fetchPublishedAnnouncements() {
      this.loading = true
      this.error = null
      try {
        // Panggil endpoint publik untuk pengumuman
        const response = await api.get('/announcements') // <-- PASTIKAN PATH INI BENAR
        this.publishedAnnouncements = Array.isArray(response.data) ? response.data : [] // Pastikan selalu array
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    // Aksi untuk mengambil pengumuman publik berdasarkan ID/Slug (jika ada halaman detail publik)
    async fetchPublishedAnnouncementById(id) {
      this.loading = true
      this.error = null
      this.currentAnnouncementItem = null
      try {
        // Panggil endpoint publik untuk detail pengumuman
        const response = await api.get(`/announcements/${id}`) // <-- PASTIKAN PATH INI BENAR
        this.currentAnnouncementItem = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})
