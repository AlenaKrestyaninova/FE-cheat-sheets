# Resource Loading: управление загрузкой ресурсов

### async и defer (для \<script\>)

**Обычная загрузка скрипта**
\<script src="script.js"\>\</script\>
* HTML парсинг останавливается
* Скрипт загружается и выполняется
* Только потом парсинг продолжается

**async**
\<script async src="script.js"\>\</script\>
* Скрипт загружается параллельно с парсингом HTML
* Как только загрузился — сразу выполняется (прерывая парсинг)
* Порядок выполнения не гарантирован
* Подходит для независимых скриптов (аналитика, реклама)

**defer**
\<script defer src="script.js"\>\</script\>
* Скрипт загружается параллельно с парсингом
* Выполняется только после полного парсинга HTML
* Порядок выполнения сохраняется
* Идеален для скриптов, которые работают с DOM


### preload (для любых ресурсов)

```javascript
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-image.jpg" as="image">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

**Особенности:**

* Высокий приоритет загрузки

* Ресурс загружается немедленно, но не применяется

* Обязательно указывать атрибут `as`

* Для критически важных ресурсов "above the fold"

* Браузер выдаст warning, если ресурс не использован в течение 3 секунд

**Применение:** критические CSS, шрифты, hero-изображения, важные скрипты

### prefetch (для будущих навигаций)

```
<link rel="prefetch" href="next-page.html">
<link rel="prefetch" href="dashboard.js">
<link rel="prefetch" href="user-avatar.jpg">
```

**Особенности:**

* Низкий приоритет загрузки

* Загружается когда браузер не занят

* Кэшируется для будущего использования

* Может не загрузиться, если сеть медленная

* Не блокирует текущую страницу

**Применение:** ресурсы следующих страниц, вероятные пользовательские действия

### modulepreload (для ES модулей)

```
<link rel="modulepreload" href="main.js">
<link rel="modulepreload" href="utils.js">
```

**Особенности:**

* Специально для ES6 модулей

* Предзагружает модуль и все его зависимости

* Высокий приоритет как у preload

* Модули парсятся, но не выполняются

* Работает с `import()` и `<script type="module">`

## Приоритеты загрузки

**Высокий приоритет:**

* preload

* modulepreload

* критические CSS и скрипты

**Средний приоритет:**

* обычные скрипты и стили

* изображения в viewport

**Низкий приоритет:**

* prefetch

* изображения вне viewport

* async скрипты

## Практические советы

**Оптимальная стратегия:**

```javascript
<!-- Критические ресурсы -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="main.js" as="script">

<!-- Основные стили и скрипты -->
<link rel="stylesheet" href="critical.css">
<script defer src="main.js"></script>

<!-- Будущие ресурсы -->
<link rel="prefetch" href="profile-page.css">
<link rel="prefetch" href="dashboard.js">

<!-- Независимые скрипты -->
<script async src="analytics.js"></script>
```