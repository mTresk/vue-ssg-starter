<template>
  <form
    class="form"
  >
    <div class="form__body">
      <div class="form__header">
        <h2 class="form__title">
          <slot name="title" />
        </h2>
        <p class="form__description">
          <slot name="description" />
        </p>
      </div>
      <div class="form__fields">
        <slot name="fields" />
      </div>
    </div>
    <div class="form__footer">
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
