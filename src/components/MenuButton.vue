<template>
  <button
    data-menu-button
    aria-label="Меню"
    type="button"
    class="menu-button"
  >
    <span class="menu-button__icon"><span /></span>
  </button>
</template>

<style lang="scss">
.menu-button {
  display: none;

  @media (max-width: em(1023)) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(50);
    height: rem(50);
    background-color: var(--color-white);
    border: rem(1) solid var(--color-accent);
    border-radius: rem(4);
  }

  &__icon {
    position: relative;
    z-index: 5;
    display: block;

    @include adaptive-value('width', 20, 14);
    @include adaptive-value('height', 18, 12);

    @media (any-hover: none) {
      cursor: default;
    }

    span,
    &::before,
    &::after {
      position: absolute;
      right: 0;
      width: 100%;
      height: rem(2);
      content: '';
      background-color: var(--color-accent);
      border-radius: rem(4);
      transition: all 0.3s ease 0s;
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }

    span {
      top: calc(50% - rem(1));
      width: 70%;
    }

    .menu-open & {
      span {
        width: 0;
      }

      &::before {
        top: calc(50% - rem(1));
        transform: rotate(-45deg);
      }

      &::after {
        bottom: calc(50% - rem(1));
        transform: rotate(45deg);
      }
    }
  }
}
</style>
