<template>
   
  <q-page class="q-pa-md">
       
    <div class="container">
           
      <div class="text-center q-mb-xl q-mt-lg">
               
        <div class="text-h3 text-weight-bold gradient-text">Berita dan Pengumuman</div>
               
        <p class="text-body1 q-mt-sm text-grey-8 akademik-text">
                    Informasi terbaru dari sekolah kami.        
        </p>
             
      </div>

           
      <q-intersection transition="fade-in" once class="container q-mb-xl">
               
        <div class="row q-col-gutter-lg">
                   
          <div class="col-12 col-md-8">
                       
            <div class="section-title q-mb-md">
                           
              <div class="text-h4 text-black text-weight-bold">Berita Terbaru</div>
                         
            </div>

                       
            <div class="row q-col-gutter-md">
                           
              <div
                v-for="(berita, index) in daftarBerita"
                :key="`berita-grid-${index}`"
                class="col-12 col-sm-6"
              >
                               
                <q-card
                  class="news-card"
                  clickable
                  v-ripple
                  @click="selectContent('berita', berita)"
                >
                                   
                  <q-img
                    :src="
                      berita.gambarUtama ||
                      'https://placehold.co/600x350/E0E0E0/333333?text=Gambar+Berita'
                    "
                    alt="Gambar Berita"
                    height="200px"
                    fit="cover"
                  />

                                   
                  <q-card-section>
                                       
                    <div class="text-h6 text-weight-bold text-black q-mb-sm news-card-title">
                                            {{ berita.judul }}                    
                    </div>
                                       
                    <div class="text-caption text-grey-7">{{ berita.tanggal }}</div>
                                     
                  </q-card-section>
                                 
                </q-card>
                             
              </div>
                         
            </div>
                     
          </div>

                   
          <div class="col-12 col-md-4">
                       
            <q-card class="announcement-list-card">
                           
              <q-card-section>
                               
                <div class="section-title q-mb-md">
                                   
                  <div class="text-h5 text-black text-weight-bold">Pengumuman Terbaru</div>
                                 
                </div>

                               
                <q-list separator>
                                   
                  <q-item
                    v-for="(pengumuman, index) in daftarPengumuman"
                    :key="`pengumuman-${index}`"
                    clickable
                    v-ripple
                    @click="selectContent('pengumuman', pengumuman)"
                    :active="
                      selectedContent &&
                      selectedContent.judul === pengumuman.judul &&
                      contentType === 'pengumuman'
                    "
                    active-class="bg-blue-1 text-primary"
                  >
                                       
                    <q-item-section>
                                           
                      <q-item-label class="text-weight-medium text-black announcement-list-title">{{
                        pengumuman.judul
                      }}</q-item-label>
                                           
                      <q-item-label caption class="text-grey-7">{{
                        pengumuman.tanggal
                      }}</q-item-label>
                                         
                    </q-item-section>
                                     
                  </q-item>
                                 
                </q-list>
                             
              </q-card-section>
                         
            </q-card>
                     
          </div>
                 
        </div>
             
      </q-intersection>

           
      <q-intersection transition="fade-in" once class="container q-mb-xl">
               
        <q-card ref="detailCardRef" class="detail-card">
                   
          <q-card-section>
                       
            <div v-if="selectedContent">
                           
              <div class="text-h4 text-black text-weight-bold q-mb-sm detail-title">
                {{ selectedContent.judul }}
              </div>
                           
              <div class="text-caption text-grey-7 q-mb-md">{{ selectedContent.tanggal }}</div>

                           
              <q-img
                :src="
                  selectedContent.gambarUtama ||
                  'https://placehold.co/1000x600/E0E0E0/333333?text=Gambar+Utama+Konten'
                "
                alt="Gambar Utama Konten"
                class="rounded-borders q-mb-md detail-image"
                fit="cover"
              />

                           
              <p class="text-body1 text-grey-9 akademik-text">{{ selectedContent.isiLengkap }}</p>
                         
            </div>
                       
            <div v-else class="text-center text-grey-7 q-pa-xl">
                            <q-icon name="info" size="lg" class="q-mb-md" />              
              <div class="text-h6">
                                Pilih berita atau pengumuman dari daftar di atas untuk melihat
                detail.              
              </div>
                         
            </div>
                     
          </q-card-section>
                 
        </q-card>
             
      </q-intersection>
         
    </div>
     
  </q-page>
