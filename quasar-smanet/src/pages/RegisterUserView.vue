<template>
  <q-page class="flex flex-center auth-background">
    <q-card class="auth-card q-pa-md">
      <q-card-section class="text-center">
        <q-img
          src="../assets/logoosman7.png"
          alt="Logo SMAN 7 PINRANG"
          style="width: 80px; height: 80px"
          class="q-mb-md"
        />
        <div class="text-h5 text-weight-bold">DAFTAR AKUN BARU</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="formData.email"
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

          <q-input
            v-model="formData.password"
            label="Password"
            outlined
            dense
            :type="isPasswordVisible ? 'text' : 'password'"
            prefix="🔑"
            :rules="[
              (val) => !!val || 'Password harus diisi',
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
            label="Konfirmasi Password"
            outlined
            dense
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            prefix="🔑"
            :rules="[
              (val) => !!val || 'Konfirmasi Password harus diisi',
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
            label="Daftar"
            type="submit"
            color="primary"
            size="lg"
            class="full-width auth-button"
            :loading="submitting"
          />

          <div class="text-center q-mt-md">
            Sudah punya akun?
            <router-link to="/login" class="text-primary">Login di sini</router-link>
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
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
})

const submitting = ref(false)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const onSubmit = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Password dan konfirmasi password tidak cocok.',
      icon: 'warning',
    })
    return
  }

  submitting.value = true
  try {
    // UBAH PORT DARI 8000 MENJADI 3000 SESUAI BACKEND ANDA
    const response = await axios.post('http://localhost:3000/api/auth/signup', {
      email: formData.value.email,
      password: formData.value.password,
    })

    $q.notify({
      color: 'positive',
      position: 'top',
      message: response.data.message || 'Pendaftaran berhasil! Silakan login.',
      icon: 'check_circle',
    })

    router.push('/login')
  } catch (error) {
    console.error('Error during sign up:', error)
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Gagal mendaftar: ${error.response?.data?.message || error.message || 'Terjadi kesalahan'}`,
      icon: 'report_problem',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
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
