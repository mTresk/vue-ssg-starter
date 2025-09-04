<script setup lang="ts">
interface IProps {
  items: {
    title: string
    href?: string
  }[]
  isDark?: boolean
}

defineProps<IProps>()
</script>

<template>
  <ul
    class="breadcrumb"
    :class="{ 'breadcrumb--dark': isDark }"
  >
    <li
      v-for="item in items"
      :key="item.title"
    >
      <a
        v-if="item.href"
        :href="item.href"
      >{{ item.title }}</a>
      <span v-else>
        {{ item.title }}
      </span>
    </li>
  </ul>
</template>

<style lang="scss">
.breadcrumb {
  position: relative;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  row-gap: rem(6);
  align-items: center;
  margin-inline: auto;

  @include adaptive-value('padding-top', 40, 30);

  li {
    position: relative;
    line-height: 145%;
    transition: color 0.3s ease-in-out;

    @include adaptive-value('font-size', 16, 12);

    &:not(:last-child) {
      white-space: nowrap;

      @include adaptive-value('margin-right', 82, 42);
    }

    &::after {
      position: absolute;
      top: 50%;
      width: rem(6);
      height: rem(6);
      content: '';
      background-color: var(--color-accent);
      border-radius: 50%;
      transform: translateY(-50%);

      @include adaptive-value('right', -43, -23);
    }

    &:last-child {
      color: rgb(0 0 0 / 42%);
      text-decoration: none;
      pointer-events: none;

      &::after {
        display: none;
      }
    }

    &:hover {
      color: var(--color-accent);
    }
  }
}
</style>
