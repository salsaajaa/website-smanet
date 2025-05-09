<template>
  <q-page padding>
    <h5 class="text-h5 q-mt-none q-mb-md">Dashboard Admin SMANET</h5>

    <p class="text-grey-7">
      Selamat datang di Dashboard Admin. Di sini Anda bisa melihat ringkasan data dan mengakses
      fitur manajemen konten.
    </p>

    <q-separator class="q-my-lg" />

    <div v-if="dashboardStore.loading" class="text-center q-py-md">
      <q-spinner size="50px" color="primary" />
      <p class="q-mt-sm">Memuat ringkasan dashboard...</p>
    </div>

    <div v-else-if="dashboardStore.error" class="q-mb-md">
      <q-banner dense rounded class="bg-red-2 text-red">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Gagal memuat ringkasan dashboard:
        {{ dashboardStore.error.message || dashboardStore.error || 'Terjadi kesalahan' }}
      </q-banner>
    </div>

    <div v-else-if="dashboardStore.summary" class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Total Berita</div>
            <div class="text-h4">
              {{
                dashboardStore.summary.total_news !== undefined
                  ? dashboardStore.summary.total_news
                  : '-'
              }}
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="KELOLA BERITA" @click="goToPage('/admin/kelola-berita')" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Total Pengumuman</div>
            <div class="text-h4">
              {{
                dashboardStore.summary.total_announcements !== undefined
                  ? dashboardStore.summary.total_announcements
                  : '-'
              }}
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="KELOLA PENGUMUMAN" @click="goToPage('/admin/kelola-pengumuman')" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Pesan Kontak Baru</div>
            <div class="text-h4">
              {{
                dashboardStore.summary.new_contact_messages !== undefined
                  ? dashboardStore.summary.new_contact_messages
                  : '-'
              }}
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="LIHAT PESAN" @click="goToPage('/admin/pesan-kontak')" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else class="q-mb-md">
      <q-banner dense rounded class="bg-blue-2 text-blue">
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        Tidak ada data ringkasan dashboard yang tersedia.
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '../../stores/dashboardStore'
// import { useAuthStore } from '../../stores/auth'

// const $q = useQuasar()
const router = useRouter()
// const authStore = useAuthStore()

const dashboardStore = useDashboardStore()

onMounted(() => {
  console.log('AdminDashboardHub.vue mounted. Fetching summary data from store.')
  dashboardStore.fetchDashboardSummary()
})

const goToPage = (path) => {
  router.push(path)
}
</script>

<style scoped>
.my-card {
  width: 100%;
}
</style>
