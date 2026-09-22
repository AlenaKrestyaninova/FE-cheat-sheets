# Unit-тесты

Unit-тест проверяет **одну изолированную единицу кода** (функцию, метод, компонент) независимо от остальной системы. Все внешние зависимости (API, база данных, другие модули) заменяются моками.

**Цель:** убедиться, что конкретная функция делает то, что должна.

**Инструменты (обычно нужны 1-2):**

* **Jest** — самый популярный фреймворк для JS/React

* **Vitest** — современная альтернатива, быстрее Jest

* **Testing Library** (React Testing Library, Vue Testing Library) — для тестирования компонентов

## Анатомия unit-теста

```javascript showLineNumbers
// Функция которую тестируем
function calculateDiscount(price, discountPercent) {
  if (price < 0) throw new Error('Price cannot be negative');
  return price - (price * discountPercent / 100);
}

// Тесты
describe('calculateDiscount', () => {
  test('применяет скидку 10% к цене 1000', () => {
    // Arrange
    const price = 1000;
    const discount = 10;
    
    // Act
    const result = calculateDiscount(price, discount);
    
    // Assert
    expect(result).toBe(900);
  });

  test('применяет скидку 0% к цене 1000', () => {
    expect(calculateDiscount(1000, 0)).toBe(1000);
  });

  test('выбрасывает ошибку при отрицательной цене', () => {
    expect(() => calculateDiscount(-100, 10)).toThrow('Price cannot be negative');
  });
});
```

**Разбор:**

* `describe()` — группирует связанные тесты

* `test()` или `it()` — отдельный тест-кейс

* `expect()` — утверждение (assertion)

* `toBe()`, `toThrow()` — матчеры (проверки)

* Понятия: test suite, test case, assertion

## Основные матчеры (Jest)

```javascript showLineNumbers
// Равенство
expect(2 + 2).toBe(4);                    // строгое равенство (===)
expect({ name: 'John' }).toEqual({ name: 'John' }); // глубокое сравнение объектов

// Truthiness
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(true).toBeTruthy();
expect(0).toBeFalsy();

// Числа
expect(10).toBeGreaterThan(5);
expect(10).toBeLessThanOrEqual(10);
expect(0.1 + 0.2).toBeCloseTo(0.3);      // для float

// Строки
expect('hello world').toMatch(/world/);
expect('test').toContain('es');

// Массивы
expect(['apple', 'banana']).toContain('apple');
expect([1, 2, 3]).toHaveLength(3);

// Исключения
expect(() => someFunction()).toThrow();
expect(() => someFunction()).toThrow(Error);
```

## Тестирование асинхронного кода

**Promises:**

```javascript showLineNumbers
test('загружает данные пользователя', () => {
  return fetchUser(1).then(user => {
    expect(user.name).toBe('John');
  });
});

// или с async/await (проще)
test('загружает данные пользователя', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('John');
});
```

**С обработкой ошибок:**

```javascript showLineNumbers
test('выбрасывает ошибку при неверном ID', async () => {
  await expect(fetchUser(-1)).rejects.toThrow('Invalid ID');
});
```

## Моки (Mocking)

Моки заменяют реальные зависимости, чтобы тестировать код изолированно.

**Мокирование функций:**

```javascript showLineNumbers
// Создаём мок-функцию
const mockCallback = jest.fn(x => x + 1);

// Используем
[1, 2, 3].forEach(mockCallback);

// Проверяем вызовы
expect(mockCallback).toHaveBeenCalledTimes(3);
expect(mockCallback).toHaveBeenCalledWith(1);
expect(mockCallback).toHaveBeenLastCalledWith(3);
```

**Мокирование модулей:**

```javascript showLineNumbers
// api.js
export const fetchUsers = () => fetch('/api/users');

// users.test.js
import { fetchUsers } from './api';

jest.mock('./api');

test('получает список пользователей', async () => {
  // Настраиваем что вернёт мок
  fetchUsers.mockResolvedValue([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
  
  const users = await fetchUsers();
  expect(users).toHaveLength(2);
});
```

**Частичное мокирование:**

```javascript showLineNumbers
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'), // оставляем реальные функции
  generateId: jest.fn(() => 'mock-id') // только эту мокаем
}));
```

## Тестирование React компонентов

**Простой компонент:**

```javascript showLineNumbers
// Button.jsx
export function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

// Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('рендерит текст кнопки', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('вызывает onClick при клике', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Компонент с состоянием:**

```javascript showLineNumbers
// Counter.jsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Counter.test.jsx
test('увеличивает счетчик при клике', () => {
  render(<Counter />);
  
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**Компонент с API запросом:**

```javascript showLineNumbers
// UserProfile.jsx
import { useEffect, useState } from 'react';
import { fetchUser } from './api';

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(data => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}

// UserProfile.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import { fetchUser } from './api';

jest.mock('./api');

test('отображает имя пользователя после загрузки', async () => {
  fetchUser.mockResolvedValue({ id: 1, name: 'Alice' });
  
  render(<UserProfile userId={1} />);
  
  // Сначала показывается Loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Ждём появления имени
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
```

## Setup и Teardown

Код который выполняется до/после тестов:

```javascript showLineNumbers
describe('Database tests', () => {
  let db;
  
  // Перед ВСЕМИ тестами в describe
  beforeAll(() => {
    db = new Database();
  });
  
  // Перед КАЖДЫМ тестом
  beforeEach(() => {
    db.clear();
  });
  
  // После КАЖДОГО теста
  afterEach(() => {
    // Очистка
  });
  
  // После ВСЕХ тестов
  afterAll(() => {
    db.close();
  });
  
  test('test 1', () => {
    // ...
  });
});
```

## Snapshots (снимки)

Сохраняют вывод компонента и сравнивают при следующих запусках:

```javascript showLineNumbers
test('рендерит корректно', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container).toMatchSnapshot();
});
```

**Когда использовать:**

* Статичные UI компоненты

* Вывод сложных функций (например, парсеры)

**Когда НЕ использовать:**

* Динамический контент (даты, ID)

* Как замену нормальным assertions