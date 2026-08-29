<script setup lang="ts">
import { initializeApp } from '@/app'

useHead({
  htmlAttrs: { lang: 'ru' },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0',
    },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
    <TheHeader :class="{ 'header--dark': hasDarkHeader }" />
    <main class="main">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>
