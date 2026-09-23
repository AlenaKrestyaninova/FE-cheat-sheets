# Типы данных

## Примитивы

Базовые неделимые типы, совпадают с рантайм-типами JS:

```typescript
let s: string = 'hello';
let n: number = 42;
let b: boolean = true;
let u: undefined = undefined;
let nul: null = null;
let big: bigint = 100n;
let sym: symbol = Symbol('id');
```

По умолчанию (без `strictNullChecks: false`) `null` и `undefined` — самостоятельные типы и не присваиваются другим типам автоматически.

---

## Специальные типы

| Тип | Значение |
|---|---|
| `any` | Отключает проверку типов полностью. Можно присвоить что угодно и чему угодно. Использовать по минимуму. |
| `unknown` | Безопасный аналог `any`. Можно присвоить что угодно, но нельзя использовать без предварительной проверки/сужения типа. |
| `void` | Функция ничего не возвращает (или возвращает `undefined`). |
| `never` | Значение, которое никогда не наступит: функция всегда кидает исключение, бесконечный цикл, либо exhaustive-проверка union'а. |

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}

let val: unknown = getData();
if (typeof val === 'string') {
  val.toUpperCase(); // ок, тип сужен до string
}
```

---

## Составные типы

**Объекты:**

```typescript
type User = {
  id: number;
  name: string;
  email?: string; // необязательное поле
  readonly createdAt: Date; // нельзя изменить после создания
};
```

**Массивы:**

```typescript
let ids: number[] = [1, 2, 3];
let names: Array<string> = ['a', 'b'];
```

**Кортежи (tuple)** — массив фиксированной длины с известными типами на каждой позиции:

```typescript
let pair: [string, number] = ['age', 30];
let withRest: [string, ...number[]] = ['scores', 1, 2, 3];
let namedTuple: [name: string, age: number] = ['Bob', 25];
```

---

## Литеральные типы

Тип, сужающий значение до конкретного литерала:

```typescript
let dir: 'left' | 'right';
dir = 'left';  // ок
dir = 'up';    // ошибка

let retryCount: 1 | 2 | 3 = 2;
```

**Template literal types** — литералы, собранные из шаблонной строки:

```typescript
type Lang = 'en' | 'ru';
type Locale = `${Lang}-US` | `${Lang}-RU`; // "en-US" | "en-RU" | "ru-US" | "ru-RU"
```

---

## Union и Intersection

**Union (`|`)** — значение одного ИЗ перечисленных типов:

```typescript
function printId(id: number | string) {
  console.log(id);
}
```

**Intersection (`&`)** — значение, объединяющее ВСЕ перечисленные типы одновременно (обычно для объектов):

```typescript
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // { name: string; age: number }
```

---

## Дженерики (Generics)

Параметризация типов — код работает с разными типами, но связь между ними сохраняется.

**Функции:**

```typescript
function identity<T>(arg: T): T {
  return arg;
}

identity<string>('hi');
identity(42); // T выводится автоматически как number
```

**Интерфейсы и типы:**

```typescript
interface Box<T> {
  value: T;
}

const box: Box<number> = { value: 10 };
```

**Классы:**

```typescript
class Container<T> {
  constructor(private item: T) {}
  get(): T {
    return this.item;
  }
}
```

**Ограничения (`extends`):**

```typescript
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
```

**Значение по умолчанию:**

```typescript
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}
```

**Несколько параметров:**

```typescript
function merge<T, U>(a: T, b: U): T & U {
  return { ...a, ...b };
}
```
