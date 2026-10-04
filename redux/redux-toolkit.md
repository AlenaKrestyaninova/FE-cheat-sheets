# Redux Toolkit

## 1\. Что такое RTK и зачем он нужен

**Redux Toolkit** — официальный, рекомендованный способ писать логику Redux. Решает проблемы "классического" Redux:

* Слишком много boilerplate-кода (action types, action creators, switch-case в редьюсерах).

* Легко забыть про иммутабельность (мутировать state напрямую).

* Нужно было ставить кучу отдельных пакетов (redux, redux-thunk, reselect, immer).

* Сложная настройка store (middleware, devtools).

RTK включает в себя: `configureStore`, `createSlice`, `createReducer`, `createAction`, `createAsyncThunk`, `createEntityAdapter`, `createSelector` (через reselect), RTK Query.

---

## 2\. configureStore

Обёртка над `createStore`, которая:

* Автоматически подключает Redux DevTools.

* Автоматически добавляет `redux-thunk` в middleware по умолчанию.

* Добавляет middleware для проверки иммутабельности и сериализуемости state (в dev-режиме).

* Позволяет комбинировать редьюсеры через объект `reducer`.

```javascript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
  middleware: (getDefault) => getDefault().concat(myMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});
```

---

## 3\. createSlice — главный инструмент

Объединяет в себе создание action creators \+ reducer для одного "куска" state.

```javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // выглядит как мутация, но это НЕ мутация (см. Immer)
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

**Что получаем автоматически:**

* `slice.actions.increment` — action creator, тип действия будет `"counter/increment"`.

* `slice.reducer` — готовый reducer.

* `slice.caseReducers` — доступ к "чистым" функциям редьюсеров (для тестов).

---

## 4\. Immer: почему можно "мутировать" state

Внутри `createSlice`/`createReducer` используется библиотека **Immer**. Она позволяет писать код, который выглядит как мутация, но на самом деле:

1. Immer оборачивает state в Proxy.

2. Отслеживает, какие поля были изменены.

3. На основе изменений создаёт новый иммутабельный объект state.

⚠️ Важно: это работает **только внутри reducers, описанных в createSlice/createReducer**. Если попытаться мутировать state вне этого контекста — будет ошибка или баг.

Можно и вернуть новый объект явно (`return newState`), но **нельзя одновременно и мутировать, и возвращать новое значение** — Immer выбросит ошибку.

---

## 5\. extraReducers / builder notation

Нужны, чтобы slice реагировал на действия, созданные **вне этого slice** (например, из `createAsyncThunk` или из другого slice).

```javascript
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: { /* ... */ },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});
```

Начиная с RTK 1.6\+ рекомендуют **builder callback notation** (как выше) вместо map-объекта — он типобезопаснее.

---

## 6\. createAsyncThunk

Стандартный способ работать с асинхронной логикой (запросы к API).

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, thunkAPI) => {
    const response = await api.getUser(userId);
    return response.data; // становится payload в fulfilled
  }
);
```

Автоматически создаёт **3 action types**:

* `user/fetchUser/pending`

* `user/fetchUser/fulfilled`

* `user/fetchUser/rejected`

`thunkAPI` содержит: `dispatch`, `getState`, `rejectWithValue`, `signal` (для отмены запроса через AbortController), `extra`.

Для кастомной обработки ошибок используют `rejectWithValue(error)` — тогда `action.payload` в `rejected` будет содержать эту ошибку, а не `action.error`.

---

## 7\. createAction / createReducer (низкоуровневые API)

Используются реже (внутри `createSlice` уже есть всё нужное), но могут спросить на собеседовании:

```javascript
const increment = createAction('counter/increment');

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(increment, (state) => { state.value++ });
});
```

---

## 8\. createSelector (реэкспорт из Reselect)

Мемоизированные селекторы — пересчитывают результат только если изменились входные данные.

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectItems = (state) => state.cart.items;

const selectTotal = createSelector(
  [selectItems],
  (items) => items.reduce((sum, i) => sum + i.price, 0)
);
```

Зачем нужен: избегаем лишних вычислений и лишних ре-рендеров компонентов (особенно с `useSelector`, который сравнивает по ссылке).

---

## 9\. createEntityAdapter

Готовое решение для хранения нормализованных данных (списков сущностей по id).

```javascript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter();

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    userAdded: usersAdapter.addOne,
    usersReceived: usersAdapter.setAll,
  },
});
```

State хранится в форме:

```javascript
{ ids: [1, 2, 3], entities: { 1: {...}, 2: {...}, 3: {...} } }
```

Даёт готовые CRUD-методы: `addOne`, `addMany`, `updateOne`, `removeOne`, `setAll`, `upsertOne` и т.д., а также селекторы `getSelectors()`.

---

## 10\. RTK Query

Встроенный инструмент для **загрузки и кеширования данных** (замена связке thunk \+ axios \+ свой слайс для кеша).

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    addPost: builder.mutation({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = api;
```

Подключение в store:

```javascript
configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (gDM) => gDM().concat(api.middleware),
});
```

**Ключевые фичи RTK Query:**

* Автоматическое кеширование по ключу запроса.

* Автоматический рефетч по `tags` (invalidatesTags / providesTags).

* Хуки: `useXQuery` (запросы), `useXMutation` (мутации).

* Дедупликация одинаковых запросов.

* Polling, `refetchOnFocus`, `refetchOnReconnect`.

* Отслеживание статусов: `isLoading`, `isFetching`, `isSuccess`, `isError`.

---

## 11\. Частые вопросы на собеседовании

**Q: Чем createSlice лучше обычного switch-case reducer?** A: Меньше кода, автоматическая генерация action types и creators, встроенный Immer для "мутабельного" синтаксиса без реальных мутаций.

**Q: Как RTK решает проблему иммутабельности?** A: Через Immer — Proxy-обёртка над state, автоматически создающая новый объект на основе "мутаций".

**Q: В чём разница между action.payload и action.error в thunk?** A: `payload` — для успешного/обычного результата (или `rejectWithValue`); `error` — сериализованная ошибка (`{name, message, stack}`) при обычном reject (исключении).

**Q: Что делает configureStore "из коробки", чего не было в createStore?** A: Redux DevTools, redux-thunk middleware, middleware проверки immutability/serializability (только в dev).

**Q: Зачем нужны tags в RTK Query?** A: Для инвалидации кеша — чтобы после мутации автоматически перезапросить связанные данные, без ручного dispatch.

**Q: Можно ли использовать RTK без React?** A: Да, RTK не зависит от React (это часть `react-redux`). RTK Query для React есть отдельный `/react` энтрипоинт с хуками, но ядро — фреймворк-агностик.

**Q: Что вернёт action creator из createSlice при вызове?** A: Объект `{ type: 'sliceName/actionName', payload: ... }`.

**Q: Как правильно обрабатывать side-effects (запросы к API)?** A: Через `createAsyncThunk` или через RTK Query endpoints — не напрямую в reducer (reducer должен быть чистой функцией).