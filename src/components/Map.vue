<script setup lang="ts">
interface IProps {
  coordinates: string
}

defineProps<IProps>()
</script>

<template>
  <div
    class="map"
    :data-map="coordinates"
  />
</template>

<style lang="scss">
.icon-marker {
  color: var(--color-accent);
  transform: translate(-50%, -100%);
}
</style>
