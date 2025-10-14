<script setup lang="ts">
interface IProps {
  coordinates: string
}

defineProps<IProps>()

const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY
</script>

<template>
  <div
    class="map"
    :data-map="coordinates"
    :data-map-key="apiKey"
  />
</template>

<style lang="scss">
.map {
  height: rem(600);

  &__marker {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
    transform: translate(-50%, -100%);

    svg {
      width: rem(40);
      height: rem(40);
    }
  }
}
</style>
