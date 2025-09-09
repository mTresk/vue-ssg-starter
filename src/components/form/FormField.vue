<script setup lang="ts">
import { computed, useAttrs } from 'vue'

interface IProps {
  id: string
  type: string
  name: string
  placeholder: string
}

defineOptions({ inheritAttrs: false })

defineProps<IProps>()

const attrs = useAttrs()

const dataAttrs = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key.startsWith('data-')),
  )
})

const rootAttrs = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !key.startsWith('data-')),
  )
})
</script>

<template>
  <label
    :for="id"
    class="form-field"
    v-bind="rootAttrs"
  >
    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      :id="id"
      :type="type"
      class="form-field__input"
      :class="type === 'textarea' ? 'form-field__input--textarea' : ''"
      autocomplete="off"
      :name="name"
      :placeholder="placeholder"
      v-bind="dataAttrs"
    />
    <slot />
  </label>
</template>

<style lang="scss">
.form-field {
  display: flex;
  gap: rem(20);
  align-items: center;
  justify-content: space-between;
  padding: rem(15) rem(20);
  cursor: text;
  border: rem(1) solid var(--color-gray);
  border-radius: rem(15);

  &--select {
    padding: 0;
  }

  &__input {
    width: 100%;
    color: var(--color-main);
    background-color: transparent;

    &::placeholder {
      color: var(--color-gray);
    }

    &:focus {
      &::placeholder {
        opacity: 0;
      }
    }

    &--textarea {
      resize: none;
    }
  }
}
</style>
