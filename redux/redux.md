# Redux

Redux — это **предсказуемый контейнер состояния**. Всё состояние приложения хранится в одном объекте — **store**. Изменить его можно только через **actions**, которые обрабатываются **reducers**.

#### Три принципа

1. **Single source of truth** — один store на всё приложение

2. **State is read-only** — нельзя мутировать напрямую, только через action

3. **Changes via pure functions** — reducer это чистая функция `(state, action) => newState`

#### Почему Redux, а не useContext?

* **Проблема ре-рендеров.** **useContext** **ре-рендерит абсолютно всех потребителей** (`useContext`). Redux позволяет подписаться **точечно** на нужный кусочек стейта, и компонент ре-рендерится **только** если именно эта часть стейта изменилась.
* **Инструментарий и предсказуемость.** Redux даёт devtools (time-travel debugging, просмотр всех экшенов в истории), middleware (для асинхронщины — thunk/saga), строгие правила изменения стейта (только через экшены и редьюсеры), что делает поток данных predictable и легко тестируемым/отлаживаемым в больших приложениях. Context — это просто "труба" для передачи данных, без всей этой инфраструктуры.
* **Комбинирование нескольких контекстов** тоже создаёт "wrapper hell" (много вложенных Provider), тогда как в Redux один store на всё приложение.

#### Action

Это просто **описание того, что произошло**. Обычный JS-объект, обязательно с полем `type`:

```javascript
// Минимальный action
{ type: 'INCREMENT' }

// С данными
{ type: 'ADD_USER', payload: { name: 'Anna', age: 25 } }
```

`type` — строка, описывающая событие. `payload` — не обязательное поле, просто конвенция для передачи данных.

**Action creator** — функция, чтобы не писать объект вручную каждый раз:

```javascript
const addUser = (user) => ({
  type: 'ADD_USER',
  payload: user
})

// Использование
dispatch(addUser({ name: 'Anna', age: 25 }))
```

> Аналогия: action — это как **заказ в кафе**. Ты говоришь *что* хочешь, но не лезешь на кухню сам.

#### Reducer

Это **чистая функция**, которая принимает текущий стейт и action, и возвращает **новый стейт**:

```javascript
function usersReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_USER':
      return [...state, action.payload] // новый массив!
    
    case 'REMOVE_USER':
      return state.filter(user => user.id !== action.payload)
    
    default:
      return state // обязательно!
  }
}
```

Два важных правила:

**1. Никакой мутации** — всегда возвращай новый объект/массив:

```javascript
// ❌ Неправильно
case 'ADD_USER':
  state.push(action.payload)
  return state

// ✅ Правильно
case 'ADD_USER':
  return [...state, action.payload]
```

**2. default всегда возвращает state** — иначе при любом незнакомом action стейт станет `undefined`

Когда стейт большой, его делят на части через `combineReducers`:

```javascript
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  ui: uiReducer
})
// Итоговый стейт: { users: [...], posts: [...], ui: {...} }
```

> Аналогия: reducer — это **кухня**. Получает заказ, берёт текущие ингредиенты и готовит новое блюдо, не меняя оригинальные продукты.

#### Store

Это **центральный объект**, который всё склеивает. Создаётся один раз:

```javascript
import { createStore } from 'redux'

const store = createStore(rootReducer)
```

У него три метода — и это буквально всё API:

```javascript
// Получить текущий стейт
store.getState()

// Отправить action
store.dispatch({ type: 'INCREMENT' })

// Подписаться на изменения
const unsubscribe = store.subscribe(() => {
  console.log('стейт изменился:', store.getState())
})
unsubscribe() // отписаться
```

В React-приложении store подключается через `<Provider>` — после этого любой компонент может достучаться до стейта через `useSelector` и отправить action через `useDispatch`. Это уже react-redux, не сам Redux.

#### Как всё работает вместе

```
Пользователь нажал кнопку
        ↓
dispatch(addUser({ name: 'Anna' }))
        ↓
Redux передаёт action в reducer
        ↓
reducer(currentState, action) → newState
        ↓
Store сохраняет newState
        ↓
Компоненты, подписанные на этот кусок стейта, перерисовываются
```

### Middleware и Thunk

#### Проблема

Redux по умолчанию **синхронный**. `dispatch` принимает только объект. Но в реальном приложении нужно делать запросы к API, работать с `setTimeout` и т.д. Вот тут и нужен middleware.

#### Middleware

Middleware — это **прослойка между dispatch и reducer**. Перехватывает каждый action до того, как он дойдёт до reducer.

Выглядит страшно, но идея простая:

```javascript
const myMiddleware = (store) => (next) => (action) => {
  // сюда попадает каждый action
  console.log('action:', action)
  next(action) // передать дальше в reducer
  console.log('стейт после:', store.getState())
}
```

Три стрелки — это просто каррирование. Redux передаёт аргументы по одному:

* `store` — доступ к getState и dispatch

* `next` — функция передать action дальше

* `action` — сам action

Подключается при создании store:

```javascript
import { createStore, applyMiddleware } from 'redux'

const store = createStore(rootReducer, applyMiddleware(myMiddleware))
```

> Аналогия: middleware — это **таможня**. Каждый action "проходит досмотр" прежде чем попасть к reducer.

#### Redux Thunk

Самый популярный middleware. Делает одну вещь — **позволяет dispatch-ить функции** вместо объектов:

```javascript
// Thunk под капотом — буквально 10 строк:
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState) // вызывает функцию
  }
  return next(action) // объект — передаёт дальше как обычно
}
```

Вот и весь секрет. Если action — функция, thunk её вызывает и передаёт `dispatch` и `getState`. Если объект — пропускает дальше.

#### Как это выглядит на практике

```javascript
// Это и есть "thunk" — функция, которую возвращает action creator
const fetchUser = (id) => async (dispatch, getState) => {
  
  // можно смотреть текущий стейт
  const currentUser = getState().user
  
  dispatch({ type: 'FETCH_USER_START' })
  
  try {
    const user = await api.getUser(id)
    dispatch({ type: 'FETCH_USER_SUCCESS', payload: user })
  } catch (error) {
    dispatch({ type: 'FETCH_USER_ERROR', payload: error.message })
  }
}

// Использование — выглядит как обычный dispatch
dispatch(fetchUser(42))
```

Reducer при этом остаётся простым и синхронным:

```javascript
function userReducer(state = {}, action) {
  switch (action.type) {
    case 'FETCH_USER_START':
      return { ...state, loading: true }
    case 'FETCH_USER_SUCCESS':
      return { ...state, loading: false, data: action.payload }
    case 'FETCH_USER_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
```

#### Порядок прохождения action

```
dispatch(fetchUser(42))
        ↓
Thunk видит функцию → вызывает её
        ↓
Внутри fetchUser вызывается dispatch({ type: 'FETCH_USER_START' })
        ↓
Thunk видит объект → пропускает дальше
        ↓
Reducer обрабатывает action
        ↓
Стейт обновился
```