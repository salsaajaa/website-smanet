import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useContactStore = defineStore('contact', {
  state: () => ({
    messages: [],
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
    pagination: {
      currentPage: 1,
      perPage: 10,
      total: 0,
      lastPage: 1,
    },
  }),

  getters: {},

  actions: {
    async fetchAllContactMessages(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/contact/admin', { params })

        this.messages = response.data.data || []
        this.pagination = response.data.pagination || this.pagination

        console.log('Fetched contact messages:', this.messages.length)
      } catch (error) {
        this.error = error
        console.error('Error fetching contact messages:', error)
      } finally {
        this.loading = false
      }
    },

    // Action untuk menandai pesan sudah dibaca
    async markContactMessageAsRead(id) {
      this.actionLoading = true
      this.actionError = null
      let success = false // Flag sukses

      try {
        // Panggil backend API PUT /contact/:id/read
        // Backend sekarang memeriksa affectedRows > 0 sebelum sukses
        const response = await api.put(`/contact/${id}/read`)

        if (response.data && response.data.success) {
          // Cek sukses dari respon backend
          // Opsional: Update status pesan di state messages secara lokal tanpa fetch ulang
          const index = this.messages.findIndex((msg) => msg.id === id)
          if (index !== -1) {
            // Asumsikan backend berhasil mengupdate di DB
            this.messages[index].is_read = true // Update status is_read jadi true
            // Jika backend mengembalikan objek yang diupdate, bisa pakai: this.messages[index] = response.data.data;
          }
          success = true // Set sukses jadi true jika backend respon sukses
        } else {
          // Backend merespon 200/201 tapi success: false (misal pesan tidak ditemukan)
          this.actionError = new Error(
            response.data?.message || 'Gagal menandai pesan sudah dibaca.',
          )
        }

        console.log(`Message ID ${id} marked as read attempt.`)
      } catch (error) {
        this.actionError = error
        console.error(`Error marking message ID ${id} as read:`, error)
        // Notifikasi error ditangani di komponen
      } finally {
        this.actionLoading = false
        // Setelah aksi (sukses atau gagal), panggil ulang fetchAllContactMessages
        // Ini memastikan data di tabel selalu sinkron dengan DB
        // Alternatif: hanya panggil fetch jika sukses dan store tidak update state lokal
        this.fetchAllContactMessages({
          pagination: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.perPage,
            sortBy: this.pagination.sortBy,
            descending: this.pagination.descending,
          },
          filter: '', // Sesuaikan jika perlu mempertahankan filter
        })
        return success // Kembalikan status sukses
      }
    },

    // Action untuk menghapus pesan
    async deleteContactMessage(id) {
      this.actionLoading = true
      this.actionError = null
      let success = false // Flag sukses

      try {
        // Panggil backend API DELETE /contact/:id
        // Backend sekarang memeriksa affectedRows > 0 sebelum sukses
        const response = await api.delete(`/contact/${id}`)

        if (response.data && response.data.success) {
          // Cek sukses dari respon backend
          // Hapus pesan dari state messages secara lokal
          this.messages = this.messages.filter((msg) => msg.id !== id)
          this.pagination.rowsNumber -= 1 // Kurangi total data
          success = true // Set sukses jadi true
        } else {
          // Backend merespon 200/201 tapi success: false (misal pesan tidak ditemukan)
          this.actionError = new Error(response.data?.message || 'Gagal menghapus pesan.')
        }

        console.log(`Message ID ${id} deleted attempt.`)
      } catch (error) {
        this.actionError = error
        console.error(`Error deleting message ID ${id}:`, error)
        // Notifikasi error ditangani di komponen
      } finally {
        this.actionLoading = false
        // Setelah aksi (sukses atau gagal), panggil ulang fetchAllContactMessages
        // Ini memastikan data di tabel selalu sinkron dengan DB
        // Alternatif: hanya panggil fetch jika sukses dan store tidak update state lokal
        this.fetchAllContactMessages({
          pagination: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.perPage,
            sortBy: this.pagination.sortBy,
            descending: this.pagination.descending,
          },
          filter: '', // Sesuaikan jika perlu mempertahankan filter
        })
        return success // Kembalikan status sukses
      }
    },
  },
})
