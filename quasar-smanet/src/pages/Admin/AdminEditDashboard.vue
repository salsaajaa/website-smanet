<template>
  <q-page class="q-pa-md">
    <div class="container">
      <div class="text-center q-mb-sm">
        <div class="main-page-title text-h4 text-weight-bold">Dashboard Admin ⚙️</div>
        <div class="main-page-subtitle text-subtitle1 text-grey-8">
          Kelola Penugasan Harian DASH 7
        </div>
      </div>

      <div v-if="loading" class="text-center q-mt-xl">
        <q-spinner color="primary" size="3em" />
        <p class="text-grey-7 q-mt-sm">Memuat data penugasan harian...</p>
      </div>

      <div v-else-if="error" class="text-center q-mt-xl">
        <p class="text-negative">{{ error }}</p>
        <p class="text-grey-7">Gagal memuat data. Silakan coba lagi nanti.</p>
        <p v-if="dbErrorDetails" class="text-negative text-caption q-mt-sm">
          Detail Error Database: {{ dbErrorDetails }}
        </p>
      </div>

      <div v-else>
        <q-card
          v-for="(section, sectionIndex) in dashboardData"
          :key="sectionIndex"
          class="dashboard-section-card q-mb-xl"
        >
          <q-card-section>
            <div class="section-title text-h5 text-weight-bold q-mb-sm text-center">
              <span class="section-emoji">{{ section.emoji }}</span>
              <span class="section-title-text">{{ section.title }}</span>
            </div>
            <q-separator />

            <div v-if="section.title === 'JADWAL BUANG SAMPAH'">
              <div class="q-mt-sm text-center">
                <div class="class-name text-h6 text-grey-9 text-weight-bold">
                  {{ section.currentClass || 'Belum Ditentukan' }}
                </div>
              </div>

              <div class="q-mt-md text-center">
                <q-btn
                  v-if="!section.currentClass"
                  color="primary"
                  icon="add"
                  label="Tambah Jadwal Buang Sampah"
                  @click="openAddDialog(section.backend_category, null)"
                />
                <div v-else class="q-mt-md">
                  <template v-if="section.id" :key="'bs-actions-' + section.id">
                    <q-btn
                      color="grey"
                      icon="edit"
                      size="sm"
                      round
                      flat
                      @click="
                        openEditDialog({
                          id: section.id,
                          class: section.currentClass,
                          students: section.introText,
                          category: section.backend_category,
                          task_group: null,
                        })
                      "
                      class="q-mr-sm"
                    >
                      <q-tooltip>Edit Entri Buang Sampah</q-tooltip>
                    </q-btn>
                    <q-btn
                      color="negative"
                      icon="delete"
                      size="sm"
                      round
                      flat
                      @click="confirmDelete({ id: section.id, category: section.backend_category })"
                    >
                      <q-tooltip>Hapus Entri Buang Sampah</q-tooltip>
                    </q-btn>
                  </template>
                  <div v-else class="text-negative">
                    ID Jadwal Buang Sampah tidak ditemukan untuk edit/hapus.
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <q-list bordered class="q-mt-md dashboard-accordion-list">
                <q-expansion-item
                  v-for="(subtitleObj, subtitleIndex) in section.subtitles"
                  :key="subtitleIndex"
                  :label="subtitleObj.subtitle"
                  header-class="accordion-header text-weight-medium text-grey-9"
                  expand-icon-class="text-primary"
                >
                  <q-card>
                    <q-card-section class="q-pa-sm accordion-content">
                      <div v-if="subtitleObj.classes && subtitleObj.classes.length > 0">
                        <div
                          v-for="(classObj, classIndex) in subtitleObj.classes"
                          :key="classObj.id || classIndex"
                          class="q-mb-sm assignment-item"
                        >
                          <div class="class-name text-subtitle2 q-mb-xs text-grey-9">
                            • {{ classObj.className }}
                          </div>

                          <div
                            v-if="classObj.students && classObj.students.length > 0"
                            class="names-list q-ml-md text-body2 text-grey-9"
                          >
                            <div
                              v-for="(student, studentIndex) in classObj.students"
                              :key="'student-' + classObj.className + '-' + studentIndex"
                            >
                              <q-icon name="person" size="xs" class="q-mr-xs text-primary" />
                              {{ student }}
                            </div>
                          </div>
                          <div v-else class="names-placeholder q-ml-md text-body2">
                            <q-icon name="person" size="xs" class-="q-mr-xs text-primary" />
                            <small class="text-grey-7">Belum ada siswa yang ditugaskan.</small>
                          </div>

                          <div class="q-mt-sm q-gutter-sm">
                            <template v-if="classObj.id">
                              <q-btn
                                color="grey"
                                icon="edit"
                                size="sm"
                                round
                                flat
                                @click="openEditDialog(classObj)"
                              >
                                <q-tooltip>Edit Entri Siswa</q-tooltip>
                              </q-btn>
                              <q-btn
                                color="negative"
                                icon="delete"
                                size="sm"
                                round
                                flat
                                @click="confirmDelete(classObj)"
                              >
                                <q-tooltip>Hapus Entri Siswa</q-tooltip>
                              </q-btn>
                            </template>
                            <div v-else class="text-negative text-caption">
                              ID tidak ditemukan untuk edit/hapus.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <small class="text-grey-7">Belum ada penugasan untuk sub-judul ini.</small>
                      </div>

                      <div class="q-mt-md text-center">
                        <q-btn
                          color="primary"
                          icon="add"
                          label="Tambah Kelas ke Kelompok Ini"
                          @click="
                            openAddDialog(section.backend_category, subtitleObj.backend_task_group)
                          "
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>

        <div
          v-if="dashboardData.length === 0 && !loading && !error"
          class="text-center q-mt-xl text-grey-7"
        >
          <p>Belum ada data penugasan harian yang tersedia saat ini.</p>
          <p>Mohon hubungi admin untuk input data.</p>
        </div>
      </div>
    </div>

    <q-dialog v-model="showAssignmentDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit Penugasan' : 'Tambah Penugasan' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="assignmentForm.category"
            label="Kategori"
            disable
            class="q-mb-md"
          />
          <q-input
            dense
            v-model="assignmentForm.task_group"
            label="Sub-judul / Kelompok Tugas"
            disable
            class="q-mb-md"
            v-if="assignmentForm.category !== 'Jadwal Buang Sampah'"
          />
          <q-select
            dense
            v-model="assignmentForm.class"
            label="Nama Kelas"
            :options="classList"
            :rules="[(val) => !!val || 'Kelas harus dipilih']"
            class="q-mb-md"
          />
          <q-input
            dense
            v-model="assignmentForm.students"
            :label="
              assignmentForm.category === 'Jadwal Buang Sampah'
                ? 'Deskripsi'
                : 'Nama Siswa (pisahkan dengan koma atau enter)'
            "
            type="textarea"
            rows="3"
            class="q-mb-md"
            :rules="[
              (val) =>
                !!val ||
                (assignmentForm.category === 'Jadwal Buang Sampah'
                  ? 'Deskripsi tugas harus diisi'
                  : 'Nama siswa harus diisi'),
            ]"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Batal" @click="closeDialog" :disable="saving" />
          <q-btn
            flat
            :label="isEditing ? 'Simpan' : 'Tambah'"
            @click="saveAssignment"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Anda yakin ingin menghapus penugasan ini?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Batal"
            color="grey"
            @click="showDeleteConfirm = false"
            :disable="deleting"
          />
          <q-btn
            flat
            label="Hapus"
            color="negative"
            @click="deleteAssignment"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  QPage,
  QCard,
  QCardSection,
  QList,
  QExpansionItem,
  QIcon,
  QSeparator,
  QSpinner,
  QBtn,
  QDialog,
  QInput,
  QCardActions,
  QSelect,
  useQuasar,
} from 'quasar'
import { api } from '../../boot/axios'

