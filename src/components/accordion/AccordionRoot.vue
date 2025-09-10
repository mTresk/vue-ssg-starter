<script setup lang="ts">
import { computed, provide } from 'vue'

interface IProps {
  isSingle?: boolean
  isCloseOutside?: boolean
  duration?: string | number
}

const props = defineProps<IProps>()

provide('accordionDuration', computed(() => props.duration || 300))

const attributes = computed(() => {
  const attrs: Record<string, string | number | boolean> = {}

  if (props.isSingle) {
    attrs['data-accordion-single'] = true
  }

  if (props.isCloseOutside) {
    attrs['data-accordion-close'] = true
  }

  if (props.duration !== undefined) {
    attrs['data-accordion-duration'] = props.duration
  }

  return attrs
})
</script>

<template>
  <div
    data-accordion-root
    v-bind="attributes"
  >
    <slot />
  </div>
</template>
