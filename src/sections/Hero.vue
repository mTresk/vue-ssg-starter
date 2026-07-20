<script setup lang="ts">
import BaseContainer from '@/components/Base/BaseContainer.vue'
import BaseSection from '@/components/Base/BaseSection.vue'
</script>

<template>
  <BaseSection class="hero">
    <BaseContainer class="hero__container">
      <h1 class="hero__title">
        Hello World!
      </h1>
    </BaseContainer>
  </BaseSection>
</template>

<style lang="scss">
.hero {
  &__title {
    font-size: rem(20);
    font-weight: 500;
  }
}
</style>
