<template>
  <q-page class="q-pa-md">
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

      <div>
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
                  {{ section.currentClass }}
                </div>
                <p class="text-body2 q-mt-sm text-grey-8">{{ section.introText }}</p>
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

                          <div class="names-placeholder q-ml-md text-body2">
                            <q-icon name="person" size="xs" class="q-mr-xs text-primary" />
                            <small class="text-grey-7"
                              >Daftar nama siswa akan dimuat di sini nanti.</small
                            >
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
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { QPage, QCard, QCardSection, QList, QExpansionItem, QIcon, QSeparator } from 'quasar'

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
  },
  setup() {
    const dashboardData = ref([
      {
        title: 'PIKET',
        emoji: '🧹',
        subtitles: [
          {
            subtitle: 'YANG AKAN MEMBERSIHKAN DI RUANG GURU',
            classes: [{ className: 'X.3', students: [] }],
          },
          {
            subtitle: 'YANG AKAN MEMBERSIHKAN DI AULA',
            classes: [{ className: 'X.3', students: [] }],
          },
          {
            subtitle: 'YANG AKAN MEMBERSIHKAN DI GASEBO',
            classes: [{ className: 'X.4', students: [] }],
          },
        ],
        introText: null,
        staticNotes: [
          'Jadi, yang ada namanya di atas, mohon datang pagi-pagi, jam 06.30 sudah ada di lokasi masing masing🙏',
        ],
      },
      {
        title: 'JADWAL BUANG SAMPAH',
        emoji: '🗑️',
        subtitles: [],
        staticNotes: [],
        introText:
          'Sepulang sekolah supaya ke POS Lapor Sampah dikoordinir oleh ketua kelas dan didampingi wali kelas',
        currentClass: '10.C',
      },
      {
        title: 'PARKIRAN',
        emoji: '🅿️',
        subtitles: [
          {
            subtitle: 'JAGA PARKIRAN CEWEK',
            classes: [
              { className: 'XI.E', students: [] },
              { className: 'XI.C', students: [] },
            ],
          },
          {
            subtitle: 'JAGA PARKIRAN COWOK',
            classes: [{ className: 'X.3', students: [] }],
          },
          {
            subtitle: 'JAGA PARKIRAN DIBELAKANG RUANG GURU',
            classes: [
              { className: 'XI.C', students: [] },
              { className: 'XI.E', students: [] },
            ],
          },
          {
            subtitle: 'JAGA PARKIRAN SEBELAH BARAT',
            classes: [{ className: 'X.2', students: [] }],
          },
        ],
        introText: null,
        staticNotes: [],
      },
      {
        title: 'DUTA KARAKTER',
        emoji: '✨',
        subtitles: [
          {
            subtitle: 'GERBANG UTAMA',
            classes: [{ className: 'XI.C', students: [] }],
          },
          {
            subtitle: 'GERBANG CEWEK',
            classes: [{ className: 'X.2', students: [] }],
          },
        ],
        introText: null,
        staticNotes: [
          'NOTE: AMBIL SELEMPANG DUTA DI SEKRET OSIS, DAN APABILA TELAH DIGUNAKAN MOHON UNTUK DIKEMBALIKAN KE TEMPATNYA SEMULA',
        ],
      },
    ])

    const displayDate = ref(
      new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    )

    return {
      dashboardData,
      displayDate,
    }
  },
}
</script>

<style scoped>
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
