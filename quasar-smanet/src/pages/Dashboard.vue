<template>
  <q-page class="q-pa-md page-container">
    <div class="container">
      <div class="text-center q-mb-sm">
        <div class="main-page-title text-h4 text-weight-bold">DASH 7 📌</div>
        <div class="main-page-subtitle text-subtitle1 text-grey-8">
          DASHBOARD SMA NEGERI 7 PINRANG
        </div>
      </div>

      <div class="text-center q-mb-xl text-subtitle1 text-weight-bold text-grey-8">
        ({{ displayDate }})
      </div>

      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md text-grey-7">Memuat data dashboard...</div>
      </div>

      <div v-else-if="error" class="text-center q-py-xl text-negative">
        <q-icon name="error_outline" size="3em" />
        <div class="q-mt-md">Gagal memuat data dashboard.</div>
        <div v-if="error.message" class="text-caption text-grey-6">{{ error.message }}</div>
      </div>

      <div v-else-if="dashboardData && dashboardData.length > 0">
        <q-card
          v-for="(section, sectionIndex) in dashboardData"
          :key="sectionIndex"
          class="dashboard-section-card q-mb-xl"
        >
          <q-card-section>
            <div class="section-title text-h5 text-weight-bold q-mb-sm text-center">
              <span v-if="section.emoji" class="section-emoji">{{ section.emoji }}</span>
              <span v-if="section.title" class="section-title-text">{{ section.title }}</span>
            </div>
            <q-separator />

            <div v-if="section.title === 'JADWAL BUANG SAMPAH'">
              <div class="q-mt-sm text-center">
                <div
                  v-if="section.currentClass"
                  class="class-name text-h6 text-grey-9 text-weight-bold"
                >
                  {{ section.currentClass }}
                </div>
                <p v-if="section.introText" class="text-body2 q-mt-sm text-grey-8">
                  {{ section.introText }}
                </p>
              </div>
            </div>
            <div v-else>
              <p v-if="section.introText" class="text-body2 q-mt-sm text-grey-8">
                {{ section.introText }}
              </p>

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
                          :key="classIndex"
                          class="q-mb-sm"
                        >
                          <div class="class-name text-subtitle2 q-mb-xs text-grey-9">
                            • {{ classObj.className }}
                          </div>

                          <div
                            v-if="classObj.students && classObj.students.length > 0"
                            class="names-list q-ml-md text-body2 text-grey-8"
                          >
                            <div
                              v-for="(student, studentIndex) in classObj.students"
                              :key="studentIndex"
                            >
                              <q-icon name="person" size="xs" class="q-mr-xs text-primary" />
                              {{ typeof student === 'string' ? student : student.name }}
                            </div>
                          </div>
                          <div v-else class="names-placeholder q-ml-md text-body2">
                            <q-icon name="person" size="xs" class="q-mr-xs text-primary" />
                            <small class="text-grey-7">Belum ada nama siswa ditugaskan.</small>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <small class="text-grey-7"
                          >Belum ada struktur kelas untuk sub-judul ini.</small
                        >
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>

              <div
                v-if="section.staticNotes && section.staticNotes.length > 0"
                class="q-mt-md text-body2 text-grey-8 text-weight-bold static-notes-section"
              >
                <p v-for="(note, noteIndex) in section.staticNotes" :key="'sec-note-' + noteIndex">
                  {{ note }}
                </p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div v-else class="text-center q-py-xl text-grey-7">
        Tidak ada data dashboard tersedia saat ini.
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import {
  QPage,
  QCard,
  QCardSection,
  QList,
  QExpansionItem,
  QIcon,
  QSeparator,
  QSpinner,
} from 'quasar'
// Import instance api dari boot file
import { api } from 'boot/axios' // <-- PASTIKAN PATH IMPORT INI BENAR
import { useQuasar } from 'quasar'

export default {
  name: 'DashboardPage',
  components: {
    QPage,
    QCard,
    QCardSection,
    QList,
    QExpansionItem,
    QIcon,
    QSeparator,
    QSpinner,
  },
  setup() {
    const $q = useQuasar()

    // Data untuk tampilan dashboard - akan diisi langsung dari data nested backend
    const dashboardData = ref([])
    const loading = ref(true)
    const error = ref(null)

    const displayDate = ref(
      new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    )

    // Fungsi untuk mengambil data dari backend menggunakan instance api
    const fetchDashboardData = async () => {
      loading.value = true
      error.value = null
      try {
        // Gunakan instance 'api' yang sudah dikonfigurasi dengan baseURL '/api'
        // Path di sini adalah path RELATIF terhadap baseURL.
        // Jadi, cukup berikan '/daily-assignments/admin'
        const response = await api.get('/daily-assignments/admin') // <-- PATH DIPERBAIKI

        // Langsung menggunakan data nested yang diterima dari backend
        dashboardData.value = response.data

        console.log('Data nested dari backend:', response.data) // Debugging
      } catch (err) {
        error.value = err
        console.error('Error fetching dashboard data:', err) // Debugging
        $q.notify({
          color: 'negative',
          message: 'Gagal memuat data dashboard: ' + (err.message || 'Terjadi kesalahan'),
          icon: 'report_problem',
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      console.log('DashboardPage mounted. Fetching data.')
      fetchDashboardData()
    })

    // PENTING: Return properti yang digunakan di template
    return {
      dashboardData,
      displayDate,
      loading,
      error,
    }
  },
}
</script>

<style scoped>
/* Gaya yang sudah ada dari kode asli */
.container {
  /* max-width: 1200px; */ /* Dihilangkan agar full width dalam padding page */
  margin: 0 auto; /* Tetap di tengah jika lebar total kurang dari 100% (jarang terjadi dengan width 100%) */
  width: 100%; /* Pastikan mengambil lebar penuh yang tersedia */
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
  width: 100%; /* Pastikan card mengambil lebar penuh dari parent-nya (container) */
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

.names-list {
  font-size: 0.9rem;
  color: var(--q-color-grey-7);
  margin-left: 20px;
  margin-bottom: 4px;
}

.names-list .q-icon {
  color: var(--q-color-primary);
  margin-right: 4px;
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
  /* Selector yang lebih spesifik untuk catatan statis */
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
  /* Aturan di sini akan aktif di layar <= 768px */
  /* Jika Anda ingin spacing antar card berbeda di mobile, sesuaikan q-mb-lg di template atau tambah margin di sini */
  .dashboard-section-card {
    margin-bottom: 16px; /* Contoh: Jarak antar card lebih kecil di mobile */
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
</style>
