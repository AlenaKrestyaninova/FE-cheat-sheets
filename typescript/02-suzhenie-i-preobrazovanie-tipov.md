# Сужение и приведение типов

## Сужение типов (Narrowing)

TypeScript умеет автоматически сужать union-тип до более конкретного внутри условных блоков.

**`typeof`-guard** — для примитивов:

```typescript
function process(val: string | number) {
  if (typeof val === 'string') {
    val.toUpperCase(); // val: string
  } else {
    val.toFixed(2); // val: number
  }
}
```

**`instanceof`-guard** — для классов:

```typescript
class Dog { bark() {} }
class Cat { meow() {} }

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

**`in`-guard** — проверка наличия свойства:

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

**Дискриминирующее объединение (discriminated union)** — общее поле-тег для разбора вариантов:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
  }
}
```

**Пользовательский type guard** (предикат-функция):

```typescript
function isString(val: unknown): val is string {
  return typeof val === 'string';
}

function handle(val: unknown) {
  if (isString(val)) {
    val.trim(); // val: string
  }
}
```

**Сужение через равенство / truthy-проверку:**

```typescript
function greet(name: string | null) {
  if (name) {
    name.toUpperCase(); // name: string
  }
}
```

---

## Преобразование к типу (Type Assertion)

Способ сказать компилятору «я знаю тип лучше тебя» — **не меняет значение в рантайме**, только влияет на проверку типов при компиляции.

**Синтаксис `as`** (основной, работает и в `.tsx`):

```typescript
const input = document.getElementById('name') as HTMLInputElement;
input.value = 'test';
```

**Угловые скобки** (не работает в `.tsx`, применяется реже):

```typescript
const input = <HTMLInputElement>document.getElementById('name');
```

**Non-null assertion (`!`)** — убирает `null | undefined` из типа:

```typescript
function getEl(id: string) {
  return document.getElementById(id)!; // "я уверен, что элемент есть"
}
```

**`as const`** — делает значение максимально литеральным и `readonly`:

```typescript
const point = { x: 1, y: 2 } as const; // { readonly x: 1; readonly y: 2 }
const dirs = ['up', 'down'] as const;  // readonly ["up", "down"]
```

**Двойное приведение** (`as unknown as X`) — когда типы совсем не пересекаются; использовать осторожно, это отключает проверку:

```typescript
const value = ('42' as unknown) as number;
```

---

## `typeof` как оператор типов

В отличие от рантайм-`typeof` (используется для сужения выше), в позиции типа `typeof` берёт тип уже существующей переменной/значения:

```typescript
const config = {
  env: 'production',
  debug: false,
};

type Config = typeof config; // { env: string; debug: boolean }

function setup(cfg: typeof config) { /* ... */ }
```

Полезно, чтобы не дублировать вручную описанный тип, если значение уже существует в коде.

---

## Asserts (assertion functions)

Функции, которые не сужают тип сами по себе (как type guard), а **кидают исключение**, если условие не выполнено — TS после вызова считает, что дальше по коду тип уже сужен.

**`asserts x is T`:**

```typescript
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') {
    throw new Error('Not a string!');
  }
}

function run(val: unknown) {
  assertIsString(val);
  val.toUpperCase(); // val: string, TS доверяет утверждению
}
```

**`asserts x`** (без указания типа — просто утверждает истинность условия):

```typescript
function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

function process(val: string | null) {
  assert(val !== null, 'val is null');
  val.trim(); // val: string
}
```
