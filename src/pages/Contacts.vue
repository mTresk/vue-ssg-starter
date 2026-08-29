<script setup lang="ts">
useHead({
  title: 'Контактные данные',
})

const breadcrumbItems = [{ title: 'Главная', href: '/' }, { title: 'Контактные данные' }]
</script>

<template>
  <BaseSection class="contacts">
    <BaseContainer class="contacts__container">
      <Breadcrumbs :items="breadcrumbItems" />
    </BaseContainer>
  </BaseSection>
</template>
