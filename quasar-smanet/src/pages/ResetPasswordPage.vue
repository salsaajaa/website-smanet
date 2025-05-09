<template>
  <q-page class="flex flex-center auth-background">
    <q-card class="auth-card q-pa-md">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold">RESET PASSWORD</div>
        <p v-if="token" class="text-grey-7 q-mt-sm">Masukkan password baru Anda.</p>
        <p v-else class="text-negative q-mt-sm">Token reset password tidak ditemukan.</p>
      </q-card-section>

      <q-card-section v-if="token">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="formData.password"
            label="Password Baru"
            outlined
            dense
            :type="isPasswordVisible ? 'text' : 'password'"
            prefix="🔑"
            :rules="[
              (val) => !!val || 'Password baru harus diisi',
              (val) => val.length >= 6 || 'Password minimal 6 karakter',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>

          <q-input
            v-model="formData.confirmPassword"
            label="Konfirmasi Password Baru"
            outlined
            dense
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            prefix="🔑"
            :rules="[
              (val) => !!val || 'Konfirmasi Password baru harus diisi',
              (val) => val === formData.password || 'Password tidak cocok',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isConfirmPasswordVisible ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
              />
            </template>
          </q-input>

          <q-btn
            label="Reset Password"
            type="submit"
            color="primary"
            size="lg"
            class="full-width auth-button"
            :loading="submitting"
          />
        </q-form>
      </q-card-section>

      <q-card-section v-else class="text-center">
        <q-icon name="error_outline" color="negative" size="xl" class="q-mb-md" />
        <p class="text-negative">Link reset password tidak valid atau sudah kadaluarsa.</p>
        <router-link to="/forgot-password" class="text-primary">Coba lagi</router-link>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <router-link to="/login" class="text-primary">Kembali ke Login</router-link>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const token = ref(null)

const formData = ref({
  password: '',
  confirmPassword: '',
})

const submitting = ref(false)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

onMounted(() => {
  token.value = route.query.token
  console.log('ResetPasswordPage mounted. Token from URL:', token.value)

  if (!token.value) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Token reset password tidak ditemukan di URL.',
      icon: 'error',
    })
  }
})

const onSubmit = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Password baru dan konfirmasi password tidak cocok.',
      icon: 'warning',
    })
    return
  }

  if (!token.value) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Tidak dapat mereset password: Token tidak ditemukan.',
      icon: 'error',
    })
    return
  }

  submitting.value = true

  try {
    const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
      token: token.value,
      password: formData.value.password,
    })

    console.log('Password reset successful:', response.data)

    $q.notify({
      color: 'positive',
      position: 'top',
      message:
        response.data.message ||
        'Password berhasil direset! Silakan login dengan password baru Anda.',
      icon: 'check_circle',
    })

    router.push('/login')
  } catch (error) {
    console.error('Error during password reset:', error)
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Gagal mereset password: ${error.response?.data?.message || error.message || 'Terjadi kesalahan'}`,
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

.q-input :deep(.q-icon) {
  color: rgba(255, 255, 255, 0.8) !important;
}

.auth-button {
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  background-color: #004b87 !important;
  color: #fff !important;
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
