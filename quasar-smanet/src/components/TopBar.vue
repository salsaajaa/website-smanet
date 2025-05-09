<template>
  <q-bar class="top-bar-quasar q-py-xs">
    <div class="top-bar-left-quasar q-pr-md">{{ currentDateTime }}</div>
    <q-space />
    <div class="top-bar-right-quasar">
      <q-btn
        flat
        dense
        icon="lock"
        label="Admin"
        size="sm"
        color="white"
        @click="$router.push('/login/')"
      >
        <q-tooltip>Masuk ke Halaman Admin</q-tooltip>
      </q-btn>
    </div>
  </q-bar>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'TopBar',
  setup() {
    const currentDateTime = ref('')
    let dateTimeInterval = null

    const updateDateTime = () => {
      const now = new Date()
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
      // Menggunakan 'id-ID' untuk format tanggal/waktu Indonesia
      currentDateTime.value = now.toLocaleDateString('id-ID', options)
    }

    onMounted(() => {
      updateDateTime()
      // Update setiap detik
      dateTimeInterval = setInterval(updateDateTime, 1000)
    })

    onUnmounted(() => {
      // Membersihkan interval saat komponen dilepas
      clearInterval(dateTimeInterval)
    })

    return {
      currentDateTime,
    }
  },
}
</script>

<style scoped>
/* Mengimpor font Inter dari Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Menerapkan font Inter ke seluruh elemen dalam komponen ini */
.top-bar-quasar {
  background-color: #1a237e;
  color: white;
  font-size: 16px;
  height: 30px;
  /* Menerapkan font family */
  font-family: 'Inter', sans-serif;
}

/* Menghapus gaya untuk link media sosial karena ikonnya sudah dihapus */
/*
.top-bar-quasar a {
  color: white;
  text-decoration: none;
}

.top-bar-quasar a:hover {
  color: #ffcc00;
}
*/
</style>
