<template>
  <q-page class="no-padding">
    <div class="q-mb-xl no-padding-horizontal no-padding-top">
      <q-carousel
        v-model="slide"
        animated
        arrows
        navigation
        infinite
        :autoplay="5000"
        class="school-carousel"
      >
        <q-carousel-slide :name="1" :img-src="fotoSekolah1" />
        <q-carousel-slide :name="2" :img-src="fotoSekolah2" />
        <q-carousel-slide :name="3" :img-src="fotoSekolah3" />
      </q-carousel>
    </div>

    <q-intersection transition="fade-in" once class="q-py-xl bg-white">
      <div class="container">
        <q-card class="sambutan-section-card">
          <q-card-section>
            <div class="row q-col-gutter-xl items-start">
              <div class="col-12 col-sm-auto flex flex-center column">
                <q-img
                  :src="fotoKepsek"
                  alt="Foto Kepala Sekolah SMAN 7 Pinrang"
                  spinner-color="white"
                  class="kepsek-photo"
                  style="width: 250px; height: 300px"
                />
                <div class="text-weight-bold q-mt-md text-center text-black">
                  <span class="kepsek-name">{{ namaKepsek }}</span> <br />
                  <span class="text-grey-8 text-subtitle1 kepsek-title text-weight-bold"
                    >Kepala Sekolah</span
                  >
                </div>
              </div>

              <div class="col-12 col-sm q-pt-lg-xl">
                <div class="sambutan-text-wrapper">
                  <div class="sambutan-title q-mb-md text-black text-weight-bold">
                    <q-icon name="campaign" class="q-mr-sm" /> SAMBUTAN KEPALA SEKOLAH
                  </div>
                  <q-intersection transition="fade-in" once>
                    <div
                      class="text-body1 text-grey-8 sambutan-content"
                      v-html="sambutanKepsekText"
                    ></div>
                  </q-intersection>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-intersection>

    <q-intersection
      transition="fade-in"
      once
      class="q-py-xl bg-blue-grey-1"
      @visibility="handleStatisticVisibility"
    >
      <div class="container text-center">
        <div class="section-heading text-h4 text-weight-bold text-black q-mb-xl">
          Statistik Sekolah
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="statistic-card">
              <q-card-section>
                <q-icon name="school" color="primary" size="lg" />
                <div class="text-h5 text-weight-bold q-mt-sm">
                  {{ animatedSiswa }}{{ statistik.siswa.includes('+') ? '+' : '' }}
                </div>
                <div class="text-subtitle1 text-grey-8">Jumlah Siswa</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="statistic-card">
              <q-card-section>
                <q-icon name="person" color="green-8" size="lg" />
                <div class="text-h5 text-weight-bold q-mt-sm">
                  {{ animatedGuru }}{{ statistik.guru.includes('+') ? '+' : '' }}
                </div>
                <div class="text-subtitle1 text-grey-8">Jumlah Guru</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="statistic-card">
              <q-card-section>
                <q-icon name="class" color="red-8" size="lg" />
                <div class="text-h5 text-weight-bold q-mt-sm">
                  {{ animatedKelas }}{{ statistik.kelas.includes('+') ? '+' : '' }}
                </div>
                <div class="text-subtitle1 text-grey-8">Jumlah Kelas</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="statistic-card">
              <q-card-section>
                <q-icon name="people" color="orange-8" size="lg" />
                <div class="text-h5 text-weight-bold q-mt-sm">
                  {{ animatedStaf }}{{ statistik.staf.includes('+') ? '+' : '' }}
                </div>
                <div class="text-subtitle1 text-grey-8">Jumlah Staf</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-intersection>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAnnouncementStore } from '../stores/announcementStore'

import {
  QPage,
  QCarousel,
  QCarouselSlide,
  QImg,
  QIcon,
  QCard,
  QCardSection,
  QIntersection,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
  QSpinner,
  QBanner,
} from 'quasar'

import fotoSekolah1 from '../assets/foto-sekolah-1.jpg'
import fotoSekolah2 from '../assets/foto-sekolah-2.jpg'
import fotoSekolah3 from '../assets/foto-sekolah-3.jpg'
import fotoKepsek from '../assets/fotokepsek.jpg'

