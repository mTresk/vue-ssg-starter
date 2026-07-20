<script setup lang="ts">
interface IProps {
  min: string | number
  max: string | number
}

defineProps<IProps>()
</script>

<template>
  <div
    data-range
    class="range"
  >
    <div class="range__fields">
      <label class="range__field">
        <input
          autocomplete="off"
          data-range-min
          type="number"
          name="min"
        >
      </label>
      <label class="range__field">
        <input
          autocomplete="off"
          data-range-max
          type="number"
          name="max"
        >
      </label>
    </div>
    <div
      data-range-slider
      :data-range-slider-min="min"
      :data-range-slider-max="max"
      class="range__slider"
    />
  </div>
</template>

<style lang="scss">
.range {
  display: grid;
  gap: rem(20);

  &__fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: rem(20);
  }

  &__field {
    display: flex;
    gap: rem(10);
    align-items: center;
    justify-content: space-between;
    padding: rem(15) rem(20);
    cursor: text;
    border: rem(1) solid var(--color-gray);
    border-radius: rem(15);

    input {
      width: 100%;
      color: var(--color-main);
      background-color: transparent;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        margin: 0;
        appearance: none;
      }

      &[type='number'] {
        appearance: textfield;
      }
    }
  }
}
</style>
