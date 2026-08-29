<script setup lang="ts">
interface IProps {
  prevClass: string
  nextClass: string
}

defineProps<IProps>()
</script>

<template>
  <div class="slider-buttons">
    <button
      aria-label="Назад"
      type="button"
      class="slider-buttons__button"
      :class="prevClass"
    >
      <BaseIcon
        name="arrow-left"
        size="40"
      />
    </button>
    <button
      aria-label="Вперед"
      type="button"
      class="slider-buttons__button"
      :class="nextClass"
    >
      <BaseIcon
        name="arrow-right"
        size="40"
      />
    </button>
  </div>
</template>

<style lang="scss">
.slider-buttons {
  display: flex;
  gap: rem(10);
  align-items: center;

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease-in-out;

    &.swiper-button-disabled {
      pointer-events: none;
      opacity: 0.2;
    }

    &.swiper-button-lock {
      opacity: 0;
    }
  }
}
</style>
