# Задачи про функции, контекст, замыкание

1) #### Что выведет в консоль?

   ```javascript showLineNumbers
   const user = {
     name: "Аня",
     sayHi: function() { console.log(this.name) },
     sayHiArrow: () => console.log(this.name)
   }
   
   user.sayHi()       // Аня
   user.sayHiArrow()  // undefined
   const hi = user.sayHi
   hi()               // undefined
   ```

2) Что выведет? Как сделать 0 1 2 3 4 тремя разными способами?

   ```javascript showLineNumbers
   for (var i = 0; i < 5; i++) {
     setTimeout(() => console.log(i), 100)
   }
   
   Ответы:
   1) let имеет блочную область видимости — на каждой итерации создаётся своя переменная i
   for (let i = 0; i < 3; i++) {
     setTimeout(function() {
       console.log(i); // 0, 1, 2
     }, 1000);
   }
   
   2) IIFE (immediately invoked function expression)
   // Мы создаём функцию и сразу вызываем её, передавая i как аргумент j. 
   // Функция создаёт новую область видимости — значение "захлопывается" внутри замыкания на каждой итерации.
   for (var i = 0; i < 3; i++) {
     (function(j) {
       setTimeout(function() {
         console.log(j); // 0, 1, 2
       }, 1000);
     })(i);
   }
   
   3) третий аргумент setTimeout(fn, delay, ...args) — всё что после delay передаётся в коллбэк как аргументы. Значение i копируется в момент вызова setTimeout.
   for (var i = 0; i < 3; i++) {
     setTimeout(function(j) {
       console.log(j); // 0, 1, 2
     }, 1000, i);
   }
   ```

3) Что выведет счетчик?

   ```javascript showLineNumbers
   function makeCounter() {
     let count = 0;
   
     return function() {
       count++;
       return count;
     };
   }
   
   const counter = makeCounter(); // мы создаем отдельный экземпляр счетчика, внутри него создается замыкание
   // Возвращаемая функция ищет переменную count, находит ее внутри функции и производит с ней какие-то действия.
   
   console.log(counter()); // 1
   console.log(counter()); // 2
   console.log(counter()); // 3
   
   const counter2 = makeCounter(); // это новое замыкание и новый экземпляр, там отсчет начнется снова с 1
   console.log(counter2()); // 1
   ```

4) Как вызвать `greet` тремя разными способами, чтобы получить строку `"Hello, Alice!"`?

   ```javascript showLineNumbers
   function greet(greeting, punctuation) {
     return `${greeting}, ${this.name}${punctuation}`;
   }
   
   const user = { name: 'Alice' };
   
   // 1 способ - добавить функцию greet как метод объекта
   user.greeting = greet;
   console.log(user.greeting('Hello', '!'))
   // 2 способ - использовать call, передать туда объект и список аргументов
   console.log(greet.call(user, 'Hello', '!'))
   // 3 способ - использовать apply, передать туда объект и массив аргументов
   console.log(greet.apply(user, ['Hello', '!']))
   // 4 способ - использовать bind, но потом надо вызвать эту функцию
   const greetAlice = greet.bind(user, 'Hello', '!')
   console.log(greetAlice())
   ```

5) Реализуй функцию `memoize`, которая кэширует результаты вызовов:

   ```javascript showLineNumbers
   function memoize(fn) {
     const cache = new Map();
     
     return function(...args) { // возвращаем функцию
       const key = `${args[0]},${args[1]}`; // собираем ключ (строка) для Map
       
       if (cache.has(key)) { // если в мапе есть такой ключ,
         return cache.get(key); // возвращаем значение из мапы
       }
       
       const result = fn(...args); // если нет такого ключа - вызываем функцию 
       cache.set(key, result); // и записываем результат в мапу
       return result;
     };
   }
   
   function slowAdd(a, b) {
     return a + b;
   }
   
   const fastAdd = memoize(slowAdd);
   
   console.log(fastAdd(2, 3)); // считает: 5
   console.log(fastAdd(2, 3)); // из кэша: 5
   console.log(fastAdd(1, 4)); // считает: 5
   ```

6) Реализуйте функцию once, которая принимает функцию и возвращает новую, которая вызовет оригинальную только один раз, а при последующих вызовах будет возвращать результат первого вызова.

```javascript showLineNumbers
function once(fn) {
  let called = false; // создаем флажок, вызывалась функция или нет 
  let result;
  
  return function(...args) { // возвращаем функцию
    if (!called) { // если не вызывалась - 
      called = true; // меняем флажок,
      result = fn(...args); // записываем в result результат вызова
    }
    return result; // если вызывалась - просто возвращем result
  };
}

const add = (a, b) => a + b
const addOnce = once(add)

console.log(addOnce(5, 7))   // 12
console.log(addOnce(10, 20)) // 12
```

7. Каррирование

```javascript
function curry(fn) {
  return function curried(...args) { // возвращает новую функцию curried, которая принимает любое количество аргументов через rest (...args).
	// проверяем: накопилось ли уже достаточно аргументов — сравниваем args.length (сколько реально передали) с fn.length (сколько аргументов ожидает исходная функция)
    if (args.length >= fn.length) {
	// Если аргументов достаточно - вызываем исходную функцию fn со всеми накопленными аргументами через apply, возвращаем результат
      return fn.apply(this, args);
    } else {
	// Если аргументов не хватает — возвращаем новую функцию, которая при вызове (когда ей передадут ещё аргументы args2) 
	// объединит старые и новые аргументы (args.concat(args2)) и рекурсивно вызовет curried заново
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
```