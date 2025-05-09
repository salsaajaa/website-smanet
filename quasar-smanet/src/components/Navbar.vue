<template>
  <q-toolbar class="navbar-quasar">
    <div class="nav-container container">
      <q-list class="row no-padding">
        <q-item
          clickable
          v-ripple
          v-for="link in navLinks"
          :key="link.name"
          :to="link.route"
          class="text-white"
          active-class="quasar-nav-active"
        >
          <q-item-section>
            {{ link.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-toolbar>
</template>

<script>
export default {
  name: 'Navbar',
  setup() {
    // Data untuk navigasi (sesuai dengan rute Anda)
    const navLinks = [
      { name: 'Beranda', route: '/' }, // Asumsikan '/' adalah rute Beranda
      { name: 'Profil', route: '/profil' },
      { name: 'Akademik', route: '/akademik' },
      { name: 'Berita', route: '/berita' },
      { name: 'Dash7', route: '/dashboard' }, // Sesuaikan rute jika berbeda
      { name: 'Kontak', route: '/kontak' },
    ]

    return {
      navLinks,
    }
  },
}
</script>

<style scoped>
.navbar-quasar {
  background-color: #005a9c;
  padding: 12px 0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  min-height: unset;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar-quasar .q-list {
  justify-content: center; /* Pusatkan menu seperti di CSS asli */
  align-items: center;
  gap: 24px; /* Jarak antar item menu */
}

.navbar-quasar .q-item {
  text-decoration: none;
  color: #ffffff !important;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.navbar-quasar .q-item:hover {
  background-color: #0073c4 !important;
}

.quasar-nav-active {
  font-weight: bold;
}

@media (max-width: 768px) {
  .navbar-quasar .q-list {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
