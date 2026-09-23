# Свойства объекта, их конфигурация

# **Флаги и дескрипторы свойств**

## Флаги свойств

* **`writable`** – если `true`, свойство можно изменить, иначе оно только для чтения.

* **`enumerable`** – если `true`, свойство перечисляется в циклах, в противном случае циклы его игнорируют.

* **`configurable`** – если `true`, свойство можно удалить, а эти атрибуты можно изменять, иначе этого делать нельзя.

#### Методы для работы с флагами

#|
||

Метод **Object.getOwnPropertyDescriptor** позволяет получить *полную* информацию о свойстве.

Возвращаемое значение – это объект, так называемый «дескриптор свойства»: он содержит значение свойства и все его флаги.

|

```javascript
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
// obj - Объект, из которого мы получаем информацию.
// propertyName - Имя свойства.
```

|

```javascript
let user = {name: "John"};
let descriptor = Object.getOwnPropertyDescriptor(user, 'name');
alert( JSON.stringify(descriptor, null, 2 ) );
/* дескриптор свойства:
{ "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true}*/
```

||
||

Изменить флаги - метод **Object.defineProperty**.

Если свойство существует, `defineProperty` обновит его флаги. В противном случае метод создаёт новое свойство с указанным значением и флагами; если какой-либо флаг не указан явно, ему присваивается значение `false`.

|

```javascript
Object.defineProperty(obj, propertyName, descriptor)
// obj, propertyName - Объект и его свойство, 
// для которого нужно применить дескриптор.
// decrriptor - Применяемый дескриптор.
```

|

```javascript
let user = {};
Object.defineProperty(user, "name", {
  value: "John"
});
let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{ "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false}*/
```

||
||

**Метод Object.defineProperties -** можно определять множество свойств сразу.

|

```javascript
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
```

|

```javascript
Object.defineProperties(user, {
  name: { value: "John", writable: false },
  surname: { value: "Smith", writable: false },
  // ...
});
```

||
|#

#### Изменить конкретный флаг

#|
||

**writable** - только для чтения

|

```javascript
let user = {name: "John"};
Object.defineProperty(user, "name", {
  writable: false
});
user.name = "Pete"; // Ошибка: Невозможно изменить доступное только для чтения свойство 'name'
```

||
||

**enumerable** - не перечисляется в цикле `for..in`

не возвращаются `Object.keys`

|

```javascript
let user = {
  name: "John",
  toString() { // создали руками свойство
    return this.name;
  }
};
Object.defineProperty(user, "toString", {
  enumerable: false // сделали его неперечисляемым
});
// Теперь наше свойство toString пропало из цикла:
for (let key in user) alert(key); // name
```

||
||

**configurable** - свойство можно удалить,
а эти атрибуты можно изменять

|

```javascript
let descriptor = Object.getOwnPropertyDescriptor(Math, 'PI');
alert( JSON.stringify(descriptor, null, 2 ) );
/*{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}*/
Math.PI = 3; // Ошибка, потому что writable: false

НО можно изменить значение 
let user = {name: "John"};
Object.defineProperty(user, "name", {configurable: false});
user.name = "Pete"; // работает
delete user.name; // Ошибка
```

||
|#

## Object.getOwnPropertyDescriptors

Чтобы получить все дескрипторы свойств сразу, можно воспользоваться методом Object.getOwnPropertyDescriptors(obj).

Вместе с `Object.defineProperties` этот метод можно использовать для клонирования объекта вместе с его флагами:

```
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

Обычно при клонировании объекта мы используем присваивание, чтобы скопировать его свойства:

```
for (let key in user) {
  clone[key] = user[key]
}
```

…Но это не копирует флаги. Так что если нам нужен клон «получше», предпочтительнее использовать `Object.defineProperties`.

Другое отличие в том, что `for..in` игнорирует символьные и неперечислимые свойства, а `Object.getOwnPropertyDescriptors` возвращает дескрипторы *всех* свойств.

## Глобальное запечатывание объекта

Дескрипторы свойств работают на уровне конкретных свойств. Но ещё есть методы, которые ограничивают доступ ко *всему* объекту:

**Object.preventExtensions(obj)**- Запрещает добавлять новые свойства в объект.

**Object.seal(obj) -** Запрещает добавлять/удалять свойства. Устанавливает configurable: false для всех существующих свойств.

**Object.freeze(obj) -** Запрещает добавлять/удалять/изменять свойства. Устанавливает configurable: false, writable: false для всех существующих свойств.

А также есть методы для их проверки:

**Object.isExtensible(obj) -** Возвращает false, если добавление свойств запрещено, иначе true.

**Object.isSealed(obj) -** Возвращает true, если добавление/удаление свойств запрещено и для всех существующих свойств установлено configurable: false.

**Object.isFrozen(obj) -** Возвращает true, если добавление/удаление/изменение свойств запрещено, и для всех текущих свойств установлено configurable: false, writable: false.