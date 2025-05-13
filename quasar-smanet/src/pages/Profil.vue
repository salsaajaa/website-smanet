<template>
  <q-page class="q-pa-md page-container">
    <div class="text-h3 text-center q-mb-xl text-weight-bold q-mt-lg page-title">Profil</div>

    <q-intersection transition="fade-in" once class="container q-mb-xl">
      <q-card class="section-card">
        <q-card-section class="q-pa-lg">
          <div class="section-title q-mb-md">
            <div class="text-h4 text-weight-bold section-title-text">
              <q-icon name="book" class="q-mr-sm" /> Tentang Sekolah
            </div>
          </div>
          <p class="text-body1 text-dark-grey text-justify">{{ sejarahSekolahText }}</p>
        </q-card-section>
      </q-card>
    </q-intersection>

    <q-intersection transition="fade-in" once class="container q-mb-xl">
      <q-card class="section-card">
        <q-card-section class="q-pa-lg">
          <div class="section-title q-mb-md">
            <div class="text-h4 text-weight-bold section-title-text">Visi dan Misi</div>
          </div>
          <div class="row q-col-gutter-lg visi-misi-section">
            <div class="col-12 col-md-6">
              <q-card flat bordered class="visi-misi-item-card">
                <q-card-section class="q-pa-md">
                  <div class="text-h6 q-mb-sm text-weight-bold text-dark-grey">
                    🎯 Visi SMAN 7 Pinrang:
                  </div>
                  <p class="text-body1 text-dark-grey">“{{ visiText }}”</p>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-6">
              <q-card flat bordered class="visi-misi-item-card">
                <q-card-section class="q-pa-md">
                  <div class="text-h6 q-mb-sm text-weight-bold text-dark-grey">
                    <q-icon name="star" class="q-mr-sm" /> Misi SMAN 7 Pinrang:
                  </div>
                  <ol class="text-body1 text-dark-grey">
                    <li v-for="(item, index) in misiList" :key="index" class="q-mb-sm">
                      {{ item }}
                    </li>
                  </ol>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-intersection>

    <q-intersection transition="fade-in" once class="container q-mb-xl">
      <q-card class="section-card">
        <q-card-section class="q-pa-lg">
          <div class="section-title text-center q-mb-md">
            <div class="text-h4 text-weight-bold section-title-text">Struktur Organisasi</div>
          </div>
          <q-img
            :src="strukturOrganisasiFoto"
            alt="Struktur Organisasi SMAN 7 Pinrang"
            spinner-color="white"
            class="struktur-organisasi-img"
            fit="contain"
          />
        </q-card-section>
      </q-card>
    </q-intersection>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { QPage, QImg, QIcon, QIntersection, QCard, QCardSection } from 'quasar' // Menambahkan QCard dan QCardSection

import strukturOrganisasiFoto from '../assets/struktur-organisasi-sekolah.jpg'

export default {
  name: 'ProfilPage',
  components: {
    QPage,
    QImg,
    QIcon,
    QIntersection,
    QCard, // Mendaftarkan QCard
    QCardSection, // Mendaftarkan QCardSection
  },
  setup() {
    const sejarahSekolahText =
      'SMA Negeri 7 Pinrang adalah salah satu sekolah menengah atas negeri yang berlokasi di Kecamatan Mattiro Bulu, Kabupaten Pinrang, Sulawesi Selatan. Didirikan pada tanggal 5 Januari 1999, sekolah ini berkomitmen untuk mencetak generasi berkarakter, berprestasi, dan siap bersaing di era global. Dengan akreditasi A, SMAN 7 Pinrang menerapkan Kurikulum Merdeka dan menyelenggarakan sistem lima hari sekolah untuk mendukung keseimbangan antara akademik dan pengembangan diri siswa. Didukung oleh tenaga pendidik profesional serta fasilitas belajar yang memadai, SMAN 7 Pinrang terus berinovasi dalam menciptakan lingkungan belajar yang aktif, kreatif, dan menyenangkan.'

    const visiText =
      'Mewujudkan sekolah unggul yang religius, cerdas, berkarakter, kompetitif, dan berwawasan global dengan petuah silasa'

    const misiList = [
      'Membangun budaya religius bagi warga sekolah.',
      'Mencetak sumber daya manusia yang kreatif, inovatif, dan produktif.',
      'Warga sekolah membiasakan budaya S-3 (Sipakatau, Sipakalebbi, Sipakainge).',
      'Meningkatkan prestasi dengan mengikuti kompetisi.',
      'Mendorong penguasaan teknologi informasi dan wawasan dalam menghadapi perubahan zaman.',
      'Penataan lingkungan sekolah untuk kenyamanan warga sekolah.',
    ]

    return {
      sejarahSekolahText,
      visiText,
      misiList,
      strukturOrganisasiFoto,
    }
  },
}
</script>