export default {
  name: 'IndexPage',
  components: {
    QPage,
    QCarousel,
    QCarouselSlide,
    QImg,
    QIcon,
    QCard,
    QCardSection,
    QIntersection,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QBtn,
    QSpinner,
    QBanner,
  },
  setup() {
    const router = useRouter()

    const announcementStore = useAnnouncementStore()

    const slide = ref(1)

    const namaKepsek = 'Drs. Ikhwan Matu, M.Pd.'
    const sambutanKepsekText = `
      <p><strong>Assalamu'alaikum warahmatullahi wabarakatuh</strong>,</p>
      <p>Puji syukur kita panjatkan ke hadirat Allah SWT. <strong>Selamat datang di website resmi SMA Negeri 7 Pinrang</strong>.</p>
      <p>Website ini menjadi media informasi dan komunikasi untuk siswa, guru, orang tua, dan masyarakat. Kami berkomitmen meningkatkan mutu pendidikan, membangun karakter unggul, dan mengembangkan potensi peserta didik.</p>
      <p>Semoga website ini mempererat hubungan dan menjadi sumber inspirasi bagi kita semua.</p>
      <p><strong>Wassalamu'alaikum warahmatullahi wabarakatuh</strong>.</p>
    `

    const statistik = ref({
      siswa: '756+',
      guru: '42+',
      kelas: '21+',
      staf: '7+',
    })

    const animatedSiswa = ref(0)
    const animatedGuru = ref(0)
    const animatedKelas = ref(0)
    const animatedStaf = ref(0)

    let animationTriggered = false

    const animateNumber = (targetValue, refObject, duration = 1500) => {
      const start = 0
      const end = parseInt(targetValue.replace(/\D/g, ''))
      const startTime = performance.now()

      const update = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const currentValue = Math.floor(progress * end)
        refObject.value = currentValue

        if (progress < 1) {
          requestAnimationFrame(update)
        }
      }

      requestAnimationFrame(update)
    }

    const handleStatisticVisibility = (isVisible) => {
      if (isVisible && !animationTriggered) {
        animationTriggered = true
        animateNumber(statistik.value.siswa, animatedSiswa)
        animateNumber(statistik.value.guru, animatedGuru)
        animateNumber(statistik.value.kelas, animatedKelas)
        animateNumber(statistik.value.staf, animatedStaf)
      }
    }

    onMounted(() => {
      console.log('Beranda.vue mounted.')
    })

    return {
      slide,
      fotoSekolah1,
      fotoSekolah2,
      fotoSekolah3,
      fotoKepsek,
      namaKepsek,
      sambutanKepsekText,
      statistik,
      animatedSiswa,
      animatedGuru,
      animatedKelas,
      animatedStaf,
      handleStatisticVisibility,
      announcementStore,
    }
  },
}
</script>

<style scoped lang="css">
.q-page.no-padding {
  padding: 0 !important;
}

.no-padding-horizontal {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.no-padding-top {
  padding-top: 0 !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.school-carousel {
  width: 100%;
  height: 100vh;
}

.kepsek-photo {
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sambutan-section-card {
  margin-bottom: 40px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border-left: 8px solid var(--q-color-primary);
}

.section-heading {
  text-align: center;
  position: relative;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.sambutan-title {
  font-size: 32px;
  line-height: 1.2;
  position: relative;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.sambutan-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 80px;
  height: 3px;
  background-color: var(--q-color-primary);
  border-radius: 2px;
}

.sambutan-text-wrapper {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.sambutan-content p {
  line-height: 1.6;
  font-size: 17px;
  color: #333;
  text-align: justify;
  margin-bottom: 16px;
}
.sambutan-content p:last-child {
  margin-bottom: 0;
}

.kepsek-name {
  font-weight: bold;
  color: var(--q-color-primary);
  font-size: 1.1rem;
}

.kepsek-title {
  font-size: 0.9rem;
  color: #757575;
  font-weight: bold;
}

.statistic-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  text-align: center;
  height: 100%;
  background-color: #ffffff;
  transition: transform 0.3s ease;
}
.statistic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.akademik-text {
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .school-carousel {
    height: 60vh !important;
  }

  .row.q-col-gutter-xl,
  .row.q-col-gutter-lg {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .row.q-col-gutter-xl > div,
  .row.q-col-gutter-lg > div {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-bottom: 24px;
  }

  .q-py-xl {
    padding-top: 32px !important;
    padding-bottom: 32px !important;
  }

  .akademik-text {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .statistic-card .text-h5 {
    font-size: 1.2rem;
  }
  .statistic-card .text-subtitle1 {
    font-size: 0.9rem;
  }

  .sambutan-section-card .row {
    flex-direction: column;
    align-items: center;
  }
  .sambutan-section-card .col-sm-auto,
  .sambutan-section-card .col-sm {
    width: 100%;
  }
  .sambutan-section-card .kepsek-photo {
    margin-bottom: 24px;
  }
  .sambutan-section-card .col-sm.q-pt-lg-xl {
    padding-top: 0 !important;
  }
  .sambutan-text-wrapper {
    margin-left: 0;
    margin-right: 0;
  }
  .sambutan-title {
    text-align: center;
    font-size: 24px;
  }
  .sambutan-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  .sambutan-content p {
    text-align: left;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .sambutan-content p:last-child {
    margin-bottom: 0;
  }
  .kepsek-name,
  .kepsek-title {
    text-align: center;
  }
}
</style>
