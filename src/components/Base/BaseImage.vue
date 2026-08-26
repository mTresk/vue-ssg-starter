<script setup lang="ts">
interface IProps {
  src: string
  alt?: string
  width: number | string
  height: number | string
  loading?: 'lazy' | 'eager'
}

withDefaults(defineProps<IProps>(), {
  alt: '',
  loading: 'lazy',
})
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
  >
</template>
