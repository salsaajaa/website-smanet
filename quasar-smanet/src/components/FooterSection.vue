<template>
  <div class="footer-section-quasar">
    <div class="container">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <div class="flex items-center q-mb-md">
            <img src="../assets/logoosman7.png" alt="Logo SMAN 7 Pinrang" class="footer-logo" />
            <div class="text-h6 q-ml-sm">SMA NEGERI 7 PINRANG</div>
          </div>
          <p class="text-body2">
            Alamat: Jln. Poros Pinrang Parepare Km.8, Bua, Kec. Mattirobulu, Kab. Pinrang
          </p>
          <p class="text-body2">NPSN: 40314430</p>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h6 q-mb-md">Main Navigation</div>
          <q-list dense>
            <q-item clickable tag="a" href="/" target="_self" class="footer-nav-link">
              <q-item-section>Beranda</q-item-section>
            </q-item>
            <q-item clickable tag="a" href="/profil" target="_self" class="footer-nav-link">
              <q-item-section>Profil</q-item-section>
            </q-item>
            <q-item clickable tag="a" href="/akademik" target="_self" class="footer-nav-link">
              <q-item-section>Akademik</q-item-section>
            </q-item>
            <q-item clickable tag="a" href="/berita" target="_self" class="footer-nav-link">
              <q-item-section>Berita</q-item-section>
            </q-item>
            <q-item clickable tag="a" href="/dashboard" target="_self" class="footer-nav-link">
              <q-item-section>Dash7</q-item-section>
            </q-item>
            <q-item clickable tag="a" href="/kontak" target="_self" class="footer-nav-link">
              <q-item-section>Kontak</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h6 q-mb-md">Follow Us</div>
          <div class="q-gutter-sm">
            <a
              href="https://www.facebook.com/share/19oYmtPDxz/"
              target="_blank"
              aria-label="Facebook"
            >
              <q-icon name="facebook" class="footer-social-icon" />
            </a>
            <a
              href="https://www.instagram.com/uptsman7pinrang?igsh=dGhiYmxwbTc0NWdk"
              target="_blank"
              aria-label="Instagram"
            >
              <q-icon name="fab fa-instagram" class="footer-social-icon" />
            </a>
            <a
              href="https://youtube.com/@sman7pinrang198?si=lF--B9rVy6zEVLs_"
              target="_blank"
              aria-label="YouTube"
            >
              <q-icon name="fab fa-youtube" class="footer-social-icon" />
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom text-center q-mt-lg q-pt-md">
        <p class="text-body2">© 2025 SMA Negeri 7 Pinrang. Semua hak dilindungi.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { QIcon, QList, QItem, QItemSection } from 'quasar'

export default {
  name: 'FooterSection',
  components: {
    QIcon,
    QList,
    QItem,
    QItemSection,
  },
}
</script>

<style scoped lang="css">
/* Mengimpor font Inter dari Google Fonts (jika belum diimpor di tempat lain) */
/* @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); */

.footer-section-quasar {
  background-color: rgb(27, 25, 25);
  color: white;
  padding: 40px 0;
  width: 100%;
  box-sizing: border-box;
  /* Menerapkan font family jika diinginkan di footer */
  /* font-family: 'Inter', sans-serif; */
}

.container {
  max-width: 1200px; /* Sesuaikan dengan lebar container utama aplikasi Anda */
  margin: 0 auto;
  padding: 0 15px; /* Sesuaikan padding horizontal */
}

.footer-logo {
  height: 60px;
  margin-right: 16px;
}

.text-h6 {
  color: #f0f0f0;
  /* Menerapkan font family jika diinginkan di judul footer */
  /* font-family: 'Inter', sans-serif; */
}

.footer-nav-link {
  color: rgba(255, 255, 255, 0.8);
  padding: 4px 0;
  min-height: unset !important;
  /* Menerapkan font family jika diinginkan di link navigasi footer */
  /* font-family: 'Inter', sans-serif; */
}

.footer-nav-link:hover {
  color: white;
  background-color: transparent !important;
}

.footer-social-icon {
  font-size: 24px;
  color: white;
  transition: color 0.3s ease;
  /* Menerapkan font family jika diinginkan di ikon sosial footer */
  /* font-family: 'Inter', sans-serif; */
}

.footer-social-icon:hover {
  color: #ffcc00;
}

.footer-bottom {
  border-top: 1px solid rgba(55, 47, 47, 0.8);
  /* Menerapkan font family jika diinginkan di teks copyright footer */
  /* font-family: 'Inter', sans-serif; */
}

.footer-bottom p {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .footer-section-quasar {
    padding: 30px 0;
  }
  .footer-logo {
    height: 50px;
  }
  .text-h6.q-mb-md {
    margin-bottom: 8px !important;
  }
  .q-list.dense .q-item {
    padding: 2px 0;
  }
}
</style>
