<script setup lang="ts">
interface IProps {
  isSingle?: boolean
  isCloseOutside?: boolean
  duration?: string | number
}

const props = defineProps<IProps>()

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
