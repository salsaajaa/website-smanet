// src/boot/pinia.js

import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'

export default boot(({ app }) => {
  // Buat instance Pinia
  const pinia = createPinia()

  // Pasang Pinia ke instance aplikasi Vue
  app.use(pinia)

  // Opsional: Bisa tambahkan store atau plugin Pinia di sini jika diperlukan saat boot
  // Contoh:
  // pinia.use(somePiniaPlugin)

  // Buat Pinia instance bisa diakses di boot file lain atau di luar setup/options API jika perlu (jarang)
  // app.config.globalProperties.$pinia = pinia
})