const $q = useQuasar()

// State untuk data dashboard (struktur bersarang dari backend)
const dashboardData = ref([])
// rawAssignmentsFlat tidak lagi diperlukan karena ID Buang Sampah diambil dari struktur bersarang
// const rawAssignmentsFlat = ref([]);
const loading = ref(true)
const error = ref(null)
const dbErrorDetails = ref(null) // State baru untuk detail error database

const displayDate = ref(
  new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

// Daftar kelas untuk QSelect (sesuaikan jika daftar kelas diambil dari API lain)
const classList = [
  'X 1',
  'X 2',
  'X 3',
  'X 4',
  'X 5',
  'X 6',
  'XI A',
  'XI B',
  'XI C',
  'XI D',
  'XI E',
  'XI F',
  'XI G',
  'XI H',
  'XII A',
  'XII B',
  'XII C',
  'XII D',
  'XII E',
  'XII F',
  'XII G',
]

// State untuk dialog tambah/edit
const showAssignmentDialog = ref(false)
const isEditing = ref(false)
const assignmentForm = ref({
  id: null, // Untuk edit (akan diisi dari data yang diedit)
  category: '', // Kategori penugasan
  task_group: '', // Sub-judul penugasan
  class: null, // Nama kelas
  students: '', // Nama siswa atau deskripsi
})
const saving = ref(false) // Loading state untuk proses simpan

// State untuk dialog hapus
const showDeleteConfirm = ref(false)
const assignmentToDelete = ref(null) // Menyimpan objek penugasan yang akan dihapus
const deleting = ref(false) // Loading state untuk proses hapus

// Computed property untuk mengecek apakah ada data penugasan yang berhasil dimuat
const hasAssignments = computed(() => {
  // Cek apakah dashboardData memiliki item
  return dashboardData.value.length > 0
})

// Fungsi untuk mengambil data dari API backend
const loadDailyAssignments = async () => {
  loading.value = true
  error.value = null
  dbErrorDetails.value = null // Reset detail error database
  dashboardData.value = []
  // rawAssignmentsFlat tidak lagi diperlukan
  // rawAssignmentsFlat.value = [];

  try {
    // Panggil endpoint admin yang sekarang mengembalikan struktur bersarang
    // PASTIKAN URL ENDPOINT BACKEND KAMU BENAR
    const response = await api.get('/daily-assignments/admin')

    // Backend seharusnya mengembalikan array bersarang langsung
    if (Array.isArray(response.data)) {
      dashboardData.value = response.data
      console.log('Nested data received from API (Admin):', dashboardData.value)
    } else {
      console.error('Unexpected data format from API:', response.data)
      dashboardData.value = [] // Kosongkan data jika format tidak sesuai
      error.value = 'Format data dari server tidak sesuai.'
      $q.notify({
        color: 'negative',
        message: 'Gagal memproses data dari server: Format tidak sesuai.',
        position: 'top',
      })
    }
  } catch (err) {
    error.value = 'Gagal memuat data penugasan.'
    console.error('Error fetching daily assignments for admin:', err)
    // Tangkap dan tampilkan detail error database jika ada
    if (err.response && err.response.data && err.response.data.dbError) {
      dbErrorDetails.value = JSON.stringify(err.response.data.dbError)
      console.error('Database Error Details:', err.response.data.dbError)
      $q.notify({
        color: 'negative',
        message: `Gagal memuat data: ${err.response.data.message || err.message}. Cek detail error database.`,
        position: 'top',
        icon: 'report_problem',
        timeout: 5000, // Beri waktu lebih lama untuk membaca pesan
      })
    } else {
      $q.notify({
        color: 'negative',
        message: `Gagal memuat data penugasan: ${err.message}`,
        position: 'top',
        icon: 'report_problem',
      })
    }
    dashboardData.value = []
  } finally {
    loading.value = false
  }
}

// Fungsi untuk membuka dialog Tambah
const openAddDialog = (category, taskGroup) => {
  console.log('Opening Add Dialog for Category:', category, 'Task Group:', taskGroup) // Log input
  isEditing.value = false
  assignmentForm.value = {
    // Reset form for add
    id: null, // ID harus null untuk tambah
    category: category,
    task_group: taskGroup,
    class: null, // Reset kelas ke null untuk select
    students: '',
  }
  console.log('assignmentForm after opening Add:', assignmentForm.value) // Log form state
  showAssignmentDialog.value = true
}

// Fungsi untuk membuka dialog Edit
// Menerima objek detail penugasan lengkap (classObj atau objek Buang Sampah)
const openEditDialog = (assignmentDetail) => {
  console.log('Opening Edit Dialog for:', assignmentDetail) // Log input
  isEditing.value = true
  // Pastikan assignmentDetail memiliki properti yang dibutuhkan sebelum mengisi form
  if (
    !assignmentDetail ||
    assignmentDetail.id === undefined ||
    assignmentDetail.category === undefined ||
    assignmentDetail.class === undefined ||
    assignmentDetail.students === undefined
  ) {
    console.error('Error: Data penugasan tidak lengkap untuk diedit.', assignmentDetail)
    $q.notify({
      color: 'negative',
      message: 'Data penugasan tidak lengkap untuk diedit.',
      position: 'top',
    })
    return
  }

  assignmentForm.value = {
    // Populate form from passed data
    id: assignmentDetail.id, // Gunakan ID dari objek detail
    category: assignmentDetail.category, // Gunakan category dari objek detail
    task_group: assignmentDetail.task_group, // Gunakan task_group dari objek detail (akan undefined untuk Buang Sampah, itu OK)
    class: assignmentDetail.class,
    students: Array.isArray(assignmentDetail.students)
      ? assignmentDetail.students.join(', ')
      : assignmentDetail.students, // Ubah array siswa jadi string untuk form
  }
  console.log('assignmentForm after populating for Edit:', assignmentForm.value) // Log form state
  showAssignmentDialog.value = true
}

// Fungsi untuk menyimpan penugasan (Tambah atau Edit)
const saveAssignment = async () => {
  // Validasi sederhana
  if (!assignmentForm.value.class || !assignmentForm.value.students) {
    $q.notify({
      color: 'negative',
      message: 'Nama Kelas dan Nama Siswa/Deskripsi harus diisi.',
      position: 'top',
    })
    return
  }

  saving.value = true
  error.value = null // Reset error
  dbErrorDetails.value = null // Reset detail error database

  try {
    const payload = {
      category: assignmentForm.value.category,
      // Hanya sertakan task_group jika kategori bukan 'Jadwal Buang Sampah'
      ...(assignmentForm.value.category !== 'Jadwal Buang Sampah' && {
        task_group: assignmentForm.value.task_group,
      }),
      class: assignmentForm.value.class,
      students: assignmentForm.value.students, // Kirim sebagai string sesuai endpoint POST/PUT backend
    }

    let response
    if (isEditing.value) {
      // Log values before API call
      console.log(
        'Saving (Edit) with ID:',
        assignmentForm.value.id,
        'Category:',
        assignmentForm.value.category,
        'Payload:',
        payload,
      )
      // Ensure ID and category are not null/undefined for the PUT request
      if (
        assignmentForm.value.id === null ||
        assignmentForm.value.id === undefined ||
        !assignmentForm.value.category
      ) {
        console.error('Error: Missing ID or Category for PUT request', assignmentForm.value)
        // Tampilkan pesan error di UI jika data tidak lengkap
        $q.notify({
          color: 'negative',
          message: 'Kesalahan Internal Frontend: Data tidak lengkap untuk update.',
          position: 'top',
        })
        saving.value = false // Hentikan loading state
        return // Hentikan proses
      }
      // Panggil endpoint PUT dengan category dan id di URL
      response = await api.put(
        `/daily-assignments/${assignmentForm.value.category}/${assignmentForm.value.id}`,
        payload,
      )
      $q.notify({
        color: 'positive',
        message: 'Penugasan berhasil diperbarui!',
        position: 'top',
        icon: 'check_circle',
      })
    } else {
      // Log values before API call
      console.log('Saving (Add) with Payload:', payload)
      // Panggil endpoint POST
      response = await api.post('/daily-assignments', payload)
      $q.notify({
        color: 'positive',
        message: 'Penugasan berhasil ditambahkan!',
        position: 'top',
        icon: 'check_circle',
      })
    }

    closeDialog()
    // Muat ulang data setelah berhasil menyimpan
    await loadDailyAssignments()
  } catch (err) {
    console.error('Error saving assignment:', err)
    // Tangkap dan tampilkan detail error database jika ada
    if (err.response && err.response.data && err.response.data.dbError) {
      error.value = `Gagal menyimpan penugasan: ${err.response.data.message || err.message}`
      dbErrorDetails.value = JSON.stringify(err.response.data.dbError)
      console.error('Database Error Details:', err.response.data.dbError)
      $q.notify({
        color: 'negative',
        message: `Gagal menyimpan penugasan: ${err.response.data.message || err.message}. Cek detail error database di bawah.`,
        position: 'top',
        icon: 'report_problem',
        timeout: 5000,
      })
    } else {
      error.value = `Gagal menyimpan penugasan: ${err.message}`
      $q.notify({
        color: 'negative',
        message: `Gagal menyimpan penugasan: ${err.message}`,
        position: 'top',
        icon: 'report_problem',
      })
    }
  } finally {
    saving.value = false
  }
}

// Fungsi untuk membuka dialog konfirmasi hapus
// Menerima objek detail penugasan lengkap
const confirmDelete = (assignmentDetail) => {
  console.log('Confirming Delete for:', assignmentDetail) // Log input
  // Ensure assignmentDetail has id and category before opening confirm dialog
  if (
    !assignmentDetail ||
    assignmentDetail.id === undefined ||
    assignmentDetail.category === undefined
  ) {
    console.error('Error: Data tidak lengkap untuk menghapus.', assignmentDetail)
    $q.notify({
      color: 'negative',
      message: 'Data tidak lengkap untuk menghapus.',
      position: 'top',
    })
    return
  }
  assignmentToDelete.value = assignmentDetail // Store the full detail object
  console.log('assignmentToDelete state:', assignmentToDelete.value) // Log state
  showDeleteConfirm.value = true
}

// Fungsi untuk menghapus penugasan
const deleteAssignment = async () => {
  deleting.value = true
  error.value = null // Reset error
  dbErrorDetails.value = null // Reset detail error database

  try {
    // Log values before API call
    console.log(
      'Deleting with ID:',
      assignmentToDelete.value?.id,
      'Category:',
      assignmentToDelete.value?.category,
    )
    // Ensure ID and category are not null/undefined for the DELETE request
    if (
      assignmentToDelete.value?.id === null ||
      assignmentToDelete.value?.id === undefined ||
      !assignmentToDelete.value?.category
    ) {
      console.error('Error: Missing ID or Category for DELETE request', assignmentToDelete.value)
      // Tampilkan pesan error di UI jika data tidak lengkap
      $q.notify({
        color: 'negative',
        message: 'Kesalahan Internal Frontend: Data tidak lengkap untuk delete.',
        position: 'top',
      })
      deleting.value = false // Hentikan loading state
      showDeleteConfirm.value = false // Tutup dialog konfirmasi
      return // Hentikan proses
    }
    // Panggil endpoint DELETE dengan category dan id di URL
    await api.delete(
      `/daily-assignments/${assignmentToDelete.value.category}/${assignmentToDelete.value.id}`,
    )

    showDeleteConfirm.value = false
    $q.notify({
      color: 'positive',
      message: 'Penugasan berhasil dihapus!',
      position: 'top',
      icon: 'check_circle',
    })
    await loadDailyAssignments() // Muat ulang data setelah berhasil menghapus
  } catch (err) {
    console.error('Error deleting assignment:', err)
    // Tangkap dan tampilkan detail error database jika ada
    if (err.response && err.response.data && err.response.data.dbError) {
      error.value = `Gagal menghapus penugasan: ${err.response.data.message || err.message}`
      dbErrorDetails.value = JSON.stringify(err.response.data.dbError)
      console.error('Database Error Details:', err.response.data.dbError)
      $q.notify({
        color: 'negative',
        message: `Gagal menghapus penugasan: ${err.response.data.message || err.message}. Cek detail error database di bawah.`,
        position: 'top',
        icon: 'report_problem',
        timeout: 5000,
      })
    } else {
      error.value = `Gagal menghapus penugasan: ${err.message}`
      $q.notify({
        color: 'negative',
        message: `Gagal menghapus penugasan: ${err.message}`,
        position: 'top',
        icon: 'report_problem',
      })
    }
  } finally {
    deleting.value = false
    assignmentToDelete.value = null // Reset state
  }
}

const closeDialog = () => {
  showAssignmentDialog.value = false
  // Reset form
  assignmentForm.value = {
    id: null,
    category: '',
    task_group: '',
    class: null,
    students: '',
  }
}

const getCategoryEmoji = (category) => {
  switch (category) {
    case 'Jadwal Buang Sampah':
      return '🗑️'
    case 'PIKET':
      return '🧹'
    case 'PARKIRAN':
      return '🅿️'
    case 'DUTA KARAKTER':
      return '👑'
    case 'JADWAL PEMBERSIHAN AREA PARKIRAN':
      return '🧼'
    default:
      return '📄'
  }
}

// Ambil data saat komponen pertama kali dimuat
onMounted(() => {
  loadDailyAssignments()
})
</script>

<style scoped>
/* Menggunakan kembali styling dari dashboard publik untuk konsistensi */
.container {
  margin: 0 auto;
  width: 100%;
}

.main-page-title {
  background: linear-gradient(to right, #004b87, #0077b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;

  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0;
  margin-top: 25px;
  letter-spacing: 2px;
}

.main-page-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--q-color-grey-8);
  margin-top: 4px;
  margin-bottom: 8px;
}

