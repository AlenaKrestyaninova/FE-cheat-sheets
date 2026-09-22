# Задачи

## 1
Представь, что у тебя есть `ThemeContext`, который хранит `{ theme: 'dark', toggleTheme: () => {...} }`, и этот объект передаётся в `<ThemeContext.Provider value={{ theme, toggleTheme }}>`. Компонент `Provider` оборачивает весь App.

Проблема: даже если `theme` не меняется, **любой** ре-рендер родительского компонента (где лежит Provider) заставляет **все** дочерние компоненты, использующие `useContext(ThemeContext)`, ре-рендериться. Почему это происходит, даже если сам `theme` не поменял значение? И как это исправить?

Ответ:
Каждый раз, когда родительский компонент (где лежит `Provider`) ре-рендерится **по любой причине** (даже вообще не связанной с темой), в JSX **заново выполняется** выражение `{{ theme, toggleTheme }}` — это создаёт **новый объект** в памяти (новый литерал `{}`), даже если `theme` внутри него содержит то же самое строковое значение `'dark'`. React сравнивает `value` у Context **по ссылке** (`Object.is`), а не по глубокому содержимому — новый объект `!== `старый объект, даже если поля внутри идентичны. Именно поэтому **все** компоненты, подписанные через `useContext(ThemeContext)`, ре-рендерятся — Context видит "новое" значение просто потому, что это новый объект-обёртка.

```javascript
function App() {
  const [theme, setTheme] = useState('dark');
// использовали useCallback, чтобы замемоизировать функцию переключения темы
  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

// использовали useMemo, чтобы мемоизировать сам объект value, который передаётся в Provider
// Теперь новый объект value создаётся только тогда, когда реально изменился theme (или toggleTheme, но он стабилен благодаря useCallback). 
// Если родитель App ре-рендерится по другой причине (никак не связанной с темой) — useMemo вернёт тот же самый объект по ссылке, 
// Context увидит "то же самое значение", и никто из подписчиков не перерендерится зря.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <Rest />
    </ThemeContext.Provider>
  );
}
```

## 2 Исправить реактовский компонент
```javascript
import React from "react"; // Хуки можно импортировать точечно
 
const PleaseReviewMe = () => {
  const [count, setCount] = React.useState(1);
  const [items, setItems] = React.useState([{ id: 1 }]);
  
// useLayoutEffect здесь не нужен, Для подписки на события достаточно обычного useEffect. 
  React.useLayoutEffect(() => {
    document.addEventListener("click", () => {
      setInterval(() => console.log(count), 1000); // В setInterval всегда логируется старое значение count.
    });
  });  // useLayoutEffect без зависимостей. Эффект выполняется на каждый рендер → бесконечное добавление слушателей
// Нет cleanup
// addEventListener никогда не снимается → утечка памяти.
// Каждый клик по документу создаёт новый setInterval, который никогда не очищается.
 
  const click = React.useCallback(() => { // стоит назвать handleClick
    setCount(count + 1); // Нужно передать коллбек с предыдущим значением setCount((prev) => prev + 1);
    setItems([...items, { id: count + 1 }]); // setItems((prev) => [...prev, { id: prev.length + 1 }]);
  } ); // useCallback без массива зависимостей + прямое использование count/items → устаревшие значения.
 
  return (
    <React.Fragment> // можно заменить на <></>
      <ul>
        {items.map((item) => (
          <li>{item.id}</li> // Отсутствует key
        ))}
      </ul>
      <button onClick={() => click()}>add one</button> // можно убрать лишнюю обертку onClick={handleClick}
    </React.Fragment>
  );
};
export default PleaseReviewMe;
```
