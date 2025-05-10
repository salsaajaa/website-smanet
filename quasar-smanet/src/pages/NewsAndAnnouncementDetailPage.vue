<template>
  <q-page class="q-pa-md page-container">
    <div class="content-wrapper">
      <q-btn flat round icon="arrow_back" @click="goBack" class="q-mb-md back-button">
        <q-tooltip>Kembali</q-tooltip>
      </q-btn>

      <div v-if="loading" class="text-center q-mt-xl">
        <q-spinner color="primary" size="3em" />
        <p class="text-grey-7 q-mt-sm">Memuat konten...</p>
      </div>

      <div v-else-if="error" class="text-center q-mt-xl error-message">
        <q-icon name="error_outline" color="negative" size="md" />
        <p class="text-negative q-mt-sm">{{ error }}</p>
        <p class="text-grey-7">Gagal memuat konten. Silakan coba lagi nanti.</p>
      </div>

      <div v-else-if="item">
        <h1 class="item-title">
          {{ item.title }}
        </h1>

        <div class="item-meta">
          Oleh: {{ item.author }} • Dipublikasikan: {{ formatDate(item.published_at) }}
        </div>

        <q-separator class="q-my-md separator-line" />

        <div v-if="item.image_url" class="item-image-container">
          <q-img
            :src="getFullImageUrl(item.image_url)"
            spinner-color="primary"
            fit="contain"
            class="item-image"
          />
        </div>

        <div class="item-content">
          <div v-html="item.content"></div>
        </div>
      </div>

      <div v-else class="text-center no-data-message q-mt-xl">
        <q-icon name="info_outline" color="grey-6" size="md" />
        <p class="q-mt-sm">Konten tidak ditemukan.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { fetchNewsByIdOrSlug, fetchAnnouncementById } from 'src/api/newsAndAnnouncementsApi'
import { BASE_API_URL } from '../boot/config'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const item = ref(null)
const loading = ref(true)
const error = ref(null)

const loadItemDetail = async (type, identifier) => {
  loading.value = true
  error.value = null
  item.value = null

  if (!type || !identifier) {
    error.value = 'Tipe atau ID konten tidak ditemukan di URL.'
    loading.value = false
    return
  }

  try {
    let data = null
    if (type === 'news') {
      data = await fetchNewsByIdOrSlug(identifier)
    } else if (type === 'announcement') {
      data = await fetchAnnouncementById(identifier)
    } else {
      error.value = 'Tipe konten tidak valid.'
      loading.value = false
      return
    }
    item.value = data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message
    error.value = `Gagal memuat detail: ${errorMessage}`
    $q.notify({
      color: 'negative',
      message: `Gagal memuat detail: ${errorMessage}`,
      position: 'top',
      icon: 'report_problem',
    })
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(String(dateString))
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return date.toLocaleDateString('id-ID', options)
  } catch {
    return dateString
  }
}

const getFullImageUrl = (imagePath) => {
  if (imagePath && imagePath.startsWith('/uploads/')) {
  }
  return imagePath
}

const goBack = () => {
  router.go(-1)
}

watch(
  () => route.params,
  (newParams) => {
    if (newParams.type && newParams.id) {
      loadItemDetail(newParams.type, newParams.id)
    } else {
      error.value = 'Parameter URL tidak lengkap untuk menampilkan detail.'
      item.value = null
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.page-container {
  background-color: #f0f2f5;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 960px;
  margin: auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow-wrap: break-word;
}

.item-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e1e1e;
  margin-bottom: 10px;
  line-height: 1.3;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: anywhere;
}

.item-meta {
  font-size: 0.9rem;
  color: #616161;
  margin-bottom: 20px;
}

.separator-line {
  background-color: #e0e0e0;
}

.item-image-container {
  text-align: center;
  margin-bottom: 20px;
}

.item-image {
  max-width: 100%;
  max-height: 450px;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.item-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
}

.error-message,
.no-data-message {
  padding: 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
