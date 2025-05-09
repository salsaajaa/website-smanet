<template>
  <q-layout view="lHh Lpr lFf">
    <div ref="headerElementsRef">
      <TopBar />
      <HeaderSection />
    </div>

    <div ref="navbarRef" :class="{ 'navbar-sticky-js': isNavbarSticky }">
      <Navbar />
    </div>

    <q-page-container :style="pageContainerPaddingStyle">
      <router-view />
    </q-page-container>

    <FooterSection />
  </q-layout>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
// Pastikan path import komponen ini benar relatif dari src/layouts/
// Contoh: '../components/NamaKomponen.vue' jika komponen ada di src/components
import TopBar from '../components/TopBar.vue'
import HeaderSection from '../components/HeaderSection.vue'
import Navbar from '../components/Navbar.vue'
import FooterSection from '../components/FooterSection.vue'

// Jika Anda perlu menggunakan Pinia Store di Layout ini,
// pastikan inisialisasi Pinia sudah dilakukan di main.js
// dan store sudah terdefinisi.
// Contoh import store (jika diperlukan dan sudah dibuat):
// import { useAuthStore } from 'stores/auth';

export default {
  name: 'MainLayout', // Nama komponen adalah MainLayout
  components: {
    TopBar,
    HeaderSection,
    Navbar,
    FooterSection,
  },
  setup() {
    const isNavbarSticky = ref(false)
    const headerElementsRef = ref(null)
    const navbarRef = ref(null)
    let scrollThreshold = 0
    const navbarHeight = ref(0)

    // Jika Anda perlu menggunakan store Pinia di sini, aktifkan baris ini:
    // const authStore = useAuthStore();

    const pageContainerPaddingStyle = computed(() => ({
      paddingTop: isNavbarSticky.value ? `${navbarHeight.value}px` : '0',
    }))

    const calculateHeights = () => {
      nextTick(() => {
        if (headerElementsRef.value) {
          scrollThreshold = headerElementsRef.value.offsetHeight
        }
        if (navbarRef.value) {
          navbarHeight.value = navbarRef.value.offsetHeight
        }
      })
    }

    const handleScroll = () => {
      isNavbarSticky.value = window.scrollY > scrollThreshold
    }

    onMounted(() => {
      calculateHeights()
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', calculateHeights)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.addEventListener('resize', calculateHeights)
    })

    return {
      isNavbarSticky,
      headerElementsRef,
      navbarRef,
      pageContainerPaddingStyle,
      // Jika menggunakan store Pinia, ekspos store jika perlu di template:
      // authStore,
    }
  },
}
</script>

<style lang="css">
/* Impor font Poppins dari Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

/* Reset margin dan padding default body, dan set font-family di sini */
body {
  margin: 0;
  padding: 0 !important;
  overflow-x: hidden !important;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
}

/* Gaya untuk Navbar saat menjadi sticky */
.navbar-sticky-js {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 999;
}

/* Gaya untuk page container */
.q-page-container {
  background-color: #f7f7f7;
}

/* Gaya untuk container konten utama (jika digunakan di halaman spesifik) */
/* Jika Anda sudah punya .container global di app.sass atau App.vue,
   Anda bisa hapus gaya ini di sini agar tidak duplikasi/konflik. */
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Gaya untuk elemen #app */
/* Hapus font-family di sini jika sudah dipindahkan ke body */
#app {
  /* font-family: 'Poppins', sans-serif; <-- Hapus baris ini jika ada dan sudah di body */
  color: #333;
}
</style>
