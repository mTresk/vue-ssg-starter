<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  name: string
  width?: string | number
  height?: string | number
  size?: string | number
}

const props = withDefaults(defineProps<IProps>(), {
  width: '24',
  height: '24',
  size: undefined,
})

const iconWidth = computed(() => props.size || props.width)
const iconHeight = computed(() => props.size || props.height)
</script>

<template>
  <svg
    :width="iconWidth"
    :height="iconHeight"
  >
    <use :href="`/images/icons.svg#${name}`" />
  </svg>
</template>
