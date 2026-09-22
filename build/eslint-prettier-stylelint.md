# ESLint, Prettier, Stylelint

### ESLint

**ESLint** — один из наиболее популярных линтеров для проектов на JavaScript, мощный инструмент для статического анализа кода. Он содержит большой набор встроенных правил, которые вы можете настроить для своего проекта. сервис способен анализировать код без выполнения. Обеспечивает единообразие стиля программирования в рамках всего проекта. Может выявлять распространенные ошибки — синтаксические ошибки, неопределенные переменные или неправильное использование API

**Установка**

*npm install eslint --save-dev*

**Запуск мастера настройки клиента** - задаст несколько вопросов о стиле программирования и среде, создаст файл конфигурации .eslintrc

*npx eslint --init*

**.eslintrc** - файл для определения правил

```
{
  "env": { // Указывает, в какой среде выполняется код
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser", // какой парсер использовать (если не указать - будет встроенный Espree)
  "plugins": ["react", "@typescript-eslint"],
  "rules": {  // Правила можно настраивать: "off", "warn", "error", или задавать параметры (например, ["error", { "max": 80 }] для max-len)
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn",
    "react/prop-types": "off",
    "no-console": "warn", // Запрещает использование console.log
    "eqeqeq": "warn" // Требует использования === вместо ==
    "max-len": ["error", { "max": 80 }] // Ограничивает длину строки
  }
}
```

**добавить скрипт в свой файл package.json,** запустить npm run lint

```
"scripts": {
  "lint": "eslint ."
  "lint-and-fix": "eslint . --ext .ts --fix" // В результате появляется сообщение об ошибках
}
```

**Создать .eslintignore**, добавить туда

*node\_modules
dist //* тут скомпилированный код на TypeScript

### **Что такое парсеры в ESLint?**

Парсер — это "переводчик", который помогает ESLint понять, как читать и анализировать твой код. По умолчанию ESLint работает с обычным JavaScript (на основе движка Espree), но если ты используешь нестандартный синтаксис (например, TypeScript или новые возможности JS), нужен специальный парсер.

**Простыми словами**: парсер — это как очки для ESLint, чтобы он мог "увидеть" и разобрать твой код правильно.

#### Примеры парсеров:

1. **Espree** (по умолчанию):

   * Подходит для стандартного JavaScript (ES5, ES6\+).

   * Не нужен для простых проектов, так как встроен в ESLint.

2. @babel /eslint-parser:

   * Используется, если в проекте есть экспериментальные возможности JavaScript (например, через Babel, для необъявленных в стандарте фич).

   * Пример: если ты используешь новый синтаксис, который ещё не поддерживается стандартным JavaScript.

3. @typescript-eslint /parser:

   * Нужен для работы с TypeScript. Он понимает типы, интерфейсы и другие особенности TS.

   * Без этого парсера ESLint не сможет анализировать TypeScript-код.

#### Как настроить парсер?

В файле .eslintrc.json указываешь, какой парсер использовать:

```
{
  "parser": "@typescript-eslint/parser"
}
```

Если не указать парсер, ESLint будет использовать встроенный Espree. Для TypeScript или других случаев нужно явно указать нужный парсер и установить его:

bash

`npm install @typescript-eslint/parser --save-dev`

### **Плагины в ESLint?**

\-это "дополнения" к ESLint, которые добавляют новые правила или расширяют его возможности. Если стандартные правила ESLint (например, no-unused-vars) не покрывают твои потребности, плагины добавляют специфические проверки, связанные с фреймворками или инструментами.

**Простыми словами**: плагин — это как набор дополнительных инструментов для проверки кода, например, для React, Vue или TypeScript.

#### Примеры популярных плагинов:

1. **eslint-plugin-react**:

   * Добавляет правила для React, например, проверяет правильность использования хуков или пропсов.

   * Пример правила: react/prop-types (проверяет, что пропсы задокументированы, если не используется TypeScript).

2. **eslint-plugin-react-hooks**:

   * Проверяет корректность использования хуков React (например, чтобы хуки вызывались только в компонентах или в определённом порядке).

   * Пример правила: react-hooks/rules-of-hooks.