<style scoped>
/* Mengimpor font Inter jika belum diimpor secara global */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Menerapkan font Inter ke seluruh elemen di halaman ini */
.page-container {
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px; /* Batasi lebar konten utama */
  margin: 0 auto; /* Pusatkan kontainer */
  padding: 0 15px; /* Tambahkan padding horizontal */
}

/* Gaya baru untuk judul halaman utama */
.page-title {
  color: #000; /* Warna hitam pekat */
  margin-top: 2rem; /* Menambahkan margin atas */
  margin-bottom: 2rem; /* Menambahkan margin bawah */
  /* Hapus properti gradient jika tidak diinginkan */
  /* background: none; */
  /* -webkit-background-clip: unset; */
  /* -webkit-text-fill-color: unset; */
  /* background-clip: unset; */
  /* text-fill-color: unset; */
}

.section-card {
  border-radius: 12px; /* Sudut membulat pada card bagian */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); /* Bayangan pada card */
  background-color: #ffffff; /* Latar belakang putih untuk card */
  margin-bottom: 2rem; /* Menambahkan margin bawah pada setiap card bagian */
}

/* Menghapus margin-bottom bawaan dari q-mb-xl pada container karena sudah ada margin di section-card */
.container.q-mb-xl {
  margin-bottom: 0 !important;
}

.section-title {
  position: relative;
  padding-bottom: 10px;
  margin-bottom: 20px; /* Menambahkan margin bawah untuk judul bagian */
}

.section-title-text {
  color: #333; /* Mengubah warna judul bagian menjadi abu-abu gelap */
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 80px;
  height: 3px;
  background-color: var(--q-color-primary);
  border-radius: 2px;
}

.section-title.text-center::after {
  left: 50%;
  transform: translateX(-50%);
}

/* Menghapus padding horizontal pada q-intersection jika tidak diperlukan */
/* .no-padding-horizontal {
  padding-left: 0 !important;
  padding-right: 0 !important;
} */

.struktur-organisasi-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

ol {
  padding-left: 20px;
  line-height: 1.6;
}

.visi-misi-section .col-12 {
  /* Mengatur ulang padding bawaan Quasar grid jika diperlukan */
  padding: 12px !important;
}

.visi-misi-item-card {
  height: 100%; /* Memastikan card visi/misi memiliki tinggi yang sama */
  box-shadow: none; /* Menghapus bayangan bawaan card flat/bordered */
}

/* Menambahkan class baru untuk warna teks yang lebih gelap */
.text-dark-grey {
  color: #444; /* Menggunakan warna abu-abu gelap */
}

p {
  line-height: 1.6;
  /* Menerapkan warna teks gelap ke semua paragraf */
  /* color: #444; */
}

@media (max-width: 768px) {
  .text-h3 {
    font-size: 2rem;
  }
  .text-h4 {
    font-size: 1.8rem;
  }
  .text-h6 {
    font-size: 1rem;
  }
  .q-pa-md {
    padding: 16px !important;
  }
  /* Menyesuaikan padding pada grid di mobile */
  .row.q-col-gutter-lg {
    margin-left: -12px !important;
    margin-top: -12px !important;
  }
  .row.q-col-gutter-lg > div {
    padding-left: 12px !important;
    padding-top: 12px !important;
  }

  ol {
    padding-left: 16px;
  }
  .section-title::after {
    width: 60px;
  }
  .visi-card,
  .misi-card {
    padding: 16px;
  }
}
</style>
