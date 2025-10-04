<template>
  <form
    class="form"
  >
    <div class="form__body">
      <div
        v-if="$slots.title || $slots.description"
        class="form__header"
      >
        <h2
          v-if="$slots.title"
          class="form__title"
        >
          <slot name="title" />
        </h2>
        <p
          v-if="$slots.description"
          class="form__description"
        >
          <slot name="description" />
        </p>
      </div>
      <div
        v-if="$slots.fields"
        class="form__fields"
      >
        <slot name="fields" />
      </div>
    </div>
    <div
      v-if="$slots.footer"
      class="form__footer"
    >
      <slot name="footer" />
    </div>
  </form>
</template>

<style lang="scss">
.form {
  display: grid;
  gap: rem(20);

  &__body {
    display: grid;
    gap: rem(20);
  }

  &__header {
    display: grid;
    gap: rem(20);
  }

  &__fields {
    display: grid;
    gap: rem(10);
  }

  &__footer {
    display: grid;
    gap: rem(10);
  }
}
</style>
