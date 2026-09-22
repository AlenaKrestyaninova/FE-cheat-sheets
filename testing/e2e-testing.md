# E2E тестирование

E2E (End-to-End) — это тестирование **всего приложения целиком**, как его использует реальный пользователь. Открывается настоящий браузер, кликаешь кнопки, заполняешь формы, проверяешь результат.

**Пример сценария:**

1. Открыть сайт магазина

2. Найти товар через поиск

3. Добавить в корзину

4. Оформить заказ

5. Проверить, что появилось сообщение "Заказ оформлен"

#### Отличия от unit-тестов

#|
||

Unit-тесты

|

E2E-тесты

||
||

Одна функция

|

Весь флоу

||
||

Моки API/БД

|

Реальное API/БД (или staging)

||
||

Миллисекунды

|

Секунды/минуты

||
||

Много тестов

|

Мало тестов (только критичное)

||
||

Легко отладить

|

Сложно найти баг

||
|#

## Основные инструменты

**Cypress** (самый популярный):

```javascript showLineNumbers
describe('Логин', () => {
  it('авторизует пользователя', () => {
    cy.visit('https://example.com/login'); // Навигация
	// Поиск элементов
	cy.get('.product-card');           // по CSS
	cy.contains('Add to Cart');        // по тексту
	cy.get('[data-test="buy-btn"]');   // по атрибуту (лучше!)
	// Действия
    cy.get('[data-test="email"]').type('user@test.com'); // ввод текста
    cy.get('[data-test="password"]').type('password123');
    cy.get('button[type="submit"]').click(); // клик
	cy.get('select').select('Option 1'); // выбор из select
	cy.get('input[type="file"]').selectFile('image.png'); // загрузка файла
    // Проверки (assertions)
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, User').should('be.visible');
  });
});
```

**Playwright** (от Microsoft):

```javascript showLineNumbers
test('авторизует пользователя', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('[data-test="email"]', 'user@test.com');
  await page.fill('[data-test="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('text=Welcome, User')).toBeVisible();
});
```

### Ожидания (Waiting)

E2E-тесты работают с реальным приложением → нужно ждать загрузки.

**Cypress автоматически ждёт:**

```javascript showLineNumbers
// Автоматические ожидания
cy.get('.button').click();  // ждёт пока кнопка появится
cy.contains('Success');     // ждёт пока текст появится

// Явные ожидания:
// Ждать конкретный элемент
cy.get('.loading', { timeout: 10000 }).should('not.exist');
// Ждать условие
cy.get('.counter').should('have.text', '5');
```

### Работа с API

Можно перехватывать и мокировать запросы:

```javascript showLineNumbers
// Cypress
cy.intercept('GET', '/api/users', {
  statusCode: 200,
  body: [{ id: 1, name: 'Test User' }]
}).as('getUsers');

cy.visit('/users');
cy.wait('@getUsers');
cy.contains('Test User').should('be.visible');
```

**Зачем:**

* Стабильность тестов (не зависят от реального API)

* Скорость (не ждём настоящие запросы)

* Тестирование edge cases (ошибки, пустые данные)

## Когда писать E2E тесты

**Пиши E2E когда:**

* Критичный бизнес-сценарий (оплата, регистрация)

* Сложный флоу из нескольких шагов

* Интеграция между фронтом и бэкендом важна

**НЕ пиши E2E когда:**

* Можно покрыть unit-тестом

* Некритичная фича

* Слишком часто меняется UI