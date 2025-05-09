<template>
  <q-page padding>
    <div class="q-px-md">
      <q-card class="admin-list-card">
        <q-card-section>
          <div class="text-h6">Pesan Kontak Masuk</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none">
          <q-table
            title=""
            :rows="contactStore.messages"
            :columns="columns"
            row-key="id"
            :loading="contactStore.loading"
            :filter="filter"
            @request="fetchMessages"
            v-model:pagination="pagination"
          >
            <template v-slot:top-right>
              <q-input dense debounce="300" v-model="filter" placeholder="Cari Pesan">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>

            <template v-slot:body-cell-is_read="props">
              <q-td :props="props">
                <q-badge :color="props.row.is_read ? 'green' : 'red'">
                  {{ props.row.is_read ? 'Sudah Dibaca' : 'Belum Dibaca' }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-message="props">
              <q-td :props="props">
                <div class="message-cell">{{ props.row.message }}</div>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  v-if="!props.row.is_read"
                  size="sm"
                  color="primary"
                  icon="mark_email_read"
                  round
                  dense
                  class="q-mr-sm"
                  @click="markAsRead(props.row.id)"
                  :disable="contactStore.actionLoading"
                >
                  <q-tooltip>Tandai Sudah Dibaca</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  round
                  dense
                  @click="confirmDelete(props.row.id)"
                  :disable="contactStore.actionLoading"
                >
                  <q-tooltip>Hapus Pesan</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:no-data="{ icon, message, filter }">
              <div class="full-width row flex-center text-accent q-gutter-sm">
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                <span>
                  {{ message }}
                </span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Anda yakin ingin menghapus pesan ini?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Batal"
            color="primary"
            @click="cancelDelete"
            :disable="contactStore.actionLoading"
          />
          <q-btn
            flat
            label="Hapus"
            color="negative"
            @click="deleteMessageConfirmed"
            :loading="contactStore.actionLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="contactStore.actionLoading">
      <q-spinner color="primary" size="3em" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useContactStore } from '../../stores/contactStore' // Sesuaikan path import

const $q = useQuasar()
const contactStore = useContactStore()

const filter = ref('')
const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  {
    name: 'name',
    label: 'Pengirim',
    field: 'name',
    align: 'left',
    sortable: true,
    style: 'width: 150px',
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true,
    style: 'width: 200px',
  },
  // Hapus kolom subjek
  /*
   {
    name: 'subject',
    label: 'Subjek',
    field: 'subject',
    align: 'left',
    sortable: true,
    classes: 'text-wrap',
    style: 'max-width: 200px; white-space: normal; word-break: break-word;',
   },
   */
  // Kolom untuk pesan
  {
    name: 'message',
    label: 'Pesan',
    field: 'message',
    align: 'left',
    // sortable: true, // Sesuaikan jika pesan panjang
    classes: 'text-wrap', // Gunakan class text-wrap
    style: 'max-width: 350px; white-space: normal; word-break: break-word;',
  },
  // Kolom status dibaca/belum dibaca
  {
    name: 'is_read',
    label: 'Status',
    field: 'is_read', // Pastikan field ini sesuai dengan data dari backend (boolean true/false)
    align: 'center',
    sortable: true,
    style: 'width: 100px',
  },
  // Kolom tanggal dikirim
  {
    name: 'created_at',
    label: 'Dikirim',
    field: 'created_at',
    align: 'left',
    sortable: true,
    format: (val) =>
      val
        ? new Date(val).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '-',
    style: 'width: 150px',
  },
  // Kolom aksi
  { name: 'actions', label: 'Aksi', field: 'actions', align: 'center', style: 'width: 100px' },
]

const showDeleteConfirm = ref(false)
const messageToDeleteId = ref(null)

