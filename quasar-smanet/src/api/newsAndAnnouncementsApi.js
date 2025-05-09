import axios from 'axios'

// --- FUNGSI UNTUK BERITA (NEWS) ---

// Mengambil daftar semua berita
export const fetchAllNews = async () => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.get('/api/news')
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error fetching news list: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in fetchAllNews:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// Mengambil detail berita berdasarkan ID atau Slug
export const fetchNewsByIdOrSlug = async (identifier) => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.get(`/api/news/${identifier}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error fetching news detail: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in fetchNewsByIdOrSlug:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// Menambah berita baru (Admin)
export const createNews = async (newsData) => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.post('/api/news', newsData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error creating news: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in createNews:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// Mengupdate berita (Admin)
export const updateNews = async (newsId, newsData) => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.put(`/api/news/${newsId}`, newsData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error updating news: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in updateNews:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// Menghapus berita (Admin)
export const deleteNews = async (newsId) => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.delete(`/api/news/${newsId}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error deleting news: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in deleteNews:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// --- FUNGSI UNTUK PENGUMUMAN (ANNOUNCEMENTS) ---

// Mengambil daftar semua pengumuman
export const fetchAllAnnouncements = async () => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.get('/api/announcements')
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error fetching announcements list: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in fetchAllAnnouncements:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// Mengambil detail pengumuman berdasarkan ID
export const fetchAnnouncementById = async (announcementId) => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.get(`/api/announcements/${announcementId}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error fetching announcement detail: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in fetchAnnouncementById:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// Menambah pengumuman baru (Admin)
export const createAnnouncement = async (announcementData) => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.post('/api/announcements', announcementData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error creating announcement: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in createAnnouncement:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// Mengupdate pengumuman (Admin)
export const updateAnnouncement = async (announcementId, announcementData) => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.put(`/api/announcements/${announcementId}`, announcementData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error updating announcement: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in updateAnnouncement:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}

// Menghapus pengumuman (Admin)
export const deleteAnnouncement = async (announcementId) => {
  try {
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await axios.delete(`/api/announcements/${announcementId}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorMessage = response.data?.message || response.statusText
      throw new Error(`Error deleting announcement: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Error in deleteAnnouncement:', error)
    if (error.response && error.response.data && error.response.data.dbError) {
      console.error('Database Error Details:', error.response.data.dbError)
      throw { ...error, dbError: error.response.data.dbError }
    }
    throw error
  }
}
