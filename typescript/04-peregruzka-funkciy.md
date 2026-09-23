# Перегрузка функций (Function Overloading)

Позволяет описать несколько сигнатур для одной функции — TS выбирает подходящую по типам аргументов при вызове и точно типизирует результат.

## Базовый синтаксис

Пишется несколько «сигнатур перегрузки» без тела, а затем одна «сигнатура реализации» с телом — она не видна снаружи и должна покрывать все варианты:

```typescript
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: any, b: any): any {
  return a + b;
}

combine('a', 'b'); // string
combine(1, 2);     // number
combine('a', 1);   // ошибка — нет подходящей перегрузки
```

Сигнатура реализации сама по себе не участвует в проверке снаружи — важны только объявленные перегрузки, поэтому она обычно широкая (`any`/union), а тело вручную разбирает варианты.

---

## Перегрузка с разным количеством аргументов

```typescript
function createDate(timestamp: number): Date;
function createDate(year: number, month: number, day: number): Date;
function createDate(a: number, month?: number, day?: number): Date {
  return month !== undefined
    ? new Date(a, month, day ?? 1)
    : new Date(a);
}
```

---

## Перегрузка методов класса

```typescript
class Formatter {
  format(value: number): string;
  format(value: Date): string;
  format(value: number | Date): string {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value.toISOString();
  }
}
```

---

## Порядок сигнатур важен

TS проверяет сигнатуры сверху вниз и использует первую подходящую — более специфичные варианты должны идти раньше более общих:

```typescript
function pick(x: 1): 'one';
function pick(x: number): 'number'; // общий случай — ниже
function pick(x: number): string {
  return x === 1 ? 'one' : 'number';
}
```

---

## Альтернатива: перегрузка через union и дженерики

Часто то же самое можно выразить одной сигнатурой без overload — с union-типом аргумента или дженериком, что проще поддерживать:

```typescript
// вместо перегрузки:
function wrap<T>(value: T): T[] {
  return [value];
}
```

Перегрузки стоит использовать, когда связь между входными и выходными типами нелинейная и её нельзя выразить обычным union/generic — как в примерах выше.
