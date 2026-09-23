# Продвинутые типы

## keyof

Возвращает union из имён (ключей) свойств объекта/типа как строковых литералов.

```typescript
type User = { id: number; name: string; email: string };
type UserKeys = keyof User; // "id" | "name" | "email"

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: 'Bob', email: 'a@b.com' };
getProp(user, 'name'); // ок, тип string
getProp(user, 'age');  // ошибка — "age" не ключ User
```

`T[K]` (indexed access type) — тип значения по ключу `K` в типе `T`.

---

## Mapped Types

Создание нового типа перебором ключей существующего: `[K in keyof T]`.

```typescript
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type ReadonlyVersion<T> = {
  readonly [K in keyof T]: T[K];
};
```

**Модификаторы `+`/`-`** — добавить или снять `readonly`/`?`:

```typescript
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type Required2<T> = {
  [K in keyof T]-?: T[K];
};
```

**Ремаппинг ключей (`as`)** — переименование ключей в процессе маппинга:

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type User = { name: string; age: number };
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

---

## Utility Types

Встроенные generic-хелперы для трансформации типов.

| Утилита | Что делает |
|---|---|
| `Partial<T>` | все поля становятся необязательными |
| `Required<T>` | все поля становятся обязательными |
| `Readonly<T>` | все поля становятся `readonly` |
| `Record<K, V>` | объект с ключами `K` и значениями типа `V` |
| `Pick<T, K>` | оставить только поля `K` из `T` |
| `Omit<T, K>` | убрать поля `K` из `T` |
| `Exclude<T, U>` | убрать из union `T` варианты, входящие в `U` |
| `Extract<T, U>` | оставить в union `T` только варианты, входящие в `U` |
| `NonNullable<T>` | убрать `null`/`undefined` из типа |
| `ReturnType<F>` | тип возвращаемого значения функции `F` |
| `Parameters<F>` | кортеж типов параметров функции `F` |
| `Awaited<T>` | тип «размотанного» промиса |

```typescript
type User = { id: number; name: string; email: string };

type PartialUser = Partial<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UserWithoutEmail = Omit<User, 'email'>;
type UsersById = Record<number, User>;

function getUser() { return { id: 1, name: 'Bob' }; }
type UserResult = ReturnType<typeof getUser>;

type Status = 'idle' | 'loading' | 'error' | 'success';
type ErrorStatus = Extract<Status, 'error' | 'idle'>; // "error" | "idle"
type NonErrorStatus = Exclude<Status, 'error'>;       // "idle" | "loading" | "success"
```

---

## Условные типы (Conditional Types)

Выбор типа в зависимости от того, удовлетворяет ли один тип другому: `T extends U ? X : Y`.

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hi'>;  // true
type B = IsString<42>;    // false
```

**`infer`** — извлечение части типа внутри условия:

```typescript
type ElementType<T> = T extends (infer U)[] ? U : T;

type A = ElementType<string[]>; // string
type B = ElementType<number>;   // number (не массив — тип остаётся как есть)

type ReturnOf<F> = F extends (...args: any[]) => infer R ? R : never;
```

**Распределительные условные типы (distributive)** — если `T` union, условие применяется к каждому члену по отдельности:

```typescript
type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>; // string[] | number[]
```

**Цепочки условий:**

```typescript
type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  'object';
```
