<template>
  <div class="container">
    <slot />
  </div>
</template>

<style lang="scss">
@use 'sass:math';

.container {
  max-width: rem($containerWidth);
  padding-inline: rem(math.div($containerPadding, 2));
  margin-inline: auto;
}
</style>
