<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

useHead({
  title: 'Контактные данные',
})

const breadcrumbItems = [{ title: 'Главная', href: '/' }, { title: 'Контактные данные' }]
</script>

<template>
  <section class="contacts">
    <div class="contacts__container">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
  </section>
</template>
