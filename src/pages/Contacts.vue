<script setup lang="ts">
import { useHead } from '@unhead/vue'
import BaseContainer from '@/components/Base/BaseContainer.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

useHead({
  title: 'Контактные данные',
})

const breadcrumbItems = [{ title: 'Главная', href: '/' }, { title: 'Контактные данные' }]
</script>

<template>
  <section class="contacts">
    <BaseContainer class="contacts__container">
      <Breadcrumb :items="breadcrumbItems" />
    </BaseContainer>
  </section>
</template>
