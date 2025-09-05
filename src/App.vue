<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { initializeApp } from '@/app'
import Footer from '@/components/layout/Footer.vue'
import Header from '@/components/layout/Header.vue'

useHead({
  htmlAttrs: { lang: 'ru' },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0',
    },
  ],
  link: [
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/favicons/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/images/favicons/favicon-96x96.png' },
    { rel: 'icon', type: 'image/x-icon', href: '/images/favicons/favicon.ico' },
    { rel: 'manifest', href: '/images/favicons/site.webmanifest' },
  ],
})

const route = useRoute()

const hasDarkHeader = computed(() => {
  return route.meta.hasDarkHeader ?? false
})

onMounted(() => {
  initializeApp()
})
</script>

<template>
  <div class="wrapper">
    <Header :class="{ 'header--dark': hasDarkHeader }" />
    <main class="main">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
