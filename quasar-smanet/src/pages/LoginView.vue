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
        <div class="text-h5 text-weight-bold">LOGIN ADMIN</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md" ref="loginForm">
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
            autocomplete="email"
          />

          <q-input
            v-model="formData.password"
            label="Password"
            outlined
            dense
            :type="isPasswordVisible ? 'text' : 'password'"
            prefix="🔑"
            :rules="[(val) => !!val || 'Password harus diisi']"
            autocomplete="current-password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>

          <q-checkbox v-model="rememberMe" label="Ingat Saya" dense />

          <q-btn
            label="Login"
            type="submit"
            color="primary"
            size="lg"
            class="full-width auth-button"
            :loading="submitting"
          />

          <div class="text-center q-mt-sm">
            <router-link to="/forgot-password" class="text-primary">Lupa password?</router-link>
          </div>

          <div class="text-center q-mt-md">
            Belum punya akun?
            <router-link to="/register" class="text-primary">Daftar di sini</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: '',
})

const submitting = ref(false)
const isPasswordVisible = ref(false)
const rememberMe = ref(false)

const loginForm = ref(null)

onMounted(() => {
  const savedEmail = localStorage.getItem('rememberedEmail')
  if (savedEmail) {
    formData.value.email = savedEmail
    rememberMe.value = true
  }
})

const onSubmit = async () => {
  const formIsValid = await loginForm.value.validate()

  if (!formIsValid) {
    return
  }

  submitting.value = true
  try {
    console.log('LoginView: Mengirim data login:', {
      email: formData.value.email,
      password: formData.value.password,
    })

    await authStore.login({
      email: formData.value.email,
      password: formData.value.password,
    })

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Login berhasil!',
      icon: 'check_circle',
    })

    const redirectPath = router.currentRoute.value.query.redirect || '/admin'
    router.push(redirectPath)
  } catch (error) {
    console.error('Error during login:', error)
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `Gagal login: ${error.response?.data?.message || error.message || 'Terjadi kesalahan'}`,
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
  /* Mengubah max-width untuk membuat kartu lebih lebar */
  max-width: 600px; /* Meningkatkan nilai, misalnya 600px */
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

.q-input :deep(input:-webkit-autofill),
.q-input :deep(input:-webkit-autofill:hover),
.q-input :deep(input:-webkit-autofill:focus),
.q-input :deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset !important;
  -webkit-text-fill-color: #fff !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
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
