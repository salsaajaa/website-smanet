<template>
  <div class="header-section-quasar">
    <div class="container row items-center justify-center">
      <img src="../assets/logoosman7.png" alt="LOGO SMAN 7 PINRANG" class="logo q-mr-md" />
      <div class="header-title">SMA Negeri <span class="highlight">7 Pinrang</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderSection',
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.header-section-quasar {
  background-color: #004b87;
  color: white;
  padding: 20px 0;
  width: 100%;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  height: 100px;
  object-fit: contain;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  display: flex;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
}

.header-title .highlight {
  color: #ffd700;
  font-weight: 700;
  margin-left: 0.2em;
}

@media (max-width: 768px) {
  .header-section-quasar {
    padding: 10px 0;
  }
  .header-title {
    font-size: 1.3rem;
    text-align: center;
    line-height: 1.3;
    margin-top: 8px;
  }
  .logo {
    height: 45px;
    margin-right: 0;
  }
  .container.row.items-center.justify-center {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
  }
  .container.row.items-center.justify-center .logo {
    margin-right: 0;
    margin-bottom: 0;
  }
  .header-title .highlight {
    margin-left: 0.1em;
  }
}
</style>