</template>

<script>
import { ref, nextTick } from 'vue' // Import nextTick
// Import komponen Quasar yang dibutuhkan
import {
  QPage,
  QCard,
  QCardSection,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QIntersection,
  QImg,
} from 'quasar'

export default {
  name: 'BeritaPage', // Nama komponen
  components: {
    QPage,
    QCard,
    QCardSection,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    QIntersection,
    QImg, // Tambahkan QImg untuk thumbnail dan gambar utama
  },
  setup() {
    // State untuk menyimpan konten (berita atau pengumuman) yang dipilih
    const selectedContent = ref(null) // State untuk menyimpan jenis konten yang dipilih ('berita' atau 'pengumuman')
    const contentType = ref(null) // Ref untuk card detail agar bisa discroll
    const detailCardRef = ref(null) // Data Placeholder untuk Berita

    const daftarBerita = ref([
      {
        judul: 'SMAN 7 Pinrang Raih Juara Lomba Debat Tingkat Provinsi',
        tanggal: '2025-04-20',
        ringkasan:
          'Tim debat SMAN 7 Pinrang kembali menorehkan prestasi gemilang dengan meraih juara pertama dalam lomba debat tingkat provinsi.',
        thumbnail: 'https://placehold.co/100x80/004B87/ffffff?text=Debat',
        gambarUtama: 'https://placehold.co/800x500/004B87/ffffff?text=Gambar+Berita+1',
        isiLengkap:
          'Tim Study Club Debate and Research (SC-DARE SMANET) berhasil meraih Juara 1 dalam Lomba Debat Ilmiah tingkat SMA se-Sulawesi Selatan yang diselenggarakan di Universitas Muslim Indonesia pada tanggal 18 April 2025. Kompetisi ini diikuti oleh puluhan tim dari berbagai sekolah unggulan di seluruh Sulawesi Selatan. Selain meraih gelar juara tim, salah satu anggota tim SMAN 7 Pinrang, yaitu Ananda Putri, juga dinobatkan sebagai Best Speaker berkat kemampuan argumentasi dan retorika yang luar biasa. Keberhasilan ini tidak lepas dari bimbingan intensif para guru pembina dan kerja keras seluruh anggota tim. Sekolah memberikan apresiasi setinggi-tingginya atas prestasi ini dan berharap dapat memotivasi siswa lain untuk berprestasi di bidang non-akademik maupun akademik.',
      }, // Tambahkan isiLengkap dan gambarUtama
      {
        judul: 'Kegiatan Bakti Sosial Rutin SMAN 7 Pinrang',
        tanggal: '2025-04-15',
        ringkasan:
          'Sebagai bentuk kepedulian terhadap masyarakat sekitar, SMAN 7 Pinrang mengadakan kegiatan bakti sosial di Desa Binaan.',
        thumbnail: 'https://placehold.co/100x80/007BFF/ffffff?text=Sosial',
        gambarUtama: 'https://placehold.co/800x500/007BFF/ffffff?text=Gambar+Berita+2',
        isiLengkap:
          'Pada tanggal 15 April 2025, keluarga besar SMAN 7 Pinrang melaksanakan kegiatan bakti sosial rutin di salah satu desa binaan sekolah yang terletak tidak jauh dari lingkungan sekolah. Kegiatan ini melibatkan siswa, guru, dan staf sekolah dalam berbagai aktivitas sosial, seperti membersihkan lingkungan desa, membagikan sembako kepada warga yang membutuhkan, serta mengadakan penyuluhan singkat mengenai pentingnya kebersihan dan kesehatan. Kepala Sekolah SMAN 7 Pinrang, Bapak/Ibu [Nama Kepala Sekolah], menyampaikan bahwa kegiatan ini merupakan wujud nyata dari nilai-nilai kepedulian sosial yang ditanamkan di sekolah dan diharapkan dapat mempererat tali silaturahmi antara sekolah dengan masyarakat sekitar.',
      },
      {
        judul: 'Lomba Sains Internal Meriahkan Bulan Pendidikan',
        tanggal: '2025-04-10',
        ringkasan:
          'Dalam rangka memperingati Bulan Pendidikan, sekolah menggelar lomba sains internal yang diikuti oleh seluruh siswa dengan antusias.',
        thumbnail: 'https://placehold.co/100x80/1E88E5/ffffff?text=Sains',
        gambarUtama: 'https://placehold.co/800x500/1E88E5/ffffff?text=Gambar+Berita+3',
        isiLengkap:
          'Menyambut Bulan Pendidikan yang jatuh setiap bulan Mei, SMAN 7 Pinrang mengadakan serangkaian kegiatan akademik dan non-akademik. Salah satunya adalah Lomba Sains Internal yang diselenggarakan pada tanggal 10 April 2025. Lomba ini mencakup berbagai bidang sains seperti Matematika, Fisika, Kimia, dan Biologi. Antusiasme siswa terlihat dari banyaknya peserta yang mendaftar dan semangat kompetisi yang tinggi. Kegiatan ini bertujuan untuk mengasah kemampuan berpikir kritis dan analitis siswa serta menumbuhkan minat pada bidang sains. Pemenang lomba akan diumumkan pada upacara bendera tanggal 2 Mei 2025.',
      },
      {
        judul: 'Pelatihan Kepemimpinan Siswa (LDKS) Angkatan Terbaru',
        tanggal: '2025-04-05',
        ringkasan:
          'SMAN 7 Pinrang sukses menggelar Latihan Dasar Kepemimpinan Siswa untuk pengurus OSIS dan MPK periode baru.',
        thumbnail: 'https://placehold.co/100x80/42A5F5/ffffff?text=LDKS',
        gambarUtama: 'https://placehold.co/800x500/42A5F5/ffffff?text=Gambar+Berita+4',
        isiLengkap:
          'Pada tanggal 5-7 April 2025, SMAN 7 Pinrang melaksanakan Latihan Dasar Kepemimpinan Siswa (LDKS) yang diikuti oleh seluruh calon pengurus OSIS dan MPK periode 2025/2026. Kegiatan ini bertempat di [Lokasi LDKS, misal: Bumi Perkemahan Cadika Pinrang] dan diisi dengan berbagai materi dan simulasi kepemimpinan, manajemen organisasi, public speaking, serta pembangunan karakter. Tujuan LDKS ini adalah untuk membekali para calon pengurus dengan keterampilan dan mental yang kuat untuk menjalankan tugas dan tanggung jawab mereka sebagai perwakilan siswa. Kegiatan berjalan lancar dan para peserta menunjukkan semangat serta antusiasme yang tinggi.',
      },
    ]) // Data Placeholder untuk Pengumuman

    const daftarPengumuman = ref([
      {
        judul: 'Pengumuman Libur Hari Raya Idul Fitri 1446 H',
        tanggal: '2025-04-22',
        isiLengkap:
          'Diberitahukan kepada seluruh siswa dan orang tua/wali, bahwa kegiatan belajar mengajar dalam rangka Hari Raya Idul Fitri 1446 H akan diliburkan mulai tanggal 28 April 2025 hingga 5 Mei 2025. Kegiatan belajar mengajar akan aktif kembali pada tanggal 6 Mei 2025. Mohon perhatiannya. Selamat merayakan Idul Fitri!',
        gambarUtama: 'https://placehold.co/800x500/E0E0E0/333333?text=Pengumuman+1',
      }, // Tambahkan gambarUtama
      {
        judul: 'Jadwal Ujian Akhir Semester Genap 2024/2025',
        tanggal: '2025-04-18',
        isiLengkap:
          'Berikut adalah jadwal lengkap pelaksanaan Ujian Akhir Semester Genap tahun ajaran 2024/2025 untuk seluruh tingkatan kelas. Ujian akan dilaksanakan mulai tanggal 10 Juni 2025 hingga 20 Juni 2025. Detail jadwal per mata pelajaran dapat dilihat di papan pengumuman sekolah dan website.',
        gambarUtama: 'https://placehold.co/800x500/E0E0E0/333333?text=Pengumuman+2',
      },
      {
        judul: 'Pendaftaran Ekstrakurikuler Baru Tahun Ajaran 2025/2026',
        tanggal: '2025-04-12',
        isiLengkap:
          'Telah dibuka pendaftaran untuk beberapa pilihan ekstrakurikuler baru pada tahun ajaran mendatang, antara lain Robotik, Jurnalistik Sekolah, dan Desain Grafis. Bagi siswa yang berminat, formulir pendaftaran dapat diambil di ruang kesiswaan mulai tanggal 15 Mei 2025.',
        gambarUtama: 'https://placehold.co/800x500/E0E0E0/333333?text=Pengumuman+3',
      },
      {
        judul: 'Hasil Seleksi Lomba Sains Tingkat Kabupaten',
        tanggal: '2025-04-08',
        isiLengkap:
          'Selamat kepada para siswa yang telah lolos seleksi tahap awal Lomba Sains Tingkat Kabupaten. Daftar nama siswa yang lolos dapat dilihat di papan pengumuman. Persiapan untuk tahap selanjutnya akan diinformasikan segera.',
        gambarUtama: 'https://placehold.co/800x500/E0E0E0/333333?text=Pengumuman+4',
      },
      {
        judul: 'Workshop Penulisan Kreatif untuk Siswa',
        tanggal: '2025-04-01',
        isiLengkap:
          'Sekolah akan mengadakan workshop penulisan kreatif untuk siswa kelas X dan XI pada tanggal 25 Mei 2025 di Aula Sekolah. Workshop ini bertujuan untuk mengembangkan bakat menulis siswa. Pendaftaran terbatas.',
        gambarUtama: 'https://placehold.co/800x500/E0E0E0/333333?text=Pengumuman+5',
      },
    ]) // Fungsi untuk memilih konten (berita atau pengumuman) dari daftar dan scroll

    const selectContent = (type, content) => {
      contentType.value = type
      selectedContent.value = content // Gunakan nextTick untuk memastikan DOM sudah diperbarui sebelum scroll

      nextTick(() => {
        if (detailCardRef.value && detailCardRef.value.$el) {
          detailCardRef.value.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    }

    return {
      selectedContent,
      contentType, // Ekspos contentType
      daftarBerita, // Ekspos data berita
      daftarPengumuman,
      selectContent,
      detailCardRef, // Ekspos ref
    }
  },
}
</script>

<style scoped>
/* Gaya spesifik untuk halaman Berita dan Pengumuman */

/* Gaya untuk judul utama dengan gradasi */
.gradient-text {
  /* Menggunakan background gradient */
  background: linear-gradient(to right, #004b87, #007bff); /* Sesuaikan warna gradasi biru SMANET */
  /* Menggunakan text-fill-color dan background-clip untuk menerapkan gradasi pada teks */
  -webkit-background-clip: text; /* Untuk browser Webkit (Chrome, Safari) */
  -webkit-text-fill-color: transparent; /* Membuat teks transparan agar background terlihat */
  background-clip: text;
  text-fill-color: transparent;
  display: inline-block; /* Penting agar background-clip bekerja */
  width: 100%; /* Pastikan elemen mengambil lebar penuh agar text-align bekerja */
  text-align: center !important; /* Memaksa teks di tengah */
}

/* Gaya untuk judul bagian dengan garis bawah */
.section-title {
  position: relative;
  padding-bottom: 10px; /* Jarak antara teks judul dan garis */
  margin-bottom: 20px; /* Jarak antara judul section dan konten di bawahnya */
}

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

/* Gaya untuk judul item Berita di card grid */
.news-card-title {
  font-size: 1.1rem; /* Ukuran font judul item */
  line-height: 1.5; /* Line-height untuk judul item */
  font-weight: bold; /* Memastikan judul item tebal */
  color: #000; /* Memastikan warna judul item hitam */
  /* TAMBAHKAN INI untuk mencegah judul berita meluber */
  overflow-wrap: break-word;
  word-wrap: break-word; /* Fallback */
}

/* Gaya untuk judul item di daftar pengumuman (kanan) */
.announcement-list-title {
  font-size: 1rem; /* Ukuran judul item daftar */
  line-height: 1.4; /* Line-height untuk judul item daftar */
  font-weight: 500; /* Ketebalan medium */
  /* TAMBAHKAN INI untuk mencegah judul pengumuman meluber */
  overflow-wrap: break-word;
  word-wrap: break-word; /* Fallback */
}


/* Gaya untuk teks isi umum (paragraf, ringkasan, isi lengkap) */
.akademik-text {
  line-height: 1.7; /* Line-height sedikit lebih lega */
  font-size: 1rem; /* Ukuran standar text-body1 */
}

/* Gaya untuk card berita di grid */
.news-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%; /* Memastikan tinggi card sama dalam satu baris grid */
  display: flex; /* Menggunakan flexbox untuk layout internal card */
  flex-direction: column; /* Menyusun konten card secara vertikal */
}

.news-card .q-img {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  /* height diatur inline di template */
}

.news-card .q-card-section {
  flex-grow: 1; /* Memastikan section mengambil sisa ruang, penting untuk height: 100% */
  display: flex;
  flex-direction: column;
}

/* Gaya untuk card detail dan card daftar pengumuman */
.detail-card,
.announcement-list-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 32px;
  margin-bottom: 32px;
}

.announcement-list-card {
  /* Opsi tinggi tetap atau tinggi sesuai konten */
  /* height: 500px; */
  /* overflow-y: auto; */ /* Jika ingin daftar bisa discroll jika panjang */
}

/* Gaya untuk gambar utama di detail */
.detail-card .detail-image {
  /* Menggunakan class custom */
  border-radius: 8px; /* Sudut membulat */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* Shadow tipis */
  max-width: 100%; /* Mengambil lebar penuh kolomnya */
  height: auto; /* Tinggi menyesuaikan proporsional */
  max-height: 450px; /* Batasi tinggi maksimal */
  display: block; /* Menghilangkan spasi bawah */
  margin: 0 auto 16px auto; /* Tengahkan gambar dan beri margin bawah */
  object-fit: cover; /* Memastikan gambar pas tanpa merusak rasio aspek */
}

/* Gaya responsif */
@media (max-width: 768px) {
  .text-h3 {
    font-size: 2rem;
  } /* Kurangi ukuran judul h3 di mobile */
  .text-h4 {
    font-size: 1.8rem;
  } /* Kurangi ukuran judul h4 di mobile */
  .text-h5 {
    font-size: 1.3rem;
  } /* Kurangi ukuran h5 di mobile */
  .q-pa-md {
    padding: 16px !important;
  } /* Sesuaikan padding halaman di mobile */

  /* Sesuaikan lebar garis di mobile jika perlu */
  .section-title::after {
    width: 60px; /* Lebar garis di mobile */
  }

  /* Sesuaikan ukuran font dan line-height di mobile */
  .berita-item-title {
    font-size: 1rem; /* Ukuran font judul item di mobile */
    line-height: 1.4; /* Line-height untuk judul item di mobile */
  }
  .akademik-text {
    font-size: 0.95rem; /* Sedikit lebih kecil di mobile */
    line-height: 1.5; /* Line-height di mobile */
  }
  .announcement-list-title {
    font-size: 0.95rem; /* Ukuran judul item daftar di mobile */
    line-height: 1.3; /* Line-height untuk judul item daftar di mobile */
  }

  /* Mengatur ulang jarak antar kolom di mobile (akan menumpuk) */
  .row.q-col-gutter-lg {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .row.q-col-gutter-lg > div {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-bottom: 24px; /* Jarak antar kolom yang menumpuk */
  }

  /* Jika daftar pengumuman di kanan dibuat scrollable, sesuaikan tingginya di mobile */
  /* .announcement-list-card {
         height: 300px;
     } */

  /* Ukuran gambar detail di mobile */
  .detail-card .detail-image {
    max-width: 100%; /* Lebar penuh di mobile */
    max-height: 250px; /* Batasi tinggi di mobile */
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
