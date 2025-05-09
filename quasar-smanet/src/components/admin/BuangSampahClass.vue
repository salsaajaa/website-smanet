<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">Kelas Buang Sampah Hari Ini</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit="saveBuangSampahClass">
        <q-input
          v-model="buangSampahData.className"
          label="Nama Kelas"
          outlined
          dense
          class="q-mb-md"
          :rules="[(val) => !!val || 'Nama kelas wajib diisi']"
        />
        <q-input
          v-model="buangSampahData.description"
          label="Deskripsi (Opsional)"
          outlined
          dense
          type="textarea"
          rows="3"
          class="q-mb-md"
        />
        <q-btn
          label="Simpan Kelas Buang Sampah"
          color="primary"
          type="submit"
          :loading="loading"
          class="full-width"
        />
      </q-form>
    </q-card-section>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const buangSampahData = ref({
  className: '',
  description: '',
})

const loading = ref(false)

const fetchBuangSampahClass = async () => {
  loading.value = true
  try {
    const response = await api.get('/admin/dashboard/buang-sampah')
    console.log('BuangSampahClass: Fetched data:', response.data)
    if (response.data) {
      buangSampahData.value = response.data
    }
  } catch (error) {
    console.error('BuangSampahClass: Error fetching data:', error)
    $q.notify({
      color: 'negative',
      message: 'Gagal memuat data Kelas Buang Sampah: ' + (error.message || 'Terjadi kesalahan'),
      icon: 'report_problem',
    })
  } finally {
    loading.value = false
  }
}

const saveBuangSampahClass = async () => {
  loading.value = true
  try {
    const response = await api.post('/admin/dashboard/buang-sampah', buangSampahData.value)
    console.log('BuangSampahClass: Data saved successfully:', response.data)
    $q.notify({
      color: 'positive',
      message: 'Data Kelas Buang Sampah berhasil disimpan',
      icon: 'check_circle',
    })
    fetchBuangSampahClass()
  } catch (error) {
    console.error('BuangSampahClass: Error saving data:', error)
    $q.notify({
      color: 'negative',
      message: 'Gagal menyimpan data Kelas Buang Sampah: ' + (error.message || 'Terjadi kesalahan'),
      icon: 'report_problem',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBuangSampahClass()
})
</script>

<style scoped></style>
