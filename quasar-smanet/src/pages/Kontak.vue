<template>
  <q-page class="q-pa-md">
    <div class="container">
      <div class="text-center q-mb-xl q-mt-lg">
        <div class="text-h3 text-weight-bold gradient-text">Kontak Kami</div>
        <p class="text-body1 q-mt-sm text-grey-8 akademik-text">
          Hubungi kami untuk informasi lebih lanjut.
        </p>
      </div>

      <div class="row q-col-gutter-xl q-mb-xl">
        <div class="col-12 col-md-6">
          <div class="section-heading text-h5 text-weight-bold text-grey-10 q-mb-md">
            Informasi Kontak
          </div>
          <q-separator class="q-mb-md" />

          <div class="contact-info-list">
            <div class="contact-item q-mb-md">
              <div class="row items-center">
                <q-icon name="place" class="text-grey-8 q-mr-sm" size="sm" />
                <span class="text-subtitle1 text-weight-medium text-grey-9">Alamat:</span>
              </div>
              <p class="text-body2 text-grey-8 q-ml-xl akademik-text">
                Jln Poros Pinrang-Parepare Km. 8, Bua, Lepolissalo, Pinrang
              </p>
            </div>

            <div class="contact-item q-mb-md">
              <div class="row items-center">
                <q-icon name="phone" class="text-grey-8 q-mr-sm" size="sm" />
                <span class="text-subtitle1 text-weight-medium text-grey-9">Telepon:</span>
              </div>
              <p class="text-body2 text-grey-8 q-ml-xl akademik-text">085337456722</p>
            </div>

            <div class="contact-item q-mb-md">
              <div class="row items-center">
                <q-icon name="email" class="text-grey-8 q-mr-sm" size="sm" />
                <span class="text-subtitle1 text-weight-medium text-grey-9">Email:</span>
              </div>
              <p class="text-body2 text-grey-8 q-ml-xl akademik-text">
                smanmetro7pinrang@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="section-heading text-h5 text-weight-bold text-grey-10 q-mb-md">
            Lokasi Kami
          </div>
          <q-separator class="q-mb-md" />

          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.7800249373713!2d119.63011187502184!3d-3.857326096116465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d95b2f42827e437%3A0x79b6d99ee535f1a2!2sSMA%20Negeri%207%20Pinrang!5e0!3m2!1sid!2sid!4v1745503186680!5m2!1sid!2sid"
              width="100%"
              height="350"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </div>
      </div>

      <div class="q-mt-xl q-pa-md form-section-container">
        <div class="section-heading text-h5 text-weight-bold text-grey-10 q-mb-md">Kirim Pesan</div>
        <q-separator class="q-mb-md" />

        <q-form @submit.prevent="submitForm">
          <div class="q-gutter-md">
            <q-input
              outlined
              v-model="form.name"
              label="Nama Anda"
              :rules="[(val) => !!val || 'Nama harus diisi']"
            />
            <q-input
              outlined
              v-model="form.email"
              label="Email Anda"
              type="email"
              :rules="[
                (val) => !!val || 'Email harus diisi',
                (val) => /.+@.+\..+/.test(val) || 'Format email tidak valid',
              ]"
            />
            <q-input
              outlined
              v-model="form.message"
              label="Pesan Anda"
              type="textarea"
              :rules="[(val) => !!val || 'Pesan harus diisi']"
            />
            <q-btn
              label="KIRIM PESAN"
              type="submit"
              color="primary"
              :disable="isSubmitting"
              :loading="isSubmitting"
              class="full-width"
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { BASE_API_URL } from '../boot/config'

const $q = useQuasar()

const form = ref({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)

const submitForm = async () => {
  console.log('Form submitted:', form.value)

  if (!form.value.name || !form.value.email || !form.value.message) {
    $q.notify({
      color: 'warning',
      message: 'Mohon lengkapi semua field form.',
      position: 'top',
      icon: 'warning',
    })
    return
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(form.value.email)) {
    $q.notify({
      color: 'warning',
      message: 'Format email tidak valid.',
      position: 'top',
      icon: 'warning',
    })
    return
  }

  const backendUrl = BASE_API_URL + '/api/contact'

  isSubmitting.value = true

  try {
    const response = await axios.post(backendUrl, form.value)

    console.log('Response from backend:', response.data)

    $q.notify({
      color: 'positive',
      message: response.data.message || 'Pesan berhasil terkirim!',
      position: 'top',
      icon: 'check_circle',
    })

    form.value.name = ''
    form.value.email = ''
    form.value.message = ''
  } catch (error) {
    console.error('Error submitting form:', error)

    let errorMessage = 'Gagal mengirim pesan. Silakan coba lagi.'

    if (error.response) {
      console.error('Error response data:', error.response.data)
      console.error('Error response status:', error.response.status)
      errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        `Server merespon dengan status: ${error.response.status}`
    } else if (error.request) {
      console.error('Error request:', error.request)
      errorMessage = 'Tidak dapat terhubung ke server. Mohon coba lagi nanti.'
    } else {
      console.error('General error:', error.message)
      errorMessage = `Terjadi kesalahan: ${error.message}`
    }

    $q.notify({
      color: 'negative',
      message: errorMessage,
      position: 'top',
      icon: 'report_problem',
      timeout: 5000,
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-page-container {
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.gradient-text {
  background: linear-gradient(to right, #004b87, #007bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent; /* Pastikan color juga diset transparent */
  display: inline-block;
  width: 100%;
  text-align: center !important;
}

.akademik-text {
  line-height: 1.6;
  font-size: 1rem;
}

.section-heading {
}

.contact-info-list {
}

.contact-item {
}

.contact-item .row.items-center {
  margin-bottom: 4px;
}

.contact-item .text-subtitle1 {
  font-size: 1rem;
}

.contact-item p {
  margin-bottom: 0;
}

.contact-item .q-icon {
}

.map-container {
  position: relative;
  overflow: hidden;
  height: 350px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.form-section-container {
  border-radius: 8px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 24px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }
  .text-h3 {
    font-size: 1.8rem;
  }
  .text-body1 {
    font-size: 0.9rem;
  }
  .section-heading {
    font-size: 1.3rem;
  }
  .text-subtitle1 {
    font-size: 0.95rem;
  }
  .akademik-text {
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .row.q-col-gutter-xl {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .row.q-col-gutter-xl > div {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-bottom: 24px;
  }

  .col-12 .map-container {
    height: 300px;
    margin-top: 16px;
  }

  .form-section-container {
    padding: 16px !important;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 16px !important;
  }
}
</style>