3. @typescript-eslint /eslint-plugin:

   * Добавляет правила, специфичные для TypeScript. Например, проверяет, чтобы не было лишних any-типов ( @typescript-eslint /no-explicit-any).

4. **eslint-plugin-vue**:

   * Для проектов на Vue.js. Проверяет правильность написания шаблонов, компонентов и т.д.

5. **eslint-plugin-prettier**:

   * Интегрирует ESLint с Prettier, чтобы форматирование кода (например, отступы) тоже проверялось как часть линтинга.

#### Как настроить плагин?

1. Установи плагин:
   npm install eslint-plugin-react eslint-plugin-react-hooks --save-dev

2. Подключи его в .eslintrc.json:

   ```
   {
     "plugins": ["react", "react-hooks"],
     "rules": {
       "react-hooks/rules-of-hooks": "error",
       "react-hooks/exhaustive-deps": "warn"
     }
   }
   ```

3. Часто плагины идут с готовыми наборами правил (пресетами). Например:

   ```
   {
     "extends": ["plugin:react/recommended", "plugin:react-hooks/recommended"]
   }
   ```

---

### Prettier

\-делает код красивым

**Установка:**
npm install prettier

**Настройки в файле .prettierrc**

```
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```

**Подключить в .eslintrc** (отключает конфликтующие правила ESLint)

```
{
  "extends": ["plugin:prettier/recommended"]
}
```

---

### **Stylelint**

Stylelint — это линтер для стилей, аналог ESLint, но для CSS и препроцессоров. Он проверяет код стилей на:

* Обеспечивает консистентный стиль кода в команде.

* Помогает избежать багов в стилях (например, неправильные единицы измерения).

* Упрощает ревью кода, так как все следуют одним правилам.

* Интегрируется с современными инструментами (редакторы, CI/CD, Prettier).

  **Установка**:

  `npm install stylelint stylelint-config-standard --save-dev`

  * stylelint — основной пакет.

  * stylelint-config-standard — популярный пресет с базовыми правилами.

  **Создание конфигурации**: .stylelintrc.json:

  ```
  {
    "extends": "stylelint-config-standard",
    "rules": {
      "indentation": 2,
      "number-leading-zero": "always",
      "color-hex-length": "short",
      "declaration-block-no-duplicate-properties": true
    }
  }
  ```

  **Запуск**:

  * Проверить все CSS-файлы: npx stylelint "\*\*/\*.css".

  * Автоисправление: npx stylelint "\*\*/\*.css" --fix (многие правила поддерживают автокоррекцию).

#### **Популярные пресеты**

```
{
  "extends": [
    "stylelint-config-standard", // Базовый набор правил
    "stylelint-config-recess-order" // Устанавливает порядок свойств в CSS
    "stylelint-config-recommended" // Минимальный набор правил, только для явных ошибок
    "stylelint-config-prettier" // Отключает правила Stylelint, которые конфликтуют с Prettier
    "stylelint-config-standard-scss" // Для проектов с SCSS
  ]
}
```

#### **Плагины**

Плагины добавляют дополнительные правила, которых нет в стандартном Stylelint. Примеры:

* **stylelint-scss**:

  * Плагин для SCSS, добавляет правила вроде scss/at-rule-no-unknown (проверяет валидность SCSS-директив).

  * Установка:

    `npm install stylelint-scss --save-dev`

  * Настройка в .stylelintrc.json:

    ```
    {
      "extends": "stylelint-config-standard-scss",
      "plugins": ["stylelint-scss"],
      "rules": {
        "scss/at-rule-no-unknown": true
      }
    }
    ```

* **stylelint-a11y**:

  * Проверяет стили на доступность (например, достаточный контраст цветов).

* **stylelint-declaration-block-no-ignored-properties**:

  * Проверяет, что свойства CSS применяются корректно (например, display: inline не используется с width).

#### **Процессоры**

\-чтобы Stylelint мог работать с нестандартными форматами стилей. Пример:

* **stylelint-processor-styled-components**:

  * Для работы с CSS-in-JS (например, styled-components).

  * Установка:

    bash

    `npm install stylelint-processor-styled-components --save-dev`

  * Настройка в .stylelintrc.json:

    ```
    {
      "processors": ["stylelint-processor-styled-components"],
      "extends": "stylelint-config-standard"
    }
    ```