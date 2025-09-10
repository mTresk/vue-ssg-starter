<script setup lang="ts">
import { computed } from 'vue'
import { resolveSourcePath } from '@/utils/base/helpers'

interface IProps {
  src: string
  alt?: string
  width: number | string
  height: number | string
  loading?: 'lazy' | 'eager'
  quality?: number | string
  formats?: string[]
  class?: string
}

const props = withDefaults(defineProps<IProps>(), {
  alt: '',
  loading: 'lazy',
  quality: 90,
  formats: () => ['webp'],
})

const optimizationAttrs = computed(() => {
  const attrs: Record<string, string> = {}

  attrs['data-optimize-width'] = String(props.width)
  attrs['data-optimize-quality'] = String(props.quality)
  attrs['data-optimize-formats'] = props.formats.join(',')

  return attrs
})
</script>

<template>
  <picture v-bind="optimizationAttrs">
    <img
      :src="resolveSourcePath(src)"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :class="props.class"
    >
  </picture>
</template>
