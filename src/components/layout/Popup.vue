<script setup lang="ts">
import Icon from '@/components/Icon.vue'

interface IProps {
  id: string
  isVideo?: boolean
}

defineProps<IProps>()
</script>

<template>
  <dialog
    :id="id"
    class="popup"
    :class="{ 'popup--video': isVideo }"
    aria-dialog="true"
    role="dialog"
  >
    <div
      class="popup__wrapper"
    >
      <div
        data-popup-content
        class="popup__content"
      >
        <button
          data-popup-close
          class="popup__close"
        >
          <Icon
            size="32"
            name="close"
          />
        </button>
        <div
          v-if="isVideo"
          data-popup-vk-place
          class="popup__video"
        />

        <slot />
      </div>
    </div>
  </dialog>
</template>

<style lang="scss">
body {
  &:has(dialog[open]) {
    overflow: hidden;
  }
}

.popup {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  opacity: 0;
  animation: popup-show 0.5s ease forwards;

  &[closing] {
    animation: popup-hide 0.5s ease forwards;
  }

  &::backdrop {
    background-color: rgb(0 0 0 / 80%);
    opacity: 0;
    animation: backdrop-show 0.5s ease forwards;
  }

  &[closing]::backdrop {
    animation: backdrop-hide 0.5s ease forwards;
  }

  &__wrapper {
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-block: rem(30);
    overflow-y: auto;

    @include adaptive-value('padding-inline', 20, 10);

    .popup--video & {
      padding-block: rem(40);
    }
  }

  &__content {
    position: relative;
    width: 100%;
    max-width: rem(600);
    padding: rem(40);
    margin: auto;
    background-color: var(--color-white);
    border-radius: rem(8);
    transform: scale(0.5);
    animation: content-show 0.3s ease forwards;

    .popup--video & {
      max-width: rem(1280);
      padding: 0;
      background-color: var(--color-main);
      border-radius: 0;
    }
  }

  &[closing] .popup__content {
    animation: content-hide 0.5s ease forwards;
  }

  &__close {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease-in-out;

    @include adaptive-value('top', 20, 10);
    @include adaptive-value('right', 20, 10);

    .popup--video & {
      top: rem(-35);
      right: 0;
      color: var(--color-white);
    }

    svg {
      height: auto;

      @include adaptive-value('max-width', 32, 24);
    }

    @media (any-hover: hover) {
      &:hover {
        color: var(--color-accent);
      }
    }
  }

  &__video {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;

    video,
    iframe,
    object,
    embed {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes popup-show {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes popup-hide {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes backdrop-show {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes backdrop-hide {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes content-show {
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes content-hide {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0);
  }
}
</style>