.dashboard-section-card {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
  width: 100%;
}

.dashboard-section-card:hover {
  transform: translateY(-5px);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-emoji {
  font-size: 1.2em;
  margin-right: 8px;
}

.section-title-text {
  background: linear-gradient(to right, #004b87, #0077b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.dashboard-accordion-list {
  border: none !important;
}

.accordion-header {
  font-weight: 600;
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 4px;
}

.accordion-content {
  background-color: #e9ecef;
  border-radius: 5px;
  margin-top: 4px;
}

.class-name {
  font-size: 0.95rem;
  margin-left: 8px;
  margin-bottom: 4px;
  color: var(--q-color-grey-9);
}

/* Style untuk daftar nama siswa */
.names-list {
  margin-left: 20px; /* Indentasi */
  margin-bottom: 4px;
  color: var(--q-color-grey-9);
}

.names-list div {
  margin-bottom: 2px; /* Jarak antar nama */
  display: flex;
  align-items: center;
}

.names-placeholder {
  font-size: 0.9rem;
  color: var(--q-color-grey-7);
  margin-left: 20px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.names-placeholder .q-icon {
  color: var(--q-color-primary);
  margin-right: 4px;
}

.static-notes-section {
  font-style: normal !important;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.q-separator {
  margin-bottom: 16px;
  background-color: rgba(0, 0, 0, 0.08);
}

/* Media query untuk penyesuaian pada layar kecil */
@media (max-width: 768px) {
  .dashboard-section-card {
    margin-bottom: 16px;
  }
  .section-title {
    font-size: 1.2rem;
  }
  .accordion-header .q-item__label {
    font-size: 0.95rem;
  }
  .class-name {
    font-size: 0.9rem;
    margin-left: 0;
  }
  .names-list,
  .names-placeholder {
    font-size: 0.85rem;
    margin-left: 12px;
  }
  .main-page-title {
    font-size: 2rem;
  }
  .main-page-subtitle {
    font-size: 0.9rem;
  }
}

/* Styling khusus untuk admin */
.assignment-item {
  border-bottom: 1px dashed #ccc; /* Garis pemisah antar item tugas */
  padding-bottom: 10px;
  margin-bottom: 10px !important;
}

.assignment-item:last-child {
  border-bottom: none; /* Hilangkan garis di item terakhir */
  padding-bottom: 0;
  margin-bottom: 0 !important;
}
</style>
