# CSS

### Основное

**Как работают кастомные свойства (CSS custom properties)?**

Кастомные свойства — переменные, объявляемые с двойного дефиса `--name: value` и используемые через `var(--name)`. Они каскадируются и наследуются как обычные свойства, что делает их мощнее препроцессорных переменных.

```
:root {
  --color-accent: #1D9E75;
  --spacing-md: 1rem;
}
.btn {
  color: var(--color-accent);
  padding: var(--spacing-md);
}
```

Ключевые отличия от SCSS-переменных: живут в DOM, меняются через JS, могут быть переопределены в любом селекторе, поддерживают fallback: `var(--x, red)`.

### Новое

**Что такое logical properties?**

Логические свойства заменяют физические направления (top/right/bottom/left) на логические (block/inline), что автоматически поддерживает RTL-языки и вертикальные режимы письма.

```
/* Физическое → логическое */
margin-left   → margin-inline-start
margin-right  → margin-inline-end
padding-top   → padding-block-start
width         → inline-size
height        → block-size
```

Практически: вместо `margin-left: 1rem` пишите `margin-inline-start: 1rem` — и всё само работает для арабского/иврита.

**Что такое aspect-ratio?**

Свойство `aspect-ratio` задаёт соотношение сторон элемента. Больше не нужен padding-trick для responsive-видео.

```
/* Раньше — хак */
.video-wrap { padding-top: 56.25%; position: relative; }

/* Теперь */
.video { aspect-ratio: 16 / 9; width: 100%; }
.avatar { aspect-ratio: 1; width: 3rem; } /* квадрат */
.card-img { aspect-ratio: 4 / 3; object-fit: cover; }
```

Поддержка: все современные браузеры. Хорошо сочетается с `object-fit` для изображений.

**Как работает backdrop-filter?**

`backdrop-filter` применяет CSS-фильтры (blur, brightness и др.) к области *за* элементом, создавая эффект матового стекла.

```
.glass-panel {
  backdrop-filter: blur(12px) brightness(0.9);
  background: rgba(255,255,255,0.2);
  border: 0.5px solid rgba(255,255,255,0.3);
}
```

Важно: родитель не должен иметь `overflow: hidden`, иначе эффект обрезается. Производительность зависит от GPU. В Safari требуется префикс `-webkit-backdrop-filter`.

**Что такое scroll-snap?**

Scroll Snap — механизм «прилипания» скролла к заданным точкам без JavaScript. Состоит из свойств контейнера и дочерних элементов.

```
/* Контейнер */
.slider {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}
/* Дочерние элементы */
.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}
```

`mandatory` — всегда докручивает до снэп-точки, `proximity` — только если близко. `scroll-snap-align`: start / center / end.

**Что такое субгрид (subgrid)?**

Субгрид позволяет дочернему грид-элементу использовать треки *родительского* грида, сохраняя выравнивание между вложенными элементами.

```
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
}
.child {
  grid-column: span 2;
  display: grid;
  /* наследует колонки родителя */
  grid-template-columns: subgrid;
}
```

Классический use-case — карточки в сетке, где заголовки и кнопки должны быть на одной высоте независимо от длины контента.

**Какие новые возможности CSS вы считаете наиболее значимыми?**

На собеседовании важно аргументировать. Несколько сильных вариантов:

**Container Queries** — элементы адаптируются к размеру контейнера, а не вьюпорта. Революция для компонентного подхода.

**:has() — «родительский селектор»** — позволяет стилизовать элемент по содержимому. `form:has(:invalid) { ... }`

**CSS Nesting** — нативная вложенность без препроцессора, как в SCSS.

 @layer — явное управление специфичностью через слои, решает проблему конфликтов в больших проектах.

**Subgrid** — решает многолетнюю проблему выравнивания вложенных элементов в сетке.

### UX/A11y

**Что такое prefers-reduced-motion?**

Медиа-запрос, отражающий системную настройку «уменьшить движение». Используйте для отключения анимаций у пользователей с вестибулярными расстройствами.

```
/* Базово — с анимацией */
.btn { transition: transform .3s ease; }
.btn:hover { transform: scale(1.05); }

/* Уважаем настройки системы */
@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
  .btn:hover { transform: none; }
}

/* Или: включаем анимацию только если ok */
@media (prefers-reduced-motion: no-preference) {
  .spinner { animation: spin 1s linear infinite; }
}
```

**Что такое prefers-color-scheme?**

Медиа-запрос, определяющий предпочтение пользователя по цветовой теме (светлая / тёмная) из системных настроек.

```
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #f0f0f0;
  }
}
@media (prefers-color-scheme: light) {
  :root {
    --bg: #fff;
    --text: #111;
  }
}
```

Значения: `light`, `dark`. Сочетается с кастомными свойствами и атрибутом `data-theme` для ручного переключения темы.

**Как реализовать тёмную тему?**

Лучшая практика — комбинация CSS custom properties \+ `prefers-color-scheme` \+ атрибут на `<html>` для ручного переключения.

```
/* 1. Переменные */
:root { --bg: #fff; --text: #111; }
@media (prefers-color-scheme: dark) {
  :root { --bg: #111; --text: #f0f0f0; }
}
/* 2. Ручное переключение */
[data-theme="dark"]  { --bg: #111; --text: #f0f0f0; }
[data-theme="light"] { --bg: #fff; --text: #111; }

/* 3. Применение */
body { background: var(--bg); color: var(--text); }
```

```
// JS: переключатель
btn.addEventListener('click', () => {
  const t = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = t;
  localStorage.setItem('theme', t);
});
```