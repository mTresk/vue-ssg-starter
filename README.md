# Vue SSG Starter

Современный шаблон для создания статических сайтов на Vue 3 с использованием Vite SSG.
Включает в себя все необходимые инструменты для разработки и сборки.

## Особенности

- **Vue 3** используется как шаблонизатор
- **Vite SSG** для статической генерации
- **TypeScript** для типобезопасности
- **Автоимпорт** API (`unplugin-auto-import`) и компонентов (`unplugin-vue-components`)
- **ESLint** и **Stylelint** для качества кода
- **Готовые компоненты** и утилиты
- **Статический вывод** — Vue-код не попадает в итоговую сборку

## Требования

- Node.js: `>=24`
- npm

## Установка

1. Создайте новый проект:
```bash
npx create-vue-ssg-starter
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите проект в режиме разработки:
```bash
npm run dev
```

Проект будет доступен по адресу `http://localhost:3000`

## Доступные команды

### Разработка
- `npm run dev` — запуск сервера разработки

### Сборка
- `npm run build` — полная сборка проекта (включает оптимизацию и линтинг)
- `npm run preview` — предварительный просмотр собранного проекта

### Линтинг и форматирование
- `npm run lint` — проверка кода линтерами
- `npm run lint:fix` — проверка с автоисправлением
- `npm run fix-all` — полная оптимизация (px-to-rem + линтинг)

### Утилиты
- `npm run fonts` — генерация woff2 шрифтов из исходников
- `npm run px-to-rem` — конвертация px в rem
- `npm run generate-styles-entry` — генерация списка используемых Vue-файлов для стилей

## Структура проекта

```
├── public/             # Статические файлы (копируются как есть)
│   ├── images/         # Изображения для продакшена
│   │   └── favicons/   # Иконки сайта
│   ├── robots.txt      # Файл для поисковых роботов
│   └── icons.svg       # SVG спрайт (генерируется из assets/icons/)
├── snippets.json       # Конфигурация сниппетов для VS Code
├── src/
│   ├── app.ts          # Инициализация приложения
│   ├── App.vue         # Корневой компонент
│   ├── main.ts         # Точка входа
│   ├── assets/         # Ресурсы для обработки
│   │   ├── fonts/      # Оптимизированные шрифты (woff2)
│   │   ├── fonts-raw/  # Исходные шрифты (ttf/otf)
│   │   ├── icons/      # SVG иконки
│   │   └── images/     # Изображения для разработки
│   ├── components/     # Vue-компоненты (автоимпорт)
│   │   ├── Base/       # Базовые UI-компоненты
│   │   └── ...         # Остальные компоненты
│   ├── pages/          # Страницы приложения
│   ├── routes/         # Конфигурация роутинга
│   ├── sections/       # Секции страниц (автоимпорт)
│   ├── styles/         # SCSS стили
│   │   ├── helpers/    # Переменные, миксины
│   │   ├── libs/       # Стили библиотек
│   │   └── index.ts    # Точка входа стилей
│   ├── types/          # TypeScript типы
│   └── utils/          # Утилиты и библиотеки
│       ├── base/       # Различные скрипты
│       ├── forms/      # Работа с формами
│       ├── libs/       # JavaScript библиотеки
│       ├── tasks/      # Задачи сборки
│       └── script.ts   # Любая дополнительная логика
```

### Разница между папками
- **`public/`** — статические файлы, которые копируются в корень сайта без обработки
- **`src/assets/`** — ресурсы, которые обрабатываются сборщиком (оптимизация, хеширование)

## Автоимпорт

В проекте настроены два плагина:

| Плагин | Что импортирует | Папки / пресеты |
| --- | --- | --- |
| `unplugin-auto-import` | API (`ref`, `computed`, `useRoute`, `useHead` и т.д.) | `vue`, `vue-router`, `@unhead/vue` |
| `unplugin-vue-components` | Vue-компоненты | `src/components`, `src/sections` |

Явные импорты Vue API и компонентов из этих папок обычно не нужны:

```vue
<script setup lang="ts">
useHead({
  title: 'Главная',
})

const count = ref(0)
</script>

<template>
  <Hero />
  <BaseContainer>
    <BaseButton />
  </BaseContainer>
</template>
```

### Типы

- `auto-imports.d.ts` и `components.d.ts` генерируются Vite при `npm run dev` / `npm run build` и находятся в `.gitignore`
- после переименования или удаления компонента дождитесь обновления от Vite или перезапустите `dev`

