<script setup lang="ts">
interface IProps {
  id: string
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
    data-file
    class="form-field file"
    v-bind="rootAttrs"
  >
    <span class="file__icons">
      <BaseIcon
        name="attachment"
        size="20"
        class="file__icon file__icon--attachment"
      />
      <BaseIcon
        name="check"
        size="20"
        class="file__icon file__icon--check"
      />
    </span>
    <span
      data-file-text
      class="file__text"
    >{{ placeholder }}</span>
    <input
      :id="id"
      type="file"
      data-file-input
      class="form-field__input file__input"
      autocomplete="off"
      :name="name"
      v-bind="dataAttrs"
    >
    <slot />
  </label>
</template>

<style lang="scss">
.file {
  cursor: pointer;

  // .file__text
  &__text {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-gray);
    white-space: nowrap;

    [data-file-attached] & {
      color: var(--color-main);
    }
  }

  // .file__icons
  &__icons {
    position: relative;
    flex-shrink: 0;
    width: rem(20);
    height: rem(20);
  }

  // .file__icon
  &__icon {
    position: absolute;
    inset: 0;
    color: var(--color-main);
    transition: opacity 0.3s ease-in-out;

    &--attachment {
      opacity: 1;

      [data-file-attached] & {
        opacity: 0;
      }
    }

    &--check {
      opacity: 0;

      [data-file-attached] & {
        opacity: 1;
      }
    }
  }

  // .file__input
  &__input {
    position: absolute;
    inset: 0;
    z-index: -1;
    width: 0;
    height: 0;
    opacity: 0;
  }
}
</style>
