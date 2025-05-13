<template>
  <q-layout view="lHh Lpr lFf">
    <div ref="headerElementsRef">
      <TopBar />
      <HeaderSection />
    </div>

    <div ref="navbarRef" :class="{ 'navbar-sticky-js': isNavbarSticky }">
      <Navbar />
    </div>

    <q-page-container :style="pageContainerPaddingStyle">
      <router-view />
    </q-page-container>

    <FooterSection />
  </q-layout>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import TopBar from '../components/TopBar.vue'
import HeaderSection from '../components/HeaderSection.vue'
import Navbar from '../components/Navbar.vue'
import FooterSection from '../components/FooterSection.vue'

export default {
  name: 'MainLayout',
  components: {
    TopBar,
    HeaderSection,
    Navbar,
    FooterSection,
  },
  setup() {
    const isNavbarSticky = ref(false)
    const headerElementsRef = ref(null)
    const navbarRef = ref(null)
    let scrollThreshold = 0
    const navbarHeight = ref(0)

    const pageContainerPaddingStyle = computed(() => ({
      paddingTop: isNavbarSticky.value ? `${navbarHeight.value}px` : '0',
    }))

    const calculateHeights = () => {
      nextTick(() => {
        if (headerElementsRef.value) {
          scrollThreshold = headerElementsRef.value.offsetHeight
        }
        if (navbarRef.value) {
          navbarHeight.value = navbarRef.value.offsetHeight
        }
      })
    }

    const handleScroll = () => {
      isNavbarSticky.value = window.scrollY > scrollThreshold
    }

    onMounted(() => {
      console.log('MainLayout mounted. Adding scroll and resize listeners.')
      calculateHeights()
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', calculateHeights)
    })

    onUnmounted(() => {
      console.log('MainLayout unmounted. Removing scroll and resize listeners.')
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateHeights)
    })

    return {
      isNavbarSticky,
      headerElementsRef,
      navbarRef,
      pageContainerPaddingStyle,
    }
  },
}
</script>