### Новый компонент

1. Создайте файл в `src/components/` или `src/sections/` (например `src/components/Base/BaseCard.vue`)
2. Используйте в шаблоне как `<BaseCard />` — импорт не нужен
3. Типы в `components.d.ts` появятся после следующего прохода Vite

## Стилизация

Проект использует SCSS с BEM методологией. Все стили организованы в модульной структуре:

### Основные файлы стилей:
- `styles/helpers/variables.scss` — переменные
- `styles/helpers/mixins.scss` — миксины
- `styles/colors.scss` — цветовая палитра
- `styles/fonts.scss` — стили шрифтов (генерируются через `npm run fonts`)

### Использование:
```scss
// В компонентах доступны все переменные и миксины
.my-component {
  @include adaptive-value('padding', 20, 10);
  color: $primaryColor;
}
```

## Компоненты

### Готовые компоненты:
- **BaseIcon** — SVG иконки из папки `assets/icons`
- **BasePicture** — оптимизированные изображения с поддержкой современных форматов
- **BaseFormField** — поля форм
- **BaseCheckbox / BaseRadio** — чекбоксы и радиокнопки
- **BaseSelect** — селекты
- **BasePopup / BasePopupRoot** — модальные окна
- **Breadcrumbs** — хлебные крошки
- **BaseAccordion / BaseAccordionRoot** — аккордеоны с анимацией
- **BaseSection / BaseContainer** — секция и контейнер макета

### Использование:

#### BaseIcon
Для использования иконок:
1. Поместите SVG файл в папку `src/assets/icons/`
2. Используйте компонент `BaseIcon` с именем файла:

```html
<template>
  <BaseIcon
    name="close"
    size="24"
  />
  <BaseIcon
    name="menu"
    width="32"
    height="32"
  />
</template>
```

**Props:**
- `name` — название иконки (имя файла без `.svg`)
- `size` — размер иконки в пикселях
- либо отдельно `width` и `height`

#### BasePicture
Компонент для автоматической оптимизации изображений с поддержкой современных форматов (AVIF, WebP) и адаптивных размеров.

```html
<template>
  <BasePicture
    src="@/assets/images/cats/photo.jpg"
    alt="Описание изображения"
    width="800"
    height="600"
    loading="lazy"
    :quality="85"
    :formats="['avif', 'webp']"
  />
</template>
```

**Props:**
- `src` (string, обязательно) — путь к изображению
  - Поддерживает алиас: `@/assets/images/photo.jpg`
  - Поддерживает абсолютный путь: `/src/assets/images/photo.jpg`
- `alt` (string) — альтернативный текст
- `width` (number/string, обязательно) — ширина изображения
- `height` (number/string, обязательно) — высота изображения
- `loading` ('lazy' | 'eager') — тип загрузки (по умолчанию `'lazy'`)
- `quality` (number) — качество оптимизации 0–100 (по умолчанию `90`)
- `formats` (string[]) — форматы для генерации (по умолчанию `['webp']`)

**Возможные форматы:**
- `'webp'` — WebP формат (хорошая поддержка браузерами)
- `'avif'` — AVIF формат (лучшее сжатие, современные браузеры)

**Автоматические возможности:**
- Генерация 1x и 2x версий (для retina экранов)
- Создание современных форматов (AVIF, WebP) с fallback на JPG/PNG
- Автоматическая генерация `<picture>` тегов с `<source>`

**Результат в HTML:**
```html
<picture>
  <source srcset="/assets/images/cats/photo-AbC123dE.avif 1x, /assets/images/cats/photo-AbC123dE@2x.avif 2x" type="image/avif">
  <source srcset="/assets/images/cats/photo-AbC123dE.webp 1x, /assets/images/cats/photo-AbC123dE@2x.webp 2x" type="image/webp">
  <img src="/assets/images/cats/photo-AbC123dE.jpg" alt="Описание изображения" width="800" height="600" loading="lazy">
</picture>
```

#### BaseAccordion
Компонент аккордеона с плавной анимацией открытия/закрытия. Поддерживает различные режимы работы и настройки анимации.

**Структура компонентов:**
- `BaseAccordionRoot` — корневой контейнер для группы аккордеонов
- `BaseAccordion` — отдельный элемент аккордеона

