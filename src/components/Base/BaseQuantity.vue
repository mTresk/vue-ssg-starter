<script setup lang="ts">
interface IProps {
  name: string
}

defineProps<IProps>()
</script>

<template>
  <div
    data-quantity
    class="quantity"
  >
    <button
      data-quantity-minus
      type="button"
      class="quantity__button quantity__button--minus"
    />
    <div class="quantity__input">
      <input
        data-quantity-value
        autocomplete="off"
        type="text"
        :name="name"
        value="1"
      >
    </div>
    <button
      data-quantity-plus
      type="button"
      class="quantity__button quantity__button--plus"
    />
  </div>
</template>

<style lang="scss">
.quantity {
  display: flex;
  align-items: center;
  border: rem(1) solid var(--color-main);
  border-radius: rem(4);

  @include adaptive-value('height', 45, 40);
  @include adaptive-value('width', 100, 80);

  &__button {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: rem(30);
    height: rem(30);
    cursor: pointer;

    &::before,
    &::after {
      position: absolute;
      width: rem(10);
      height: rem(1);
      content: '';
      background-color: var(--color-main);
      transition: all 0.3s ease 0s;
    }

    @media (any-hover: hover) {
      &:hover {
        &::before,
        &::after {
          background-color: var(--color-accent);
        }
      }
    }

    &--plus {
      &::before {
        transform: rotate(-90deg);
      }
    }

    &[disabled] {
      pointer-events: none;
      opacity: 0.1;
    }
  }

  &__input {
    flex: 1 1 auto;

    input {
      width: 100%;
      height: 100%;
      line-height: 115%;
      text-align: center;

      @include adaptive-value('font-size', 16, 14);
    }
  }
}
</style>
