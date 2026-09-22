# tsconfig.json

С помощью файла tsconfig.json можно настроить проект TypeScript. В частности, этот файл выполняет следующие задачи:

* устанавливает корневой каталог проекта TypeScript

* выполняет настройку параметров компиляции

* устанавливает файлы проекта

* определяет, как TypeScript будет компилировать (транспилировать) код

#### Основные разделы tsconfig.json:

* **compilerOptions**: Основной раздел, где задаются настройки компилятора.

* **include**: Указывает, какие файлы или папки включать в компиляцию (например, \["src/\*\*/\*"\]).

* **exclude**: Указывает, какие файлы или папки игнорировать (например, \["node\_modules"\]).

* **extends**: Позволяет наследовать настройки из другого tsconfig.json.

```javascript
{
  "compilerOptions": {
    "target": "ES2020", // Версия JavaScript, в которую компилируется код
    "module": "CommonJS", // Система модулей (CommonJS, ESModules и др.)
    "outDir": "./dist", // Папка для выходных JS-файлов
    "rootDir": "./src", // Корневая папка с TS-файлами
    "strict": true, // Включает строгие проверки типов
    "esModuleInterop": true, // Упрощает работу с модулями CommonJS
    "skipLibCheck": true // Пропускает проверку типов в файлах .d.ts
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### **Настройка TypeScript**

Настройка TypeScript включает установку компилятора, создание tsconfig.json и интеграцию с инструментами сборки (если нужно).

#### Установка TypeScript:

1. Установи TypeScript глобально или локально: `npm install -g typescript` или `npm install --save-dev typescript`

2. Создай tsconfig.json: `tsc --init -` Это создаст базовый файл конфигурации, который можно настроить под свои нужды.

#### Интеграция с инструментами:

* **Node.js**: Используй ts-node для запуска TS-файлов без предварительной компиляции:

  ```
  npm install --save-dev ts-node
  npx ts-node script.ts
  ```

* **Webpack/Vite**: Для проектов с фронтендом настрой загрузчики (ts-loader, esbuild-loader) или плагины для работы с TypeScript.

* **ESLint/Prettier**: Настрой линтеры для проверки кода и форматирования:

  ```
  npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
  ```

---

### 4. **Транспиляция TypeScript**

Транспиляция — это процесс преобразования TypeScript-кода в JavaScript, который может выполняться в браузере или Node.js. За это отвечает компилятор tsc (TypeScript Compiler).

#### Как работает транспиляция:

1. **Проверка типов**: TypeScript анализирует код на наличие ошибок типов (например, передача строки в функцию, ожидающую число).

2. **Удаление типов**: Все типы, интерфейсы и другие TS-специфичные конструкции удаляются, так как они не существуют в JavaScript.

3. **Генерация JavaScript**: Получается чистый JS-код, соответствующий указанной версии (target).

#### Запуск транспиляции:

* Для одного файла: `tsc file.ts` - Это создаст file.js в той же папке.

* Для всего проекта (согласно tsconfig.json): `tsc`

* В режиме наблюдения (рекомпилировать при изменении файлов): `tsc --watch`

#### Пример:

TypeScript-код:

```javascript
interface User {
  name: string;
  age: number;
}

function greet(user: User) {
  return `Hello, ${user.name}!`;
}

const user = { name: "Alice", age: 25 };
console.log(greet(user));
```

После транспиляции в JavaScript (target: ES2020):

```javascript
function greet(user) {
  return `Hello, ${user.name}!`;
}

const user = { name: "Alice", age: 25 };
console.log(greet(user));
```

Типы и интерфейсы удалены, код стал чистым JavaScript.