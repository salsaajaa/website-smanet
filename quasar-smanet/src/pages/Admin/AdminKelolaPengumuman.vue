<template>
  <q-page padding>
    <div class="q-px-md">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6">Daftar Pengumuman</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-btn
            color="primary"
            label="Tambah Pengumuman Baru"
            to="/admin/kelola-pengumuman/create"
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-table
            title=""
            :rows="announcementStore.announcements"
            :columns="columns"
            row-key="id"
            :loading="announcementStore.loading"
            :filter="filter"
            @request="fetchAnnouncements"
            class="full-width announcement-table"
            hide-bottom
          >
            <template v-slot:top-right>
              <q-input dense debounce="300" v-model="filter" placeholder="Cari Pengumuman">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
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
                  @click="editAnnouncement(props.row.id)"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  round
                  dense
                  @click="confirmDeleteAnnouncement(props.row.id)"
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
          </q-table>
        </q-card-section>

        <q-card-section>
          <div v-if="announcementStore.pagination" class="row items-center justify-end q-mt-md">
            <q-pagination
              v-model="announcementStore.pagination.page"
              :max="announcementStore.pagination.last_page"
              direction-links
              flat
              color="grey"
              active-color="primary"
              @update:model-value="fetchAnnouncements({ pagination: announcementStore.pagination })"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="deleteConfirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Anda yakin ingin menghapus pengumuman ini?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Hapus" color="negative" @click="deleteAnnouncement" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnnouncementStore } from '../../stores/announcementStore' // Menggunakan store pengumuman
import { useQuasar } from 'quasar'

const router = useRouter()
const announcementStore = useAnnouncementStore() // Menggunakan store pengumuman
const $q = useQuasar()

const filter = ref('')

// Definisi Kolom Tabel
const columns = [
  // Kolom Gambar
  { name: 'image', label: 'Gambar', field: 'image_url', align: 'center', style: 'width: 100px' },
  // Kolom Judul
  {
    name: 'title',
    label: 'Judul Pengumuman', // Label disesuaikan
    field: 'title',
    align: 'left',
    sortable: true,
    classes: 'text-wrap',
    style: 'max-width: 300px; white-space: normal; word-break: break-word;',
  },
  // Kolom Status
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left', // Rata kiri
    sortable: true,
    style: 'width: 80px',
  },
  // Kolom Tanggal Dibuat (atau Publikasi, sesuaikan field/label jika perlu)
  {
    name: 'created_at', // Sesuaikan field jika nama kolom di DB beda (misal: 'published_at')
    label: 'Dibuat', // Label disesuaikan (misal: 'Tanggal Publikasi')
    field: 'created_at', // Sesuaikan field jika nama kolom di DB beda
    align: 'left', // Rata kiri
    sortable: true,
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    style: 'width: 120px',
  },
  // Kolom Aksi (Edit & Hapus)
  { name: 'actions', label: 'Aksi', field: 'actions', align: 'center', style: 'width: 100px' },
]

// Fungsi untuk mendapatkan URL gambar lengkap dari backend
const getFullImageUrl = (imagePath) => {
  if (imagePath && typeof imagePath === 'string' && imagePath.startsWith('/uploads/')) {
    // PASTIKAN PORT INI SESUAI DENGAN PORT BACKEND ANDA (3000)
    return `http://localhost:3000${imagePath}`
  }
  return imagePath // Mengembalikan path asli jika tidak dimulai dengan /uploads/
}

// Fungsi untuk mengarahkan ke halaman edit pengumuman
const editAnnouncement = (id) => {
  // Fungsi disesuaikan
  router.push(`/admin/kelola-pengumuman/${id}/edit`) // Rute disesuaikan
}

// State dan variabel untuk dialog konfirmasi hapus
const deleteConfirmDialog = ref(false)
const announcementIdToDelete = ref(null) // Variabel disesuaikan

// Fungsi untuk menampilkan dialog konfirmasi hapus
const confirmDeleteAnnouncement = (id) => {
  // Fungsi disesuaikan
  announcementIdToDelete.value = id
  deleteConfirmDialog.value = true
}

// Fungsi untuk menghapus pengumuman setelah konfirmasi
const deleteAnnouncement = async () => {
  // Fungsi disesuaikan
  try {
    await announcementStore.deleteAnnouncement(announcementIdToDelete.value) // Panggil store action pengumuman
    $q.notify({
      color: 'positive',
      message: 'Pengumuman berhasil dihapus', // Pesan disesuaikan
      icon: 'check_circle',
    })
  } catch (error) {
    console.error('Error deleting announcement:', error) // Log disesuaikan
    $q.notify({
      color: 'negative',
      message: 'Gagal menghapus pengumuman: ' + (error.message || 'Terjadi kesalahan'), // Pesan disesuaikan
      icon: 'report_problem',
    })
  } finally {
    deleteConfirmDialog.value = false
    announcementIdToDelete.value = null
    fetchAnnouncements() // Panggil fetch pengumuman untuk refresh daftar
  }
}

// Fungsi untuk mengambil daftar pengumuman dari store
const fetchAnnouncements = async (props) => {
  // Tambahkan props untuk pagination
  console.log('Fetching announcements with pagination props:', props?.pagination) // Tambahkan log
  // Panggil store action untuk mengambil semua pengumuman, kirim pagination jika ada
  await announcementStore.fetchAllAnnouncements(props?.pagination)

  if (announcementStore.error) {
    console.error('Failed to fetch announcements:', announcementStore.error) // Log disesuaikan
    $q.notify({
      color: 'negative',
      message:
        'Gagal memuat daftar pengumuman: ' + // Pesan disesuaikan
        (announcementStore.error.message || 'Terjadi kesalahan'),
      icon: 'report_problem',
    })
  }
}

// Dipanggil saat komponen dimuat
onMounted(() => {
  console.log('AdminKelolaPengumuman.vue mounted. Fetching announcements.') // Log disesuaikan
  fetchAnnouncements() // Ambil data pengumuman saat komponen pertama kali dimuat
})
</script>

<style scoped>
/* Gaya untuk wrapping teks pada kolom tabel */
.text-wrap {
  white-space: normal !important;
}

/* Memastikan tabel di dalam card section memiliki lebar penuh */
.q-card-section .q-table {
  width: 100%;
}

.q-card-section .q-table__container {
  width: 100%;
}

/* Gaya ini mungkin tidak lagi diperlukan dengan struktur satu card, bisa dihapus jika tidak digunakan */
.content-container {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}
</style>
