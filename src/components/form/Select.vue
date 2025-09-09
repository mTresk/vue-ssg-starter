<script setup lang="ts">
interface IProps {
  name: string
  id: string
  placeholder?: string
  options: {
    value: string | number
    label: string
    selected?: boolean
  }[]
}

defineProps<IProps>()
</script>

<template>
  <select
    :id="id"
    data-select
    :name="name"
    :data-placeholder="placeholder"
    :options="options"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :selected="option.selected"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<style lang="scss">
.nice-select {
  position: relative;
  padding: rem(25);
  font-size: rem(14);
  line-height: 145%;
  white-space: nowrap;
  cursor: pointer;
  background-color: var(--color-gray);
  border-radius: rem(20);

  &::after {
    position: absolute;
    top: 50%;
    right: rem(25);
    width: rem(24);
    height: rem(24);
    pointer-events: none;
    content: '';
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.9995 15.0006L7.75684 10.758L9.17106 9.34375L11.9995 12.1722L14.8279 9.34375L16.2421 10.758L11.9995 15.0006Z' fill='white'/%3E%3C/svg%3E%0A");
    background-size: cover;
    transform: translateY(-50%);
    transition: all 0.3s ease-in-out;
  }

  .nice-select-dropdown {
    position: absolute;
    top: calc(100% + rem(5));
    left: 0;
    z-index: 10;
    width: 100%;
    pointer-events: none;
    background-color: var(--color-gray);
    border-radius: rem(20);
    opacity: 0;
    transform: translateY(rem(-10)) scale(0.99);
    transform-origin: 50% 0;
    transition: all 0.3s ease-in-out;
  }

  .list {
    display: grid;
    gap: rem(14);
    max-height: rem(220);
    padding: rem(28);
    overflow: hidden auto;
  }

  .option {
    font-size: rem(14);
    font-weight: 500;
    line-height: 145%;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover,
    &.focus,
    &.selected.focus {
      color: var(--color-accent);
    }

    &.selected {
      font-weight: bold;
    }
  }

  &.open {
    &::after {
      transform: rotate(-180deg) translateY(50%);
    }

    .nice-select-dropdown {
      pointer-events: auto;
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
}

.hidden-select {
  display: none;
}
</style>
