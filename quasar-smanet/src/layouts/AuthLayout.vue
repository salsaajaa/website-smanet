<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="auth-container">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-layout {
  background-image: url('../assets/background-admin.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
}

.auth-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4); /* Overlay semi-transparent */
  z-index: -1;
}
</style>
