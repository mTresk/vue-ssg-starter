<script setup lang="ts">
interface IProps {
  name: string
  value: string
  checked?: boolean
}

defineProps<IProps>()
</script>

<template>
  <label
    class="option"
  >
    <input
      class="option__input"
      :value="value"
      :name="name"
      :checked="checked"
      type="radio"
    >
    <span class="option__text"><slot /></span>
  </label>
</template>

<style lang="scss">
.option {
  display: flex;
  gap: rem(10);
  align-items: center;
  cursor: pointer;

  &:has(input:checked) {
    .options__text {
      color: var(--color-main);
    }
  }

  &__input {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(20);
    height: rem(20);
    appearance: none;
    cursor: pointer;
    content: '';
    border: rem(1) solid var(--color-gray);
    border-radius: 50%;

    &:checked {
      border-color: var(--color-main);

      &::before {
        position: absolute;
        width: rem(12);
        height: rem(12);
        content: '';
        background-color: var(--color-main);
        border-radius: 50%;
      }
    }
  }

  &__text {
    font-size: rem(14);
    font-weight: 500;
    line-height: 145%;
    color: var(--color-gray);
  }
}
</style>
