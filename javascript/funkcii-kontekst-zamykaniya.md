# Функции, контекст, замыкания

## **Функции**

Функции в JS — это объекты, которые можно вызывать для выполнения кода. Они используются для структурирования и повторного использования кода.

* **Объявление функций**:

  * **Function Declaration**: `function sayHello() { return "Hello"; }` — создаётся до выполнения кода (hoisting).

  * **Function Expression**: `const sayHello = function() { return "Hello"; };` — создаётся при выполнении строки.

  * **Arrow Function**: `const sayHello = () => "Hello";` — компактный синтаксис, не имеет собственного this и arguments, нет конструктора (new)

  * **Функция-генератор** - не возвращают одно значение, а порождают (yield) множество значений одно за другим

  * **Конструктор new Function** `let sum = new Function('a', 'b', 'return a + b')`- создается из строки, переданной во время выполнения

* **Параметры и аргументы**:

  * Параметры могут иметь значения по умолчанию: `function greet(name = "Guest") { return Hello, ${name}; }.`

  * Остаточные параметры: `function sum(...numbers) { return numbers.reduce((a, b) => a + b); }`.

* **Возврат значения**:

  * Если не указан return, функция возвращает undefined.

  * return завершает выполнение функции.

* **Hoisting** (процесс доступа к переменным до их определения):

  * Function Declaration поднимается в начало области видимости, поэтому можно вызывать функцию до её объявления.

  * Function Expression и Arrow Function не поднимаются.

## **Контекст (this)**

Контекст в JS определяет, на что ссылается ключевое слово this при вызове функции. Значение this зависит от того, как функция вызвана.

* **Способы вызова функции**:

  * **Обычный вызов**: this — это window (в браузере) или undefined (в строгом режиме, "use strict").

    ```javascript
    function showThis() { console.log(this); }
    showThis(); // window или undefined
    ```

  * **Метод объекта**: this — это объект, к которому привязан метод.

    ```javascript
    const obj = { name: "Alice", greet() { console.log(this.name); } };
    obj.greet(); // Alice
    ```

  * **Конструктор**: this — это новый созданный объект.

    ```javascript
    function Person(name) { this.name = name; }
    const alice = new Person("Alice"); // this = { name: "Alice" }
    ```

  * **Явная привязка**: Используется call, apply, bind для задания this.

    #|
    ||
    
    **call**:

    * Вызывает функцию сразу, задавая this и передавая аргументы **по одному**.

    * Синтаксис: func.call(thisArg, arg1, arg2, ...)

    |
    
    **apply**:

    * Вызывает функцию сразу, задавая this, но аргументы передаются **массивом**.

    * Синтаксис: func.apply(thisArg, \[arg1, arg2, ...\])

    |
    
    **bind**:

    * **Не вызывает** функцию сразу, а возвращает **новую функцию** с привязанным this и, при необходимости, частично заданными аргументами.

    * Синтаксис: const newFunc = func.bind(thisArg, arg1, arg2, ...)

    ||
    ||
    
    ```javascript
    function greet(greeting) {
      console.log(`${greeting}, ${this.name}`);
    }
    const obj = { name: "Alice" };
    greet.call(obj, "Hello"); // Hello, Alice
    ```

    |
    
    ```javascript
    function greet(greeting, punctuation) {
      console.log(`${greeting}, ${this.name}${punctuation}`);
    }
    const obj = { name: "Bob" };
    greet.apply(obj, ["Hi", "!"]); // Hi, Bob!
    ```

    |
    
    ```javascript
    function greet(greeting, punctuation) {
      return `${greeting}, ${this.name}${punctuation}`;
    }
    const user = { name: 'Alice' };
    const greetHello = greet.bind(user, 'Hello');
    // 'Hello' уже зафиксирован, punctuation передаём потом
    console.log(greetHello('!')); // "Hello, Alice!"
    console.log(greetHello('?')); // "Hello, Alice?"
    ```

    ||
    |#
    
    &nbsp;
    

* **Arrow Functions**:

  * Не имеют собственного this, берут его из окружающего контекста (лексический контекст).

    ```javascript
    const obj = {
      name: "Alice",
      greet: () => console.log(this.name)
    };
    obj.greet(); // undefined, так как this берётся из внешнего контекста (например, window)
    ```

* **Проблемы с this**:

  * Потеря контекста при передаче метода как коллбэка. Решение: bind или стрелочные функции.

    ```javascript
    const obj = {
      name: "Alice",
      greet() { console.log(this.name); }
    };
    setTimeout(obj.greet, 1000); // undefined (this = window)
    setTimeout(obj.greet.bind(obj), 1000); // Alice
    ```

## **Замыкания**

Замыкание — это функция, которая запоминает свою внешнюю область видимости, даже если эта область уже недоступна.

* **Как работает**:

  * Функция, определённая внутри другой функции, имеет доступ к переменным внешней функции.

  * Замыкание сохраняет ссылки на эти переменные, а не их копии.

    ```javascript
    function makeCounter() {
      let count = 0;
      return function() {
        return count++;
      };
    }
    const counter = makeCounter();
    console.log(counter()); // 0
    console.log(counter()); // 1
    ```

* **Применение замыканий**:

  * **Сохранение состояния**: Например, счётчики, генераторы ID.

  * **Инкапсуляция данных**:

    ```javascript
    function createUser(name) {
      return {
        getName() { return name; },
        setName(newName) { name = newName; }
      };
    }
    const user = createUser("Alice");
    console.log(user.getName()); // Alice
    ```

  * **Каррирование**:

    ```javascript
    function add(a) {
      return function(b) {
        return a + b;
      };
    }
    const add5 = add(5);
    console.log(add5(3)); // 8
    ```

  * **Обработка событий**: Сохранение контекста или данных для коллбэков.

* **Особенности**:

  * Переменные в замыкании сохраняются в памяти, пока функция доступна.

  * Это может приводить к утечкам памяти, если замыкания используются неосторожно.