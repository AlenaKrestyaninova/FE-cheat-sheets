# Webpack

Webpack — это **модульный сборщик** (module bundler), который берёт все файлы твоего проекта (JS, CSS, изображения, шрифты и т.д.) и собирает их в оптимизированные файлы для продакшена (обычно это несколько JS- и CSS-файлов).

* **Объединяет модули**: Превращает множество файлов (например, ES-модули, CommonJS) в один или несколько бандлов.

* **Оптимизирует код**: Минифицирует, убирает неиспользуемый код (tree shaking), сжимает ресурсы.

* **Обрабатывает ресурсы**: Компилирует SCSS в CSS, преобразует современный JS (через Babel), оптимизирует изображения.

* **Поддерживает горячую перезагрузку**: Hot Module Replacement (HMR) ускоряет разработку, обновляя изменения в реальном времени.

* **Гибкость**: Подходит для любых проектов — от простых сайтов до сложных SPA на React/Vue.

---

### **Основные концепции Webpack**

1. **Entry (Точка входа)**:

   * Указывает, с какого файла начать сборку. Обычно это главный JS-файл './src/index.js'.

2. **Output (Выход)**:

   * Определяет, куда и как сохранять собранные файлы: output: \{ path: './dist', filename: 'bundle.js' \}.

3. **Loaders (Загрузчики)**:

   * Преобразуют файлы перед их включением в бандл. Например, компилируют SCSS в CSS или TypeScript в JavaScript.

4. **Plugins (Плагины)**:

   * Расширяют возможности Webpack: минификация, очистка папки сборки, генерация HTML и т.д (HtmlWebpackPlugin создаёт HTML-файл с подключёнными бандлами).

5. **Mode (Режим)**:

   * development: Быстрая сборка с дебаг-информацией и HMR.

   * production: Оптимизированная сборка с минификацией и tree shaking.

6. **Module Resolution**:

   * Webpack понимает, как импортировать модули (например, import в JS или @import в CSS).

---

### **Установка и базовая настройка**

1. **Установка**:

   `npm install webpack webpack-cli --save-dev`

2. **Создание конфигурации**:  webpack.config.js в корне проекта.

   ```javascript
   const path = require('path');
   module.exports = {
     mode: 'development',
     entry: './src/index.js',
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bundle.js'
     }
   };
   ```

3. **Запуск**:

   * Для разработки: npx webpack --mode=development.

   * Для продакшена: npx webpack --mode=production.

   * Или добавь скрипты в package.json:

     ```
     {
       "scripts": {
         "build": "webpack --mode=production",
         "dev": "webpack --mode=development"
       }
     }
     ```

   ---

### **Ключевые загрузчики (Loaders)**

Loaders обрабатывают разные типы файлов. Преобразуют файлы перед их включением в бандл. Например, компилируют SCSS в CSS или TypeScript в JavaScript.
**Важно**: Loaders применяются справа налево (например, в \['style-loader', 'css-loader', 'sass-loader'\] сначала работает sass-loader, потом css-loader, затем style-loader).

#|
||

**Loader**

|

**Установка**

|

**Настройка**

||
||

**babel-loader -** Компилирует современный JS (ES6\+) в старый (ES5) для поддержки старых браузеров

|

`npm install babel-loader ` @babel` /core ` @babel` /preset-env --save-dev`

|

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }
  ]
}
```

||
||

**css-loader:** Позволяет импортировать CSS в JS.

**style-loader**: Вставляет CSS в DOM через \<style\>.

|

`npm install css-loader style-loader --save-dev`

|

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
```

||
||

**sass-loader -** Компилирует SCSS/SASS в CSS

|

`npm install sass sass-loader --save-dev`

|

```javascript
module: {
  rules: [
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
  ]
}
```

||
||

**file-loader или url-loader -** Для обработки изображений, шрифтов и других файлов

|

`npm install file-loader --save-dev`

|

```javascript
module: {
  rules: [
    {
      test: /\.(png|jpg|svg)$/,
      use: 'file-loader'
    }
  ]
}
```

||
|#

&nbsp;

---

### **Ключевые плагины**

Плагины расширяют функциональность Webpack.

#|
||

**Плагин**

|

**Установка**

|

**Настройка**

||
||

**HtmlWebpackPlugin -** Создаёт HTML-файл и автоматически подключает к нему бандлы

|

`npm install html-webpack-plugin --save-dev`

|

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

||
||

**CleanWebpackPlugin -** Очищает папку dist перед новой сборкой

|

`npm install clean-webpack-plugin --save-dev`

|

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [new CleanWebpackPlugin()]
};
```

||
||

**MiniCssExtractPlugin -** Извлекает CSS в отдельный файл (полезно для продакшена)

|

`npm install mini-css-extract-plugin --save-dev`

|

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })]
};
```

||
|#

---

### **Настройка для разработки**

Для удобной разработки используй **Webpack Dev Server**:

* Установка: `npm install webpack-dev-server --save-dev.`

* Настройка:

  ```javascript
  module.exports = {
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      port: 8080,
      hot: true // Включает Hot Module Replacement
    }xxxxx
  };
  ```

* Запуск: `npx webpack serve --mode=development.`

* Добавь в package.json:

  ```javascript
  {
    "scripts": {
      "start": "webpack serve --mode=development"
    }
  }
  ```

**Преимущества**: Автоматическая перезагрузка, HMR, удобная отладка.

---

### **Интеграция с современными фреймворками**

* **React**:

  * Используй babel-loader с пресетом @babel /preset-react.

  * Настрой HtmlWebpackPlugin для подключения index.html.

  * Пример:

    ```javascript
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        }
      ]
    }
    ```

* **TypeScript**:

  * Используй ts-loader или babel-loader с @babel /preset-typescript.

  * Установка: `npm install ts-loader typescript --save-dev`

  * Настройка:

    ```javascript
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    }
    ```