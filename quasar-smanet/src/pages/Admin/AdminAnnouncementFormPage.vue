<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ isEditMode ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru' }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="saveAnnouncement">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-8">
              <q-input
                v-model="announcementData.title"
                label="Judul Pengumuman"
                outlined
                dense
                :rules="[(val) => !!val || 'Judul wajib diisi']"
              />

              <q-editor
                v-model="announcementData.content"
                label="Konten Pengumuman"
                outlined
                dense
                min-height="10rem"
                :rules="[(val) => !!val || 'Konten wajib diisi']"
                class="q-mt-md"
              />

              <q-select
                v-model="announcementData.status"
                label="Status"
                :options="['draft', 'published']"
                outlined
                dense
                class="q-mt-md"
              />

              <q-input
                v-model="announcementData.published_at"
                label="Tanggal Publikasi"
                outlined
                dense
                type="date"
                class="q-mt-md"
              >
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-card class="q-mb-md">
                <q-card-section>
                  <div class="text-subtitle1">Gambar Cover</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <q-img
                    v-if="previewImageUrl"
                    :src="previewImageUrl"
                    spinner-color="white"
                    style="height: 150px; max-width: 200px"
                    fit="contain"
                    class="q-mb-md"
                  />
                  <div v-else class="text-center text-grey q-mb-md">Tidak ada gambar</div>

                  <q-file
                    v-model="announcementData.imageFile"
                    label="Pilih Gambar"
                    outlined
                    dense
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="handleImageSelect"
                    clearable
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>

                  <q-btn
                    v-if="announcementData.image_url && !announcementData.imageFile"
                    label="Hapus Gambar yang Ada"
                    flat
                    color="negative"
                    size="sm"
                    class="q-mt-sm"
                    @click="removeExistingImage"
                  />
                </q-card-section>
              </q-card>

              <q-btn
                label="Simpan"
                color="primary"
                type="submit"
                :loading="announcementStore.loading"
                class="full-width"
              />

              <q-btn
                label="Batal"
                color="negative"
                outline
                class="full-width q-mt-md"
                @click="router.back()"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnnouncementStore } from '../../stores/announcementStore'
import { useQuasar } from 'quasar'
import { BASE_API_URL } from '../../boot/config'

const route = useRoute()
const router = useRouter()
const announcementStore = useAnnouncementStore()
const $q = useQuasar()

const announcementId = ref(route.params.id)
const isEditMode = ref(!!announcementId.value)

const announcementData = ref({
  title: '',
  content: '',
  status: 'draft',
  published_at: null,
  imageFile: null,
  image_url: null,
})

const previewImageUrl = ref(null)

watch(
  () => announcementData.value.imageFile,
  (newFile) => {
    if (newFile instanceof File) {
      previewImageUrl.value = URL.createObjectURL(newFile)
    } else {
      if (!announcementData.value.image_url) {
        previewImageUrl.value = null
      }
    }
  },
)

watch(
  () => announcementData.value.image_url,
  (newUrl) => {
    if (newUrl && typeof newUrl === 'string') {
      if (!announcementData.value.imageFile) {
        previewImageUrl.value = getFullImageUrl(newUrl)
      }
    } else if (newUrl === null) {
      if (!announcementData.value.imageFile) {
        previewImageUrl.value = null
      }
    }
  },
)

const handleImageSelect = (file) => {
  if (file instanceof File) {
    announcementData.value.imageFile = file
  } else {
    announcementData.value.imageFile = null
  }
}

const removeExistingImage = () => {
  announcementData.value.image_url = null
  announcementData.value.imageFile = null
}

const getFullImageUrl = (imagePath) => {
  if (imagePath && typeof imagePath === 'string' && imagePath.startsWith('/uploads/')) {
    // PASTIKAN PORT INI SESUAI DENGAN PORT BACKEND ANDA (3000)
    return BASE_API_URL + imagePath
  }
  return imagePath
}

const saveAnnouncement = async () => {
  console.log('AdminAnnouncementFormPage: Preparing announcement data...')

  const dataToSave = {
    ...announcementData.value,
  }

  if (dataToSave.hasOwnProperty('slug')) {
    delete dataToSave.slug
  }

  if (dataToSave.imageFile) {
    delete dataToSave.image_url
  } else if (dataToSave.image_url === null && isEditMode.value) {
    dataToSave.removeExistingImage = true
  }

  if (dataToSave.published_at === '') {
    dataToSave.published_at = null
  }

  try {
    console.log('AdminAnnouncementFormPage: Saving announcement data:', dataToSave)
    const result = await announcementStore.saveAnnouncement(dataToSave, announcementId.value)

    console.log('AdminAnnouncementFormPage: Announcement data saved successfully.', result)

    $q.notify({
      color: 'positive',
      message: `Pengumuman berhasil ${isEditMode.value ? 'diupdate' : 'dibuat'}`,
      icon: 'check_circle',
    })

    router.push('/admin/kelola-pengumuman')
  } catch (error) {
    console.error('AdminAnnouncementFormPage: Error saving announcement data:', error)
    $q.notify({
      color: 'negative',
      message: `Gagal menyimpan pengumuman: ${error.message || 'Terjadi kesalahan'}`,
      icon: 'report_problem',
    })
  }
}

const fetchAnnouncementItem = async (id) => {
  console.log(`AdminAnnouncementFormPage: Fetching announcement item ID ${id} for editing.`)
  await announcementStore.fetchAnnouncementById(id)
  if (announcementStore.error) {
    $q.notify({
      color: 'negative',
      message:
        'Gagal memuat data pengumuman untuk edit: ' +
        (announcementStore.error.message || 'Terjadi kesalahan'),
      icon: 'report_problem',
    })
    router.push('/admin/kelola-pengumuman')
  } else if (announcementStore.currentAnnouncementItem) {
    announcementData.value.title = announcementStore.currentAnnouncementItem.title
    announcementData.value.content = announcementStore.currentAnnouncementItem.content
    announcementData.value.status = announcementStore.currentAnnouncementItem.status
    announcementData.value.published_at = announcementStore.currentAnnouncementItem.published_at
      ? announcementStore.currentAnnouncementItem.published_at.split('T')[0]
      : null
    announcementData.value.image_url = announcementStore.currentAnnouncementItem.image_url
  }
}

onMounted(() => {
  console.log(
    `AdminAnnouncementFormPage mounted. isEditMode: ${isEditMode.value}, Announcement ID: ${announcementId.value}`,
  )
  if (isEditMode.value && announcementId.value) {
    fetchAnnouncementItem(announcementId.value)
  }
})
</script>

<style scoped></style>
