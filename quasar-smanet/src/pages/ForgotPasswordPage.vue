<template>
  <q-page class="flex flex-center auth-background">
    <q-card class="auth-card q-pa-md">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold">LUPA PASSWORD</div>
        <p class="text-grey-7 q-mt-sm">Masukkan email Anda untuk reset password.</p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            outlined
            dense
            type="email"
            prefix="📧"
            :rules="[
              (val) => !!val || 'Email harus diisi',
              (val) => /.+@.+\..+/.test(val) || 'Format email tidak valid',
            ]"
          />

          <q-btn
            label="Kirim Link Reset"
            type="submit"
            color="primary"
            size="lg"
            class="full-width auth-button"
            :loading="submitting"
          />

          <div class="text-center q-mt-md">
            Kembali ke
            <router-link to="/login" class="text-primary"> Login </router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const email = ref('')
const submitting = ref(false)

const onSubmit = async () => {
  submitting.value = true

  try {
    const response = await axios.post('http://localhost:3000/api/auth/forgot-password', {
      email: email.value,
    })

    $q.notify({
      color: 'positive',
      position: 'top',
      message: response.data.message || 'Link reset password telah dikirim ke email Anda.',
      icon: 'check_circle',
    })

    // Optional: Redirect to login page after success
    // router.push('/login')
  } catch (error) {
    console.error('Error during forgot password request:', error)

    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Gagal mengirim link reset: ${
        error.response?.data?.message || error.message || 'Terjadi kesalahan'
      }`,
      icon: 'report_problem',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.auth-background {
  min-height: 100vh;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.q-card-section.text-center {
  padding-bottom: 16px;
}

.q-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.text-h5 {
  color: #fff;
  margin-top: 8px;
}

.q-input {
  color: #fff;
}

.q-input :deep(.q-field__control) {
  color: #fff !important;
}

.q-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.8) !important;
}

.q-input :deep(.q-field__outlined) {
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.q-input :deep(.q-field__bottom) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.q-checkbox {
  color: #fff;
}

.auth-button {
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  background-color: #004b87 !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.auth-button:hover {
  opacity: 0.9;
}

.text-center a {
  text-decoration: none;
  font-weight: 500;
  color: #fff;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.text-center a:hover {
  opacity: 1;
  text-decoration: underline;
}

.q-form .text-center.q-mt-sm {
  margin-top: 10px !important;
  margin-bottom: 10px;
}

.q-form .text-center.q-mt-md {
  margin-top: 16px !important;
}
</style>
