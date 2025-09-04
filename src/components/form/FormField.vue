<script setup lang="ts">
interface IProps {
  id: string
  type?: 'input' | 'textarea'
  name: string
  placeholder: string
}

defineProps<IProps>()
</script>

<template>
  <label
    :for="id"
    class="form-field"
  >
    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      :id="id"
      class="form-field__input"
      :class="type === 'textarea' ? 'form-field__input--textarea' : ''"
      autocomplete="off"
      :name="name"
      :placeholder="placeholder"
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
