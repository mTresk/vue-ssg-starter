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
