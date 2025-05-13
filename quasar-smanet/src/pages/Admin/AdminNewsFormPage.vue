<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ isEditMode ? 'Edit Berita' : 'Tambah Berita Baru' }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="saveNews">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-8">
              <q-input
                v-model="newsData.title"
                label="Judul Berita"
                outlined
                dense
                :rules="[(val) => !!val || 'Judul wajib diisi']"
              />
              <q-editor
                v-model="newsData.content"
                label="Konten Berita"
                outlined
                dense
                min-height="10rem"
                :rules="[(val) => !!val || 'Konten wajib diisi']"
              />
              <q-select
                v-model="newsData.status"
                label="Status"
                :options="['draft', 'published']"
                outlined
                dense
                class="q-mt-md"
              />
              <q-input
                v-model="newsData.published_at"
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
                    v-model="newsData.imageFile"
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
                    v-if="newsData.image_url && !newsData.imageFile"
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
                :loading="newsStore.loading"
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
import { useNewsStore } from '../../stores/newsStore'
import { useQuasar } from 'quasar'
import { BASE_API_URL } from '../../boot/config'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const $q = useQuasar()

const newsId = ref(route.params.id)
const isEditMode = ref(!!newsId.value)

const newsData = ref({
  title: '',
  content: '',
  status: 'draft',
  published_at: null,
  imageFile: null,
  image_url: null,
})

const previewImageUrl = ref(null)

watch(
  () => newsData.value.imageFile,
  (newFile) => {
    if (newFile instanceof File) {
      previewImageUrl.value = URL.createObjectURL(newFile)
    } else {
      if (!newsData.value.image_url) {
        previewImageUrl.value = null
      }
    }
  },
)

watch(
  () => newsData.value.image_url,
  (newUrl) => {
    if (newUrl && typeof newUrl === 'string') {
      if (!newsData.value.imageFile) {
        previewImageUrl.value = getFullImageUrl(newUrl)
      }
    } else if (newUrl === null) {
      if (!newsData.value.imageFile) {
        previewImageUrl.value = null
      }
    }
  },
)

const handleImageSelect = (file) => {
  if (file instanceof File) {
    newsData.value.imageFile = file
  } else {
    newsData.value.imageFile = null
  }
}

const removeExistingImage = () => {
  newsData.value.image_url = null
  newsData.value.imageFile = null
}

const getFullImageUrl = (imagePath) => {
  if (imagePath && typeof imagePath === 'string' && imagePath.startsWith('/uploads/')) {
    return BASE_API_URL + imagePath
  }
  return imagePath
}

const saveNews = async () => {
  console.log('AdminNewsFormPage: Preparing news data...')
  const dataToSave = { ...newsData.value }

  if (dataToSave.imageFile) {
    delete dataToSave.image_url
  }

  if (dataToSave.published_at) {
  } else {
    dataToSave.published_at = null
  }

  try {
    console.log('AdminNewsFormPage: Saving news data:', dataToSave)
    const result = await newsStore.saveNews(dataToSave, newsId.value)

    console.log('AdminNewsFormPage: News data saved successfully.', result)

    $q.notify({
      color: 'positive',
      message: `Berita berhasil ${isEditMode.value ? 'diupdate' : 'dibuat'}`,
      icon: 'check_circle',
    })

    router.push('/admin/kelola-berita')
  } catch (error) {
    console.error('AdminNewsFormPage: Error saving news data:', error)
    $q.notify({
      color: 'negative',
      message: `Gagal menyimpan berita: ${error.message || 'Terjadi kesalahan'}`,
      icon: 'report_problem',
    })
  }
}

const fetchNewsItem = async (id) => {
  console.log(`AdminNewsFormPage: Fetching news item ID ${id} for editing.`)
  await newsStore.fetchNewsById(id)
  if (newsStore.error) {
    $q.notify({
      color: 'negative',
      message:
        'Gagal memuat data berita untuk edit: ' + (newsStore.error.message || 'Terjadi kesalahan'),
      icon: 'report_problem',
    })
    router.push('/admin/kelola-berita')
  } else if (newsStore.currentNewsItem) {
    newsData.value.title = newsStore.currentNewsItem.title
    newsData.value.content = newsStore.currentNewsItem.content
    newsData.value.status = newsStore.currentNewsItem.status
    newsData.value.published_at = newsStore.currentNewsItem.published_at
      ? newsStore.currentNewsItem.published_at.split('T')[0]
      : null
    newsData.value.image_url = newsStore.currentNewsItem.image_url
  }
}

onMounted(() => {
  console.log(
    `AdminNewsFormPage mounted. isEditMode: ${isEditMode.value}, News ID: ${newsId.value}`,
  )
  if (isEditMode.value && newsId.value) {
    fetchNewsItem(newsId.value)
  }
})
</script>

<style scoped></style>
