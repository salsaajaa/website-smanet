// src/stores/dashboardStore.js
import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useAuthStore } from './auth' // Pastikan path impor authStore benar

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    summary: null,
    buangSampahClass: null,
    parkiranAssignments: [],
    piketAssignments: [],
    dutaAssignments: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDashboardSummary() {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: fetching dashboard summary...')
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        // Pastikan path API benar dan sesuai dengan backend adminRoute.js
        const response = await api.get('/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.summary = response.data
        console.log('DashboardStore Action: dashboard summary fetched successfully:', response.data)
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error fetching dashboard summary:', error)
        // throw error; // Lempar error jika perlu ditangani komponen
      } finally {
        this.loading = false
      }
    },

    async fetchBuangSampahClass() {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: fetching Buang Sampah class...')
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.get('/admin/dashboard/buang-sampah', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.buangSampahClass = response.data
        console.log(
          'DashboardStore Action: Buang Sampah class fetched successfully:',
          response.data,
        )
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error fetching Buang Sampah class:', error)
        // throw error;
      } finally {
        this.loading = false
      }
    },

    async saveBuangSampahClass(data) {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: saving Buang Sampah class:', data)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.post('/admin/dashboard/buang-sampah', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('DashboardStore Action: Buang Sampah class saved successfully:', response.data)
        this.fetchBuangSampahClass() // Refresh data setelah save
        return response.data
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error saving Buang Sampah class:', error)
        throw error // Lempar error
      } finally {
        this.loading = false
      }
    },

    async fetchParkiranAssignments() {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: fetching Parkiran assignments...')
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.get('/admin/dashboard/parkiran', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.parkiranAssignments = response.data
        console.log(
          'DashboardStore Action: Parkiran assignments fetched successfully:',
          response.data,
        )
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error fetching Parkiran assignments:', error)
        // throw error;
      } finally {
        this.loading = false
      }
    },

    async addParkiranAssignment(assignmentData) {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: adding Parkiran assignment:', assignmentData)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.post('/admin/dashboard/parkiran', assignmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('DashboardStore Action: Parkiran assignment added successfully:', response.data)
        this.fetchParkiranAssignments() // Refresh data setelah menambah
        return response.data
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error adding Parkiran assignment:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateParkiranAssignment(id, assignmentData) {
      this.loading = true
      this.error = null
      console.log(`DashboardStore Action: updating Parkiran assignment ID ${id}:`, assignmentData)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.put(`/admin/dashboard/parkiran/${id}`, assignmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(
          `DashboardStore Action: Parkiran assignment ID ${id} updated successfully:`,
          response.data,
        )
        this.fetchParkiranAssignments() // Refresh data setelah update
        return response.data
      } catch (error) {
        this.error = error
        console.error(`DashboardStore Action: error updating Parkiran assignment ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteParkiranAssignment(id) {
      this.loading = true
      this.error = null
      console.log(`DashboardStore Action: deleting Parkiran assignment ID ${id}...`)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.delete(`/admin/dashboard/parkiran/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(
          `DashboardStore Action: Parkiran assignment ID ${id} deleted successfully:`,
          response.data,
        )
        this.parkiranAssignments = this.parkiranAssignments.filter((item) => item.id !== id) // Hapus dari state
        return response.data
      } catch (error) {
        this.error = error
        console.error(`DashboardStore Action: error deleting Parkiran assignment ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPiketAssignments() {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: fetching Piket assignments...')
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.get('/admin/dashboard/piket', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.piketAssignments = response.data
        console.log('DashboardStore Action: Piket assignments fetched successfully:', response.data)
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error fetching Piket assignments:', error)
        // throw error;
      } finally {
        this.loading = false
      }
    },

    async addPiketAssignment(assignmentData) {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: adding Piket assignment:', assignmentData)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.post('/admin/dashboard/piket', assignmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('DashboardStore Action: Piket assignment added successfully:', response.data)
        this.fetchPiketAssignments() // Refresh data setelah menambah
        return response.data
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error adding Piket assignment:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePiketAssignment(id, assignmentData) {
      this.loading = true
      this.error = null
      console.log(`DashboardStore Action: updating Piket assignment ID ${id}:`, assignmentData)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.put(`/admin/dashboard/piket/${id}`, assignmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(
          `DashboardStore Action: Piket assignment ID ${id} updated successfully:`,
          response.data,
        )
        this.fetchPiketAssignments() // Refresh data setelah update
        return response.data
      } catch (error) {
        this.error = error
        console.error(`DashboardStore Action: error updating Piket assignment ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePiketAssignment(id) {
      this.loading = true
      this.error = null
      console.log(`DashboardStore Action: deleting Piket assignment ID ${id}...`)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.delete(`/admin/dashboard/piket/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(
          `DashboardStore Action: Piket assignment ID ${id} deleted successfully:`,
          response.data,
        )
        this.piketAssignments = this.piketAssignments.filter((item) => item.id !== id) // Hapus dari state
        return response.data
      } catch (error) {
        this.error = error
        console.error(`DashboardStore Action: error deleting Piket assignment ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchDutaAssignments() {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: fetching Duta assignments...')
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.get('/admin/dashboard/duta', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.dutaAssignments = response.data
        console.log('DashboardStore Action: Duta assignments fetched successfully:', response.data)
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error fetching Duta assignments:', error)
        // throw error;
      } finally {
        this.loading = false
      }
    },

    async addDutaAssignment(assignmentData) {
      this.loading = true
      this.error = null
      console.log('DashboardStore Action: adding Duta assignment:', assignmentData)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.post('/admin/dashboard/duta', assignmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('DashboardStore Action: Duta assignment added successfully:', response.data)
        this.fetchDutaAssignments() // Refresh data setelah menambah
        return response.data
      } catch (error) {
        this.error = error
        console.error('DashboardStore Action: error adding Duta assignment:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateDutaAssignment(id, assignmentData) {
      this.loading = true
      this.error = null
      console.log(`DashboardStore Action: updating Duta assignment ID ${id}:`, assignmentData)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.put(`/admin/dashboard/duta/${id}`, assignmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(
          `DashboardStore Action: Duta assignment ID ${id} updated successfully:`,
          response.data,
        )
        this.fetchDutaAssignments() // Refresh data setelah update
        return response.data
      } catch (error) {
        this.error = error
        console.error(`DashboardStore Action: error updating Duta assignment ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDutaAssignment(id) {
      this.loading = true
      this.error = null
      console.log(`DashboardStore Action: deleting Duta assignment ID ${id}...`)
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan.')
        }
        const response = await api.delete(`/admin/dashboard/duta/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(
          `DashboardStore Action: Duta assignment ID ${id} deleted successfully:`,
          response.data,
        )
        this.dutaAssignments = this.dutaAssignments.filter((item) => item.id !== id) // Hapus dari state
        return response.data
      } catch (error) {
        this.error = error
        console.error(`DashboardStore Action: error deleting Duta assignment ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
