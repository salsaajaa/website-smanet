<template>
  <q-page padding>
    <div class="q-px-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Daftar Berita</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-btn color="primary" label="Tambah Berita Baru" to="/admin/kelola-berita/create" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-table
            title=""
            :rows="newsStore.news"
            :columns="columns"
            row-key="id"
            :loading="newsStore.loading"
            :filter="filter"
            @request="fetchNews"
          >
            <template v-slot:top-right>
              <q-input dense debounce="300" v-model="filter" placeholder="Cari Berita">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <q-img
                  v-if="props.row.image_url"
                  :src="getFullImageUrl(props.row.image_url)"
                  spinner-color="white"
                  style="height: 50px; max-width: 80px"
                  fit="contain"
                />
                <div v-else>No Image</div>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="props.row.status === 'published' ? 'green' : 'orange'">
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  size="sm"
                  color="primary"
                  icon="edit"
                  round
                  dense
                  class="q-mr-sm"
                  @click="editNews(props.row.id)"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  round
                  dense
                  @click="deleteNews(props.row.id)"
                />
              </q-td>
            </template>

            <template v-slot:no-data="{ icon, message, filter }">
              <div class="full-width row flex-center text-accent q-gutter-sm">
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                <span>
                  {{ message }}
                </span>
              </div>
            </template>

            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="deleteConfirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Apakah Anda yakin ingin menghapus berita ini?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Hapus" color="negative" @click="confirmDeleteNews" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNewsStore } from '../../stores/newsStore'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const newsStore = useNewsStore()
const $q = useQuasar()
const router = useRouter()

const filter = ref('')

const columns = [
  { name: 'image', label: 'Gambar', field: 'image_url', align: 'left', style: 'width: 100px' },
  {
    name: 'title',
    required: true,
    label: 'Judul Berita',
    align: 'left',
    field: 'title',
    sortable: true,
    classes: 'text-wrap',
    style: 'max-width: 250px; white-space: normal; word-break: break-word;',
  },
  { name: 'status', label: 'Status', align: 'left', field: 'status', style: 'width: 80px' },
  {
    name: 'published_at',
    label: 'Tanggal Publikasi',
    align: 'left',
    field: 'published_at',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    style: 'width: 120px',
  },
  { name: 'actions', label: 'Aksi', field: 'actions', align: 'center', style: 'width: 100px' },
]

const fetchNews = async () => {
  await newsStore.fetchNews()
  if (newsStore.error) {
    $q.notify({
      color: 'negative',
      message: 'Gagal memuat daftar berita: ' + (newsStore.error.message || 'Terjadi kesalahan'),
      icon: 'report_problem',
    })
  }
}

const editNews = (id) => {
  router.push(`/admin/kelola-berita/${id}/edit`)
}

const deleteConfirmDialog = ref(false)
const newsIdToDelete = ref(null)

const deleteNews = (id) => {
  newsIdToDelete.value = id
  deleteConfirmDialog.value = true
}

const confirmDeleteNews = async () => {
  try {
    await newsStore.deleteNews(newsIdToDelete.value)
    $q.notify({
      color: 'positive',
      message: 'Berita berhasil dihapus',
      icon: 'check_circle',
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Gagal menghapus berita: ' + (error.message || 'Terjadi kesalahan'),
      icon: 'report_problem',
    })
  } finally {
    deleteConfirmDialog.value = false
    newsIdToDelete.value = null
    fetchNews() // Refresh daftar setelah hapus
  }
}

const getFullImageUrl = (imagePath) => {
  if (imagePath && typeof imagePath === 'string' && imagePath.startsWith('/uploads/')) {
    // PASTIKAN PORT INI SESUAI DENGAN PORT BACKEND ANDA (3000)
    return `http://localhost:3000${imagePath}`
  }
  return imagePath
}

onMounted(() => {
  console.log('AdminKelolaBerita.vue mounted. Fetching news.')
  fetchNews()
})
</script>

<style scoped>
.text-wrap {
  white-space: normal !important;
}
</style>