const fetchMessages = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props?.pagination || pagination.value
  const filterValue = props?.filter !== undefined ? props.filter : filter.value

  console.log('Fetching messages with:', { page, rowsPerPage, sortBy, descending, filterValue })

  await contactStore.fetchAllContactMessages({
    page,
    limit: rowsPerPage,
    sortBy,
    sortOrder: descending ? 'desc' : 'asc',
    filter: filterValue,
  })

  if (contactStore.messages && Array.isArray(contactStore.messages)) {
    // Pastikan rowsNumber diupdate agar pagination berfungsi
    pagination.value.rowsNumber = contactStore.pagination?.total || contactStore.messages.length
    pagination.value.page = contactStore.pagination?.currentPage || page
    pagination.value.rowsPerPage = contactStore.pagination?.perPage || rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending

    console.log('Messages fetched and pagination updated:', contactStore.messages.length)
  } else {
    pagination.value.rowsNumber = 0
    console.warn('contactStore.messages is not an array after fetch', contactStore.messages)
  }

  if (contactStore.error) {
    $q.notify({
      color: 'negative',
      message:
        'Gagal memuat daftar pesan kontak: ' + (contactStore.error.message || 'Terjadi kesalahan'),
      icon: 'report_problem',
    })
  }
}

const markAsRead = async (id) => {
  $q.loading.show()

  const success = await contactStore.markContactMessageAsRead(id) // action mengembalikan true/false sukses

  $q.loading.hide()

  if (success) {
    // Periksa hasil sukses dari store action
    $q.notify({
      message: 'Pesan berhasil ditandai sudah dibaca',
      color: 'positive',
      icon: 'check_circle',
    })
    // Store action seharusnya sudah mengupdate state lokal atau fetch ulang data
    // Jika store action tidak mengupdate state lokal, panggil fetchMessages() di sini
    // fetchMessages({ pagination: pagination.value, filter: filter.value });
  } else {
    // Notifikasi error ditangani di store action
    // Tampilkan notifikasi error jika store action tidak menanganinya
    // $q.notify({ ... });
  }
}

const confirmDelete = (id) => {
  messageToDeleteId.value = id
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  messageToDeleteId.value = null
}

const deleteMessageConfirmed = async () => {
  const id = messageToDeleteId.value
  showDeleteConfirm.value = false
  messageToDeleteId.value = null

  if (id) {
    $q.loading.show()

    const success = await contactStore.deleteContactMessage(id) // action mengembalikan true/false sukses

    $q.loading.hide()

    if (success) {
      // Periksa hasil sukses dari store action
      $q.notify({
        message: 'Pesan berhasil dihapus',
        color: 'positive',
        icon: 'delete_forever',
      })
      // Store action seharusnya sudah menghapus dari state lokal atau fetch ulang
      // fetchMessages({ pagination: pagination.value, filter: filter.value });
    } else {
      // Notifikasi error ditangani di store action
      // Tampilkan notifikasi error jika store action tidak menanganinya
      // $q.notify({ ... });
    }
  }
}

onMounted(() => {
  console.log('AdminContactMessagesPage mounted. Fetching messages.')
  fetchMessages({
    pagination: pagination.value,
    filter: filter.value,
  })
})

watch(filter, (newFilter) => {
  pagination.value.page = 1
  fetchMessages({ pagination: pagination.value, filter: newFilter })
})
</script>

<style scoped>
.admin-list-card {
  margin: 20px auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.text-wrap {
  white-space: normal !important;
}

.q-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.message-cell {
  /* Atur tinggi maksimum atau overflow jika pesan terlalu panjang */
  max-height: 50px; /* Contoh */
  overflow: hidden;
  text-overflow: ellipsis; /* Tambahkan ... jika terpotong */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Batasi hingga 2 baris */
  -webkit-box-orient: vertical;
}

@media (max-width: 600px) {
  .admin-list-card {
    margin: 10px auto;
    max-width: 98%;
  }
  /* Di layar kecil, mungkin perlu menyembunyikan beberapa kolom di tabel */
}
</style>
