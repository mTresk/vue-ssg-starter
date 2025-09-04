<script setup lang="ts">
interface IProps {
  href?: string
}

defineProps<IProps>()
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="button"
    :href="href"
  >
    <slot />
  </component>
</template>

<style lang="scss">
.button {
  display: flex;
  gap: rem(10);
  align-items: center;
  padding: rem(10) rem(20);
  background-color: var(--color-accent);
  border-radius: rem(10);
}
</style>
