<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Dashboard Admin SMANET </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <div v-if="authStore.user" class="text-subtitle2">
            {{ authStore.user.username || 'Admin' }}
          </div>
          <q-btn flat round dense icon="logout" @click="authStore.logout">
            <q-tooltip>Logout</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu Admin </q-item-label>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'AdminDashboard' }"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'AdminKelolaBerita' }"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="article" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Kelola Berita</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'AdminKelolaPengumuman' }"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="campaign" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Kelola Pengumuman</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'AdminEditDashboard' }"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Edit Dashboard Publik</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'AdminPesanKontak' }"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="email" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pesan Kontak</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />
        <q-item
          clickable
          v-ripple
          :to="{ name: 'Home' }"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Kembali ke Halaman Publik</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const leftDrawerOpen = ref(false)

const authStore = useAuthStore()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
