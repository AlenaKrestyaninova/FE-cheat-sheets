# Vite

Vite (по-французски «быстрый») — это инструмент для сборки и разработки фронтенд-приложений, альтернатива Webpack. Он предназначен для упрощения и ускорения работы с проектами на JavaScript, TypeScript, React, Vue и других фреймворках.

**Зачем нужен?**

* **Скорость разработки**: Vite использует нативные ES-модули (ESM) в браузере, что делает запуск dev-сервера почти мгновенным.

* **Простая настройка**: Минимальная конфигурация по сравнению с Webpack.

* **Оптимизация для продакшена**: В продакшене Vite использует Rollup для создания компактных бандлов.

* **Поддержка современных фреймворков**: Отлично работает с Vue, React, Svelte, TypeScript и т.д.

* **Горячая перезагрузка (HMR)**: Быстро обновляет только изменённые модули без полной перезагрузки.

---

### **Основные концепции Vite**

1. **ES Modules (ESM)**:

   * Vite использует нативные модули браузера (import/export), что исключает необходимость предварительной сборки всего проекта в dev-режиме.

   * Браузер сам загружает только нужные модули, что ускоряет разработку.

2. **Два режима работы**:

   * **Development**: Vite запускает dev-сервер, который обслуживает файлы как ESM без полной сборки.

   * **Production**: Vite использует Rollup для создания оптимизированных бандлов (минификация, code splitting).

3. **Конфигурация**:

   * Настройки задаются в файле vite.config.js (или .ts для TypeScript).

   * Конфигурация минимальна, но гибкая.

4. **Плагины**:

   * Vite использует плагины (на базе Rollup) для обработки CSS, TypeScript, JSX и других форматов.

   * Пример: @vitejs/plugin-react для React.

5. **Hot Module Replacement (HMR)**:

   * Vite автоматически обновляет только изменённые модули в браузере, что делает разработку очень быстрой.

6. **Поддержка ресурсов**:

   * Vite автоматически обрабатывает CSS, SCSS, изображения, шрифты и JSON без сложной настройки.

---

### **Установка и базовая настройка**

1. **Создание проекта**: Vite предлагает удобный CLI для создания проектов:

   `npm create vite@latest`

   * Выбери фреймворк (React, Vue, Svelte, vanilla JS) и тип проекта (JavaScript или TypeScript).

   * Это создаст проект с готовой структурой.

2. **Установка зависимостей**: После создания проекта:` `

   `npm install`

3. **Запуск**:

   * Для разработки: `npm run dev` (запускает dev-сервер, обычно на http://localhost:5173).

   * Для продакшена: `npm run build` (собирает оптимизированный бандл в папку dist).

   * Для предпросмотра: `npm run preview` (запускает локальный сервер с продакшен-сборкой).

4. **vite.config.js**:

   ```javascript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000, // Порт для dev-сервера
       open: true // Открывать браузер автоматически
     }
   });
   ```

---

### **Ключевые возможности Vite**

1. **Обработка CSS**:

   * Vite автоматически поддерживает CSS, PostCSS, SCSS, Less и Stylus.

   * Для SCSS установи препроцессор:`npm install sass --save-dev`

   * Импортируй CSS/SCSS в JS: `import './styles/main.scss';`

2. **Поддержка TypeScript**:

   * Vite понимает TypeScript из коробки (без ts-loader).

   * JSX/TSX для React или Vue тоже работает автоматически.

3. **CSS Modules**:

   * Поддержка CSS-модулей включена по умолчанию. Использует файлы с расширением .module.css:` `

     `.button { color: blue; }`

     ```javascript
     import styles from './styles.module.css';
     console.log(styles.button); // Используется как объект
     ```

4. **Плагины**:

   * Vite использует Rollup-совместимые плагины. Примеры:

     * @vitejs/plugin-react: Для React с поддержкой HMR и Fast Refresh.

     * vite-plugin-svgr: Для импорта SVG как React-компонентов.

     * vite-plugin-eslint: Интеграция ESLint.

   * Установка: `npm install @vitejs/plugin-react --save-dev`

   * Настройка:

     ```javascript
     import react from '@vitejs/plugin-react';
     export default defineConfig({
       plugins: [react()]
     });
     ```

5. **Оптимизация зависимостей**:

   * Vite автоматически предсобирает зависимости из node\_modules (например, React) в ESM-формат для ускорения загрузки.

---

### **Интеграция с инструментами**

1. **ESLint и Stylelint**:

   * Для ESLint:`npm install vite-plugin-eslint --save-dev`

     ```javascript
     import eslint from 'vite-plugin-eslint';
     export default defineConfig({
       plugins: [eslint()]
     });
     ```

   * Для Stylelint аналогично с `vite-plugin-stylelint`.

2. **Prettier**:

   * Настрой автокоррекцию в редакторе (например, VS Code):

     ```javascript
     {
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "editor.formatOnSave": true
     }
     ```

---

### **Преимущества Vite над Webpack**

* **Скорость**:

  * Vite быстрее в dev-режиме, так как не собирает весь проект, а использует ESM.

  * Webpack требует полной сборки даже для разработки.

* **Простота настройки**:

  * Vite требует меньше конфигурации (многие вещи работают из коробки).

  * Webpack часто требует сложных настроек для loaders и plugins.

* **HMR**:

  * Vite предлагает более быстрый и надёжный HMR (Fast Refresh для React).

* **Меньше зависимостей**:

  * Vite лёгкий и не требует множества дополнительных пакетов, как Webpack.

**Когда Webpack лучше?**

* Для сложных проектов с нестандартной настройкой (например, специфические оптимизации).

* Если проект уже настроен на Webpack и миграция не оправдана.