# Map и Set

## Map

– это коллекция ключ/значение, как и `Object`. Но основное отличие в том, что `Map` позволяет использовать **{blue}(ключи любого типа \(даже объекты,)** [`null`](https://doka.guide/js/null-primitive/), [`undefined`](https://doka.guide/js/undefined/) и [`NaN`](https://doka.guide/js/number/#specialnye-znacheniya)**{blue}(\))**. Для сравнения ключей используется алгоритм *SameValueZero*

Методы и свойства:

* [`new Map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/Map) – создаёт коллекцию.

* [`map.set(key, value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set) – записывает по ключу `key` значение `value`.

* [`map.get(key)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) – возвращает значение по ключу или `undefined`, если ключ `key` отсутствует.

* [`map.has(key)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has) – возвращает `true`, если ключ `key` присутствует в коллекции, иначе `false`.

* [`map.delete(key)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete) – удаляет элемент (пару «ключ/значение») по ключу `key`.

* [`map.clear()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear) – очищает коллекцию от всех элементов.

* [`map.size`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size) – возвращает текущее количество элементов.

* `map.values()` — возвращает [итератор](https://doka.guide/js/iterator/) всех значений коллекции;

* `map.keys()` — возвращает итератор всех ключей коллекции;

* `map.entries()` — возвращает итератор пар `[ключ, значение]`;

* `map.delete(ключ)` — удаляет конкретное значение;

* `map.clear()` — полностью очищает коллекцию;

* `map.forEach(коллбэк)` — перебирает ключи и значения коллекции.

```javascript
let map = new Map();
map.set("1", "str1");    // строка в качестве ключа
map.set(1, "num1");      // цифра как ключ
map.set(true, "bool1");  // булево значение как ключ
alert(map.size); // 3
```

##### Для перебора коллекции `Map` есть 4 метода:

* [`map.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys) – возвращает итерируемый объект по ключам,

* [`map.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values) – возвращает итерируемый объект по значениям,

* [`map.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries) – возвращает итерируемый объект по парам вида `[ключ, значение]`, этот вариант используется по умолчанию в `for..of`.

* `forEach`

```javascript
let recipeMap = new Map([
  ["огурец", 500],
  ["помидор", 350],
  ["лук",    50]
]);
// перебор по ключам (овощи)
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // огурец, помидор, лук
}
// перебор по значениям (числа)
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}
// перебор по элементам в формате [ключ, значение]
for (let entry of recipeMap) { // то же самое, что и recipeMap.entries()
  alert(entry); // огурец,500 (и так далее)
// выполняем функцию для каждой пары (ключ, значение)
recipeMap.forEach((value, key, map) => {
  alert(`${key}: ${value}`); // огурец: 500 и так далее
});
```

Создать Map из объекта и обратно - `Object.entries` и `Object.fromEntries`

```javascript
let obj = { name: "John", age: 30};
let map = new Map(Object.entries(obj));

let prices = Object.fromEntries([
  ['banana', 1],
  ['orange', 2],
  ['meat', 4]
]);
// prices = { banana: 1, orange: 2, meat: 4 }
alert(prices.orange); // 2
```

## Set

– это особый вид коллекции: «множество» уникальных значений (без ключей)

Его основные методы это:

* [`new Set(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/Set) – создаёт `Set`, и если в качестве аргумента был предоставлен итерируемый объект (обычно это массив), то копирует его значения в новый `Set`.

* [`set.add(value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add) – добавляет значение (если оно уже есть, то ничего не делает), возвращает тот же объект `set`.

* [`set.delete(value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/delete) – удаляет значение, возвращает `true`, если `value` было в множестве на момент вызова, иначе `false`.

* [`set.has(value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) – возвращает `true`, если значение присутствует в множестве, иначе `false`.

* [`set.clear()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/clear) – удаляет все имеющиеся значения.

* [`set.size`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/size) – возвращает количество элементов в множестве.

* [`set.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/values) – возвращает перебираемый объект для значений,

* [`set.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/keys) – то же самое, что и `set.values()`, присутствует для обратной совместимости с `Map`,

* [`set.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries) – возвращает перебираемый объект для пар вида `[значение, значение]`, присутствует для обратной совместимости с `Map`.

```javascript
let set = new Set();
let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };
// считаем гостей, некоторые приходят несколько раз
set.add(john);
set.add(pete);
set.add(mary);
set.add(john);
set.add(mary);
alert(set.size); // 3 // set хранит только 3 уникальных значения
```

##### Перебор Set

```javascript
let set = new Set(["апельсин", "яблоко", "банан"]);
for (let value of set) alert(value);
// то же самое с forEach:
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```

## WeakMap

- ключи - только объекты (можно даже пустые)
- если мы используем объект в качестве ключа и если больше нет ссылок на этот объект, то он будет удалён из памяти (и из объекта `WeakMap`) автоматически

В `WeakMap` присутствуют только следующие методы:

* `weakMap.get(key)`

* `weakMap.set(key, value)`

* `weakMap.delete(key)`

* `weakMap.has(key)`

## WeakSet

Коллекция `WeakSet` ведёт себя похоже:

* Она аналогична `Set`, но мы можем добавлять в `WeakSet` только объекты (не примитивные значения).

* Объект присутствует в множестве только до тех пор, пока доступен где-то ещё.

* Как и `Set`, она поддерживает `add`, `has` и `delete`, но не `size`, `keys()` и не является перебираемой.