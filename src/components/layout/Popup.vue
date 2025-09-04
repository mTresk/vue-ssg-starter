<script setup lang="ts">
import Icon from '@/components/Icon.vue'
</script>

<template>
  <div
    id="popup"
    aria-hidden="true"
    class="popup"
  >
    <div class="popup__wrapper">
      <div class="popup__content">
        <button
          data-close
          type="button"
          class="popup__close"
        >
          <Icon
            name="close"
            size="20"
          />
        </button>
        <div class="popup__text">
          Text
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
body::after {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 149;
  width: 100%;
  height: 100%;
  pointer-events: none;
  content: '';
  background-color: rgb(0 0 0 / 80%);
  opacity: 0;
  transition: opacity 0.8s ease 0s;
}

.popup-show {
  & body::after {
    opacity: 1;
  }
}

.popup {
  position: fixed;
  inset: 0;
  visibility: hidden;
  padding: rem(40) rem(10);
  pointer-events: none;
  transition: visibility 0.8s ease 0s;

  &__wrapper {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
  }

  &__content {
    position: relative;
    visibility: hidden;
    width: 100%;
    max-width: rem(900);
    padding: rem(20);
    background-color: #eee;
    border-radius: rem(20);
    transform: scale(0);
    transition: transform 0.3s ease 0s;

    .lock & {
      visibility: visible;
    }
  }

  &__close {
    position: absolute;
    right: 0;
    color: var(--color-white);
    transition: color 0.3s ease-in-out;

    @include adaptive-value('top', -40, -30);

    svg {
      height: auto;

      @include adaptive-value('max-width', 32, 26);
    }

    @media (any-hover: hover) {
      &:hover {
        color: var(--color-accent);
      }
    }
  }
}

.popup_show {
  z-index: 150;
  visibility: visible;
  overflow: auto;
  pointer-events: auto;

  .popup__content {
    visibility: visible;
    transform: scale(1);
  }
}
</style>
