# Vue SSG Starter

Современный шаблон для создания статических сайтов на Vue 3 с использованием Vite SSG.
Включает в себя все необходимые инструменты для разработки и сборки.

## 🚀 Особенности

- **Vue 3** используется как шаблонизатор
- **Vite SSG** для статической генерации
- **TypeScript** для типобезопасности
- **ESLint** и **Stylelint** для качества кода
- **Готовые компоненты** и утилиты
- **Статический вывод** - Vue код не попадает в итоговую сборку

## 📋 Требования

- Node.js: `^20.19.0 || >=22.12.0`
- npm или yarn

## 🛠 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd vue-ssg-starter
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

## 📜 Доступные команды

### Разработка
- `npm run dev` - запуск сервера разработки

### Сборка
- `npm run build` - полная сборка проекта (включает оптимизацию и линтинг)
- `npm run preview` - предварительный просмотр собранного проекта

### Линтинг и форматирование
- `npm run lint` - проверка кода линтерами и автоматическое исправление
- `npm run fix-all` - полная оптимизация (px-to-rem + линтинг)

### Утилиты
- `npm run fonts` - генерация woff2 шрифтов из исходников
- `npm run px-to-rem` - конвертация px в rem

## 📁 Структура проекта

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
│   ├── components/     # Vue компоненты
│   │   ├── form/       # Формы и инпуты
│   │   ├── layout/     # Компоненты макета
│   │   └── ...         # Остальные компоненты
│   ├── pages/          # Страницы приложения
│   ├── routes/         # Конфигурация роутинга
│   ├── sections/       # Секции страниц
│   ├── styles/         # SCSS стили
│   │   ├── helpers/    # Переменные, миксины
│   │   ├── libs/       # Стили библиотек
│   │   └── index.ts    # Точка входа стилей
│   ├── types/          # TypeScript типы
│   └── utils/          # Утилиты и библиотеки
│       ├── forms/      # Работа с формами
│       ├── libs/       # JavaScript библиотеки
│       └── tasks/      # Задачи сборки
```

### Разница между папками
- **`public/`** - статические файлы, которые копируются в корень сайта без обработки
- **`src/assets/`** - ресурсы, которые обрабатываются сборщиком (оптимизация, хеширование)

## 🎨 Стилизация

Проект использует SCSS с BEM методологией. Все стили организованы в модульной структуре:

### Основные файлы стилей:
- `styles/helpers/variables.scss` - переменные
- `styles/helpers/mixins.scss` - миксины
- `styles/colors.scss` - цветовая палитра
- `styles/fonts.scss` - стили шрифтов (генерируются через `npm run fonts`)

### Использование:
```scss
// В компонентах доступны все переменные и миксины
.my-component {
  @include adaptive-value('padding', 20, 10);
  color: $primaryColor;
}
```

## 🧩 Компоненты

### Готовые компоненты:
- **Icon** - SVG иконки из папки assets/icons
- **FormField** - поля форм
- **Checkbox/Radio** - чекбоксы и радиокнопки
- **Select** - селекты
- **Popup** - модальные окна
- **Breadcrumb** - хлебные крошки

### Использование:

#### Icon
Для использования иконок:
1. Поместите SVG файл в папку `src/assets/icons/`
2. Используйте компонент Icon с именем файла:

```html
<template>
  <Icon
    name="close"
    size="24"
  />
  <Icon
    name="menu"
    width="32"
    height="32"
  />
</template>
```

**Props:**
- `name` - название иконки (имя файла без .svg)
- `size` - размер иконки в пикселях
- либо отдельно `width` и `height`

## 🔤 Работа со шрифтами

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

## 🔧 Утилиты

### JavaScript библиотеки:
- **Popup** - управление модальными окнами
- **Spoilers** - аккордеоны
- **Tabs** - табы
- **ScrollWatcher** - отслеживание скролла
- **ResponsiveAdapter** - изменения порядка элементов на определенной ширине
- **Gallery** - галереи изображений
- **Menu** - логика бургер-меню
- **Parallax** - параллакс эффекты
- **ShowMore** - показать еще
- **Map** - инициализация Yandex Карт

📖 **Документация по использованию:** [snippets.maximtresk.ru](https://snippets.maximtresk.ru/)

### Формы:
- **InputMask** - маски ввода
- **DatePicker** - выбор даты
- **Range** - диапазоны
- **Quantity** - количество

## ⚙️ Конфигурация

### Vite (vite.config.ts)
- Настроен для SSG
- Автоматическая оптимизация ресурсов
- Алиасы путей
- SCSS препроцессор

### TypeScript
- Строгая типизация
- Современные настройки
- Поддержка Vue 3

### ESLint
- Конфигурация @antfu/eslint-config
- Правила для Vue и TypeScript
- Автоформатирование

## 🚀 Деплой

### Статический хостинг
```bash
npm run build
# Загрузите содержимое dist/ на ваш хостинг
```

## 🎯 SEO

- **useHead** - управление мета-тегами и SEO

### Использование useHead
```html
<script setup lang="ts">
import { useHead } from '@unhead/vue'

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

## 🔍 Производительность

- **Статическая генерация** - Vue используется только на этапе разработки
- **Минификация vendor кода** - оптимизированный JavaScript
- **Tree-shaking** - удаление неиспользуемого кода
- **Оптимизация шрифтов** - автоматическое сжатие и конвертация
- **Чистый HTML/CSS/JS** - без фреймворка в продакшене

## 📚 Дополнительные ресурсы

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite SSG](https://github.com/antfu/vite-ssg)
- [BEM Methodology](https://getbem.com/)
- [SCSS Documentation](https://sass-lang.com/)

## 📄 Лицензия

MIT License

---

**Создано с ❤️ для современной веб-разработки**
