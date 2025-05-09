import axios from 'axios'

// Fungsi asynchronous untuk mengambil data penugasan harian dari backend API
export const fetchDailyAssignments = async () => {
  try {
    // Panggil endpoint backend untuk mendapatkan data (endpoint admin mengembalikan struktur bersarang)
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.get('/api/daily-assignments/admin')

    // Periksa jika respons berhasil (status code 2xx)
    if (response.status >= 200 && response.status < 300) {
      // Mengembalikan data dari respons API
      return response.data
    } else {
      // Melempar error jika respons tidak berhasil
      throw new Error(`Error fetching data: ${response.statusText}`)
    }
  } catch (error) {
    // Menangani error selama proses request
    console.error('Error in fetchDailyAssignments:', error)
    // Melempar kembali error agar bisa ditangani di komponen yang memanggil
    throw error
  }
}

// Fungsi untuk menambahkan penugasan baru
export const createDailyAssignment = async (assignmentData) => {
  try {
    // Panggil endpoint backend untuk menambahkan data
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.post('/api/daily-assignments', assignmentData)
    return response.data
  } catch (error) {
    console.error('Error in createDailyAssignment:', error)
    throw error
  }
}

// Fungsi untuk memperbarui penugasan
export const updateDailyAssignment = async (category, id, assignmentData) => {
  try {
    // Panggil endpoint backend untuk memperbarui data
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.put(`/api/daily-assignments/${category}/${id}`, assignmentData)
    return response.data
  } catch (error) {
    console.error('Error in updateDailyAssignment:', error)
    throw error
  }
}

// Fungsi untuk menghapus penugasan
export const deleteDailyAssignment = async (category, id) => {
  try {
    // Panggil endpoint backend untuk menghapus data
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.delete(`/api/daily-assignments/${category}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error in deleteDailyAssignment:', error)
    throw error
  }
}
