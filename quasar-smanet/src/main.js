// src/main.js (Entry point aplikasi Vue)

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// --- HAPUS bagian ini dari main.js ---
// import { createPinia } from 'pinia'; // <-- HAPUS BARIS IMPORT INI
// --- Impor dan Inisialisasi Pinia ---
// const pinia = createPinia(); // <-- HAPUS BARIS INI
// app.use(pinia); // <-- HAPUS BARIS INI
// --- Akhir Impor dan Inisialisasi Pinia ---
// ------------------------------------

// --- Impor dan Inisialisasi Quasar ---
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

// ... sisa import Quasar CSS dan Icons ...
import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'
import './css/app.sass' // Pastikan ini aktif

// --- Akhir Impor dan Inisialisasi Quasar ---

// Buat instance aplikasi Vue
const app = createApp(App)

// Pasang router ke aplikasi Vue
app.use(router)

// Pasang Quasar ke aplikasi Vue
app.use(Quasar, quasarUserOptions)

// Mounting aplikasi ke elemen HTML (biarkan kode workaround Anda di sini)
console.log('Mounting App...') // Log untuk debugging proses mounting

const targetElement = document.querySelector('#q-app') // Pastikan ini #q-app

if (targetElement && targetElement.hasChildNodes()) {
  console.log('App already mounted (#q-app has children), skipping second mount attempt.')
} else {
  app.mount('#q-app') // Pastikan ini #q-app
  console.log('App mounted successfully to #q-app.')
}
