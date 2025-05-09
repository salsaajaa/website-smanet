<template>
  <q-page class="q-pa-md page-container">
    <div class="text-h3 text-center q-mb-xl text-weight-bold q-mt-lg page-title">Akademik</div>

    <q-intersection transition="fade-in" once class="container q-mb-xl">
      <q-card class="section-card">
        <q-card-section class="q-pa-lg">
          <div class="section-title q-mb-md">
            <div class="text-h4 text-weight-bold section-title-text">Kurikulum</div>
          </div>
          <p class="text-body1 text-dark-grey text-justify">{{ kurikulumText }}</p>
        </q-card-section>
      </q-card>
    </q-intersection>

    <q-intersection transition="fade-in" once class="container q-mb-xl">
      <q-card class="section-card">
        <q-card-section class="q-pa-lg">
          <div class="section-title q-mb-md">
            <div class="text-h4 text-weight-bold section-title-text">Program Unggulan</div>
          </div>
          <q-list separator>
            <q-item
              v-for="(program, index) in programUnggulan"
              :key="`program-${index}`"
              class="q-py-md"
            >
              <q-item-section avatar>
                <q-icon :name="program.icon" color="primary" size="md" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold program-title">{{
                  program.nama
                }}</q-item-label>
                <q-item-label caption class="text-dark-grey akademik-text">{{
                  program.deskripsi
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-intersection>

    <q-intersection transition="fade-in" once class="container q-mb-xl">
      <q-card class="section-card">
        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-lg prestasi-section-row">
            <div class="col-12 col-md-6">
              <div class="section-title q-mb-md">
                <div class="text-h4 text-weight-bold section-title-text">Prestasi Akademik</div>
              </div>
              <q-list dense>
                <q-item
                  v-for="(prestasi, index) in prestasiAkademik"
                  :key="`akademik-${index}`"
                  class="q-py-sm"
                >
                  <q-item-section avatar>
                    <q-icon name="emoji_events" color="amber-8" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold program-title">{{
                      prestasi.judul
                    }}</q-item-label>
                    <q-item-label caption class="text-dark-grey akademik-text">{{
                      prestasi.deskripsi
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12 col-md-6">
              <div class="section-title q-mb-md">
                <div class="text-h4 text-weight-bold section-title-text">Prestasi Non-Akademik</div>
              </div>
              <q-list dense>
                <q-item
                  v-for="(prestasi, index) in prestasiNonAkademik"
                  :key="`nonakademik-${index}`"
                  class="q-py-sm"
                >
                  <q-item-section avatar>
                    <q-icon name="sports_soccer" color="green-8" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold program-title">{{
                      prestasi.judul
                    }}</q-item-label>
                    <q-item-label caption class="text-dark-grey akademik-text">{{
                      prestasi.deskripsi
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-intersection>
  </q-page>
</template>

<script>
import { ref } from 'vue'
// Import komponen Quasar yang dibutuhkan
import {
  QPage,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QIntersection,
  QCard,
  QCardSection,
} from 'quasar' // Menambahkan QCard dan QCardSection

export default {
  name: 'AkademikPage',
  components: {
    QPage,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon, // Tambahkan QIcon
    QIntersection, // Tambahkan QIntersection
    QCard, // Mendaftarkan QCard
    QCardSection, // Mendaftarkan QCardSection
  },
  setup() {
    // Data Konten Kurikulum
    const kurikulumText =
      'SMAN 7 Pinrang menerapkan Kurikulum Merdeka sebagai dasar dalam proses pembelajaran, yang memberikan keleluasaan bagi guru dan siswa untuk mengembangkan potensi sesuai minat dan bakat masing-masing. Kurikulum ini menekankan pembelajaran yang lebih bermakna, kreatif serta berpusat pada peserta didik, dengan fleksibilitas dalam memilih materi ajar dan metode pembelajaran. Selain itu, muatan lokal juga turut diintegrasikan untuk memperkuat nilai budaya dan kearifan lokal, menjadikan pembelajaran lebih kontekstual dan relevan dengan lingkungan sekitar.'

    // Data Program Unggulan (disesuaikan dengan teks baru dan ikon)
    const programUnggulan = [
      {
        icon: 'eco',
        nama: 'Sekolah Adiwiyata – Pendidikan Berbasis Lingkungan',
        deskripsi:
          'SMAN 7 Pinrang meraih penghargaan Sekolah Adiwiyata 2025 dari Kementerian Lingkungan Hidup dan Kehutanan, yang diserahkan langsung oleh Gubernur Sulawesi Selatan. Penghargaan ini diberikan atas komitmen sekolah dalam mengembangkan program-program lingkungan hidup dan pendidikan lingkungan, seperti pengelolaan sampah, penghijauan, dan integrasi pendidikan lingkungan ke dalam kegiatan belajar mengajar.',
      },
      {
        icon: 'groups',
        nama: 'SC-DARE SMANET – Study Club Debate and Research',
        deskripsi:
          'Salah satu program unggulan akademik di SMAN 7 Pinrang adalah SC-DARE SMANET, sebuah klub debat dan riset yang telah meraih Juara 1 Lomba Debat Ilmiah tingkat SMA se-Sulawesi Selatan pada tahun 2024. Prestasi ini menunjukkan dedikasi sekolah dalam mengembangkan kemampuan berpikir kritis dan komunikasi siswa.',
      },
      {
        icon: 'spellcheck',
        nama: 'Penghargaan Wajah Bahasa Sekolah Tingkat Nasional',
        deskripsi:
          'Pada tahun 2021, SMAN 7 Pinrang meraih peringkat pertama dalam penghargaan Wajah Bahasa Sekolah Tingkat Nasional yang diselenggarakan oleh Badan Pengembangan dan Pembinaan Bahasa Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Penghargaan ini diberikan atas upaya sekolah dalam mengutamakan penggunaan bahasa Indonesia yang baik dan benar di ruang publik sekolah.',
      },
    ]

    // Data Prestasi Akademik (disesuaikan dengan teks baru)
    const prestasiAkademik = [
      {
        judul: 'Juara 1 Lomba Debat Ilmiah se-Sulawesi Selatan',
        deskripsi:
          'Tim Study Club Debate and Research (SC-DARE SMANET) berhasil meraih Juara 1 dalam Lomba Debat Ilmiah tingkat SMA se-Sulawesi Selatan yang diselenggarakan di Universitas Muslim Indonesia. Selain itu, salah satu anggota tim juga dinobatkan sebagai Best Speaker, dan sekolah menerima medali emas serta uang pembinaan.',
      },
      {
        judul: 'Juara 1 dan 2 Lomba Debat Tingkat SMA se-Ajattapareng',
        deskripsi:
          'SMAN 7 Pinrang meraih Juara 1 dan 2 dalam Lomba Debat tingkat SMA se-Ajattapareng, membawa pulang medali emas dan perak, serta Piala Bergilir dan Piala Tetap.',
      },
      {
        judul: 'Empat Penghargaan dalam Uji Kemahiran Bahasa Indonesia (UKBI)',
        deskripsi:
          'Dalam momentum Hari Pendidikan Nasional (Hardiknas) 2024, SMAN 7 Pinrang menerima empat penghargaan sekaligus dalam penilaian UKBI yang diselenggarakan oleh Badan Bahasa Kemendikbudristek.',
      },
    ]

    // Data Prestasi Non-Akademik (disesuaikan dengan teks baru)
    const prestasiNonAkademik = [
      {
        judul: 'Juara Umum Hima Fisip Competition UM Sidrap 2025',
        deskripsi:
          'SMAN 7 Pinrang meraih Juara Umum dalam ajang Hima Fisip Competition di Universitas Muhammadiyah Sidrap, dengan prestasi Juara 1 Voli Putri, Juara 1 E-Sport, Juara 1 Puisi, Juara 2 Nyanyi Solo, Juara 2 Tari Kreasi, Juara 3 Debat, dan Juara 3 Karya Tulis Ilmiah (KTI).',
      },
      {
        judul: 'Juara 3 Kejuaraan Pencak Silat Kabupaten Pinrang 2024',
        deskripsi:
          'Naura Sabilillah, siswa kelas X SMAN 7 Pinrang, meraih Juara 3 pada kategori Tanding Kelas B Putri dalam Kejuaraan Pencak Silat tingkat Kabupaten Pinrang.',
      },
    ]

    return {
      kurikulumText,
      programUnggulan,
      prestasiAkademik,
      prestasiNonAkademik,
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

/* Gaya baru untuk judul halaman utama (sama dengan Profil) */
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

/* Gaya card untuk setiap bagian (sama dengan Profil) */
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

/* Gaya untuk judul bagian (sama dengan Profil) */
.section-title {
  position: relative;
  padding-bottom: 10px; /* Jarak antara teks judul dan garis */
  margin-bottom: 20px; /* Jarak antara judul section dan konten di bawahnya */
}

/* Warna teks untuk judul bagian (sama dengan Profil) */
.section-title-text {
  color: #333; /* Mengubah warna judul bagian menjadi abu-abu gelap */
}

/* Gaya garis bawah pada judul bagian (sama dengan Profil) */
.section-title::after {
  content: '';
  position: absolute;
  left: 0; /* Garis mulai dari kiri */
  bottom: 0; /* Garis di bagian bawah */
  width: 80px; /* Lebar garis (sesuaikan jika perlu) */
  height: 3px; /* Ketebalan garis */
  background-color: var(--q-color-primary); /* Warna garis (biru SMANET) */
  border-radius: 2px; /* Sudut membulat pada garis */
}

/* Mengatur ulang posisi garis untuk judul yang di tengah (jika ada) */
.section-title.text-center::after {
  left: 50%; /* Mulai dari tengah */
  transform: translateX(-50%); /* Geser ke kiri setengah dari lebarnya agar benar-benar di tengah */
}

/* Gaya untuk teks isi (paragraf, deskripsi program, deskripsi prestasi) */
/* Menggunakan class custom untuk kontrol lebih baik, warna teks lebih gelap */
.akademik-text {
  line-height: 1.7; /* Meningkatkan line-height sedikit */
  font-size: 1.05rem; /* Sedikit lebih besar dari ukuran standar text-body1 */
  color: #444; /* Menggunakan warna abu-abu gelap */
}

/* Gaya spesifik untuk judul item Program Unggulan dan Prestasi */
.program-title {
  font-size: 1.1rem !important; /* Ukuran font judul item, pastikan lebih besar dari deskripsi */
  line-height: 1.5 !important; /* Line-height untuk judul item */
  font-weight: bold !important; /* Memastikan judul item tebal */
  color: #000 !important; /* Memastikan warna judul item hitam */
}

/* Gaya untuk row yang membungkus 2 kolom prestasi (sama dengan Profil) */
.prestasi-section-row {
  margin-top: 0; /* Menghilangkan margin atas default row jika ada */
}

/* Gaya responsif */
@media (max-width: 768px) {
  .text-h3 {
    font-size: 2rem;
  } /* Kurangi ukuran judul h3 di mobile */
  .text-h4 {
    font-size: 1.8rem;
  } /* Kurangi ukuran judul h4 di mobile */
  .text-h6 {
    font-size: 1rem;
  } /* Kurangi ukuran judul h6 di mobile */
  .q-pa-md {
    padding: 16px !important;
  } /* Sesuaikan padding halaman di mobile */

  /* Sesuaikan lebar garis di mobile jika perlu */
  .section-title::after {
    width: 60px; /* Lebar garis di mobile */
  }

  /* Sesuaikan ukuran font dan line-height di mobile */
  .akademik-text {
    font-size: 0.95rem; /* Sedikit lebih kecil di mobile */
    line-height: 1.5; /* Line-height di mobile */
  }

  .program-title {
    font-size: 1rem !important; /* Ukuran font judul item di mobile */
    line-height: 1.4 !important; /* Line-height untuk judul item di mobile */
  }

  /* Mengatur ulang jarak antar kolom prestasi di mobile (sama dengan Profil) */
  .prestasi-section-row > .col-12 {
    padding-top: 16px !important; /* Sesuaikan padding atas antar kolom yang menumpuk */
    padding-left: 16px !important; /* Sesuaikan padding kiri */
  }
  .prestasi-section-row {
    margin-top: -16px !important;
    margin-left: -16px !important;
  }
}
</style>
