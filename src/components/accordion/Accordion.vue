<script setup lang="ts">
import { computed, inject } from 'vue'

const injectedDuration = inject<{ value: number }>('accordionDuration', { value: 300 })

const animation = computed(() => {
  const duration = injectedDuration.value || 300

  return `max-height ${duration}ms ease-in-out`
})
</script>

<template>
  <details
    data-accordion
  >
    <summary>
      <slot name="header" />
    </summary>
    <div data-accordion-content>
      <slot name="content" />
    </div>
  </details>
</template>

<style lang="scss">
details {
  --max-height: 0;

  &::details-content {
    max-height: 0;
    overflow: hidden;
    transition: v-bind(animation);
  }

  &[open] {
    &::details-content {
      max-height: var(--max-height);
    }
  }
}

summary {
  display: flex;
  align-items: center;
  cursor: pointer;

  &::-webkit-details-marker,
  &::marker {
    content: none;
  }
}
</style>
