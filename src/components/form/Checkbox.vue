<script setup lang="ts">
interface IProps {
  id: string
  name: string
  value: string
  checked?: boolean
}

defineProps<IProps>()
</script>

<template>
  <label
    class="checkbox"
    :for="id"
  >
    <input
      :id="id"
      class="checkbox__input"
      type="checkbox"
      :value="value"
      :checked="checked"
    >
    <span class="checkbox__text"><slot /></span>
  </label>
</template>

<style lang="scss">
.checkbox {
  display: flex;
  gap: rem(10);
  align-items: center;
  cursor: pointer;

  &:has(input:checked) {
    .checkbox__text {
      color: var(--color-main);
    }
  }

  &__input {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: rem(20);
    height: rem(20);
    appearance: none;
    cursor: pointer;
    content: '';
    border: rem(1) solid var(--color-gray);
    border-radius: rem(4);

    &:checked {
      background-color: var(--color-main);
      border-color: var(--color-main);

      &::before {
        position: absolute;
        width: rem(12);
        height: rem(12);
        content: '';
        background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 6L5.1213 8.1213L9.3635 3.87866' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
        background-size: cover;
      }
    }
  }

  &__text {
    font-size: rem(14);
    font-weight: 500;
    line-height: 145%;
    color: var(--color-gray);

    a,
    button {
      text-decoration: underline;
      text-underline-offset: 10%;
      transition: color 0.3s ease-in-out;

      @media (any-hover: hover) {
        &:hover {
          color: var(--color-accent);
        }
      }
    }
  }
}
</style>
