# Геттеры и сеттеры, их дескрипторы

Есть два типа свойств объекта.

- *свойства-данные (data properties)*. Все свойства, которые мы использовали до текущего момента, были свойствами-данными.
- *свойства-аксессоры (accessor properties)*. По своей сути это функции, которые используются для присвоения и получения значения, но во внешнем коде они выглядят как обычные свойства объекта.

```javascript
let user = {
  name: "John",
  surname: "Smith",

  get fullName() {
    return `${this.name} ${this.surname}`; // Нельзя вызвать и перезаписать, можно только прочесть 
  },

  set fullName(value) { // Можно прочитать и изменить 
    [this.name, this.surname] = value.split(" ");
  }
};

// set fullName запустится с данным значением
user.fullName = "Alice Cooper";

alert(user.name); // Alice
alert(user.surname); // Cooper
```

## Дескрипторы свойств доступа

Дескрипторы свойств-аксессоров отличаются от «обычных» свойств-данных.

Свойства-аксессоры не имеют `value` и `writable`, но взамен предлагают функции `get` и `set`.

То есть, дескриптор аксессора может иметь:

* **`get`** – функция без аргументов, которая сработает при чтении свойства,

* **`set`** – функция, принимающая один аргумент, вызываемая при присвоении свойства,

* **`enumerable`** – то же самое, что и для свойств-данных,

* **`configurable`** – то же самое, что и для свойств-данных.

Например, для создания аксессора `fullName` при помощи `defineProperty` мы можем передать дескриптор с использованием `get` и `set`:

```javascript
let user = {
  name: "John",
  surname: "Smith"
};

Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.name} ${this.surname}`;
  },

  set(value) {
    [this.name, this.surname] = value.split(" ");
  }
});

alert(user.fullName); // John Smith

for(let key in user) alert(key); // name, surname
```

Ещё раз заметим, что свойство объекта может быть либо свойством-аксессором (с методами `get/set`), либо свойством-данным (со значением `value`).