**Базовое использование:**
```html
<template>
  <BaseAccordionRoot>
    <BaseAccordion>
      <template #header>
        <h3>Заголовок 1</h3>
      </template>
      <template #content>
        <p>Содержимое первого аккордеона</p>
      </template>
    </BaseAccordion>

    <BaseAccordion>
      <template #header>
        <h3>Заголовок 2</h3>
      </template>
      <template #content>
        <p>Содержимое второго аккордеона</p>
      </template>
    </BaseAccordion>
  </BaseAccordionRoot>
</template>
```

**BaseAccordionRoot Props:**
- `isSingle` — режим «только один открытый» — при открытии нового аккордеона все остальные закрываются
- `isCloseOutside` — закрытие по клику вне области аккордеона
- `duration` — длительность анимации в миллисекундах (по умолчанию `300`)

**Особенности:**
- Плавная анимация с использованием `max-height`
- Поддержка множественных аккордеонов на странице
- Автоматическая инициализация через JavaScript класс
- Синхронизация CSS и JavaScript анимации
- Доступность (semantic HTML с `<details>` и `<summary>`)

## Работа со шрифтами

### Подготовка шрифтов
1. Поместите исходные шрифты в папку `src/assets/fonts-raw/` в формате TTF или OTF
2. Запустите генерацию оптимизированных шрифтов:
   ```bash
   npm run fonts
   ```
3. Оптимизированные шрифты (WOFF2) будут созданы в папке `src/assets/fonts/`

### Использование шрифтов
После генерации шрифты автоматически подключаются в проекте. Используйте их в CSS:

```scss
// В styles/fonts.scss
@font-face {
  font-family: 'Inter';
  src: url('@/assets/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('@/assets/fonts/Inter-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

## Утилиты

### JavaScript библиотеки:
- **Gallery** — lightbox галерея изображений
- **Map** — инициализация Yandex Карт
- **Menu** — логика бургер-меню
- **Parallax** — параллакс эффекты
- **Popup** — управление модальными окнами
- **Quantity** — количество
- **ResponsiveAdapter** — изменения порядка элементов на определенной ширине
- **Scroll** — навигация и направление скрола
- **ScrollWatcher** — отслеживание скрола
- **ShowMore** — показать еще
- **Spoilers** — аккордеоны
- **Tabs** — табы

📖 **Документация по использованию:** [snippets.maximtresk.ru](https://snippets.maximtresk.ru/)

### Формы:
- **DatePicker** — выбор даты
- **InputMask** — маски ввода
- **Range** — диапазоны
- **Select** — JavaScript селект

## Конфигурация

### Vite (`vite.config.ts`)
- Настроен для SSG
- Автоимпорт API и компонентов
- Автоматическая оптимизация ресурсов
- Алиасы путей
- SCSS препроцессор

### TypeScript
- Строгая типизация
- Современные настройки
- Поддержка Vue 3
- Типы автоимпорта генерируются Vite (`auto-imports.d.ts`, `components.d.ts`)

### ESLint
- Конфигурация `@antfu/eslint-config`
- Правила для Vue и TypeScript
- Автоформатирование

## Деплой

### Статический хостинг
```bash
npm run build
# Загрузите содержимое dist/ на ваш хостинг
```

## SEO

- **useHead** — управление мета-тегами и SEO (автоимпорт, явный импорт не нужен)

### Использование useHead
```html
<script setup lang="ts">
useHead({
  title: 'Заголовок страницы',
  meta: [
    { name: 'description', content: 'Описание страницы' },
    { property: 'og:title', content: 'Заголовок для соцсетей' },
    { property: 'og:description', content: 'Описание для соцсетей' }
  ]
})
</script>
```

## Производительность

- **Статическая генерация** — Vue используется только на этапе разработки
- **Минификация vendor кода** — оптимизированный JavaScript
- **Tree-shaking** — удаление неиспользуемого кода
- **Оптимизация изображений** — автоматическое создание AVIF/WebP с 1x/2x версиями
- **Оптимизация шрифтов** — автоматическое сжатие и конвертация
- **Чистый HTML/CSS/JS** — без фреймворка в продакшене

## Дополнительные ресурсы

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite SSG](https://github.com/antfu/vite-ssg)
- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)
- [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)
- [BEM Methodology](https://getbem.com/)
- [SCSS Documentation](https://sass-lang.com/)

## Лицензия

MIT License

---

**Создано с ❤️ для современной веб-разработки**
