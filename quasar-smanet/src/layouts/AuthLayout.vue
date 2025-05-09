<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { QLayout, QPageContainer } from 'quasar'

export default defineComponent({
  name: 'AuthLayout',
  components: {
    QLayout,
    QPageContainer,
  },
})
</script>

<style scoped>
.q-layout {
  background-image: url('../assets/background-admin.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
}
</style>
