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
  --transition: max-height 300ms ease-in-out;

  &::details-content {
    max-height: 0;
    overflow: hidden;
    transition: var(--transition);
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
