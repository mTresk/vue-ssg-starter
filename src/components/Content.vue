<template>
  <div class="content">
    <slot />
  </div>
</template>

<style lang="scss">
.content {
  h2 {
    font-weight: 500;
    line-height: 140%;

    @include adaptive-value('font-size', 30, 22);
    @include adaptive-value('margin-bottom', 40, 32);

    &:not(:first-child) {
      @include adaptive-value('margin-top', 100, 80);
    }

    @media (max-width: $tablet) {
      line-height: 135%;
    }
  }

  h3 {
    margin-bottom: rem(22);
    font-weight: 500;
    line-height: 145%;

    @include adaptive-value('font-size', 22, 18);

    &:not(:first-child) {
      @include adaptive-value('margin-top', 40, 32);
    }

    @media (max-width: $tablet) {
      line-height: 135%;
    }
  }

  p {
    line-height: 163%;

    @include adaptive-value('font-size', 16, 12);
    @include adaptive-value('margin-bottom', 20, 18);
  }

  i {
    font-weight: 600;
  }

  a {
    font-weight: 500;
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-skip-ink: none;
    transition: color 0.3s ease-in-out;

    @media (any-hover: hover) {
      &:hover {
        color: var(--color-hover);
      }
    }
  }

  ul {
    display: grid;

    @include adaptive-value('margin-bottom', 28, 16);
    @include adaptive-value('gap', 20, 16);

    > li {
      position: relative;
      line-height: 163%;

      @include adaptive-value('font-size', 16, 12);
      @include adaptive-value('padding-left', 30, 16);

      &::before {
        position: absolute;
        left: 0;
        content: '';
        background-color: var(--color-accent);
        border-radius: 50%;

        @include adaptive-value('width', 6, 4);
        @include adaptive-value('height', 6, 4);
        @include adaptive-value('top', 10, 7);
        @include adaptive-value('left', 10, 0);
      }

      ul {
        margin-top: rem(14);

        li {
          @include adaptive-value('padding-left', 30, 16);

          &::before {
            left: 0;
          }
        }
      }
    }
  }

  ol {
    display: grid;
    list-style: none;
    counter-reset: liCounter;

    @include adaptive-value('margin-bottom', 28, 16);
    @include adaptive-value('gap', 22, 14);

    > li {
      position: relative;
      line-height: 163%;

      @include adaptive-value('font-size', 16, 12);
      @include adaptive-value('padding-left', 30, 16);

      &::before {
        position: absolute;
        top: rem(1);
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        line-height: 150%;
        color: var(--color-accent);
        content: counter(liCounter);
        counter-increment: liCounter;

        @include adaptive-value('font-size', 16, 12);
      }

      @media (max-width: $tablet) {
        line-height: 150%;
      }
    }

    ol {
      margin-top: rem(14);

      li {
        @include adaptive-value('padding-left', 30, 16);

        &::before {
          left: 0;
        }
      }
    }

    &:has(h3, h2) {
      > li {
        padding-left: rem(32);

        &::before {
          position: absolute;
          top: rem(1);
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: rem(22);
          height: rem(22);
          font-weight: 700;
          line-height: 150%;
          color: var(--color-white);
          content: counter(liCounter);
          counter-increment: liCounter;
          background-color: var(--color-accent);
          border-radius: 50%;

          @include adaptive-value('font-size', 16, 14);
          @include adaptive-value('top', 5, 1);
        }
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      display: grid;

      tr {
        display: flex;
        align-items: center;
        justify-content: space-between;

        @include adaptive-value('gap', 20, 14);
        @include adaptive-value('padding-block', 16, 18);
        @include adaptive-value('padding-inline', 20, 12);

        th {
          font-weight: 400;
          line-height: 135%;
          color: rgb(4 9 14 / 50%);

          @include adaptive-value('font-size', 14, 12);
        }
      }
    }

    tbody {
      display: grid;

      @include adaptive-value('gap', 4, 2);

      tr {
        display: grid;
        grid-template-columns: 58% 38%;
        align-items: center;
        justify-content: space-between;
        background-color: var(--color-white);
        border: rem(1) solid var(--color-gray-8);
        border-radius: rem(4);

        @include adaptive-value('gap', 20, 14);
        @include adaptive-value('padding-block', 16, 18);
        @include adaptive-value('padding-inline', 20, 12);

        td {
          line-height: 135%;
          color: rgb(4 9 14 / 50%);

          @include adaptive-value('font-size', 14, 12);

          &:last-child {
            font-weight: 500;
            color: var(--color-main);
            text-align: right;
          }
        }

        @media (any-hover: hover) {
          &:hover {
            background-color: var(--color-gray-6);
          }
        }
      }
    }
  }

  blockquote {
    position: relative;
    font-weight: 500;
    line-height: 131%;
    border-top: rem(1) solid rgb(205 208 221 / 70%);
    border-bottom: rem(1) solid rgb(205 208 221 / 70%);

    @include adaptive-value('font-size', 36, 22);
    @include adaptive-value('padding-block', 50, 32);
    @include adaptive-value('padding-left', 109, 34);
    @include adaptive-value('margin-bottom', 100, 80);

    @media (max-width: $tablet) {
      line-height: 145%;
    }

    &::before {
      position: absolute;
      left: 0;
      content: '';
      background-image: url("data:image/svg+xml,%3Csvg width='40' height='33' viewBox='0 0 40 33' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.2995 16.2871C13.8681 16.9258 15.0802 17.9548 15.9358 19.3742C16.8627 20.7226 17.3262 22.3548 17.3262 24.271C17.3262 26.8258 16.5062 28.9194 14.8663 30.5516C13.2264 32.1839 11.1943 33 8.77005 33C6.20321 33 4.09982 32.1839 2.45989 30.5516C0.819964 28.9194 0 26.8258 0 24.271C0 22.9936 0.142602 21.7516 0.427807 20.5452C0.784314 19.3387 1.42603 17.529 2.35294 15.1161L8.02139 0H16.5775L12.2995 16.2871ZM34.9733 16.2871C36.5419 16.9258 37.754 17.9548 38.6096 19.3742C39.5365 20.7226 40 22.3548 40 24.271C40 26.8258 39.18 28.9194 37.5401 30.5516C35.9002 32.1839 33.8681 33 31.4438 33C28.877 33 26.7736 32.1839 25.1337 30.5516C23.4938 28.9194 22.6738 26.8258 22.6738 24.271C22.6738 22.9936 22.8164 21.7516 23.1016 20.5452C23.4581 19.3387 24.0998 17.529 25.0267 15.1161L30.6952 0H39.2513L34.9733 16.2871Z' fill='%2318A1DA'/%3E%3C/svg%3E%0A");
      background-size: cover;

      @include adaptive-value('width', 40, 16);
      @include adaptive-value('height', 33, 13);
      @include adaptive-value('top', 50, 32);
    }
  }
}
</style>
