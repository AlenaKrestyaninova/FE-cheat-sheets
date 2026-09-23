# Задачи про полифилы

### Debounce

Debounce — это способ "отложить" вызов функции до тех пор, пока не пройдёт определённое время без новых событий. Если событие происходит снова, таймер сбрасывается, и отсчёт начинается заново. Функция выполнится только один раз, когда пользователь "успокоится".

```javascript
// дебоунс без this
function debounce(callee, timeoutMs) {
  let lastCall = 0;
  let lastCallTimer = null;

  return function perform(...args) {
    let previousCall = lastCall;
    lastCall = Date.now();

    if (previousCall && lastCall - previousCall <= timeoutMs) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}
```

```javascript
// дебоунс кратко
function debounceShort(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // Сбрасываем предыдущий таймер
    timeoutId = setTimeout(() => func.apply(this, args), delay); // Ставим новый
  };
}
```

### throttle

Throttle — это способ ограничить частоту вызовов функции так, чтобы она выполнялась не чаще, чем раз в заданный интервал времени, даже если событие срабатывает чаще.

```javascript
// троттл
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args); // Вызываем функцию
      inThrottle = true; // Блокируем новые вызовы
      setTimeout(() => (inThrottle = false), limit); // Разблокируем через limit мс
    }
  };
}
```

```javascript
// троттл через Date
function throttleDate(func, wait) {
  let lastCallTime = null;
    return function (...args) {
        const now = Date.now();
        const passed = now - lastCallTime;
        if(passed > wait){
            func.apply(this, args);
            lastCallTime = Date.now();
        }
    }
}
```

### Promise

```javascript
function myPromise(executor) {
  let state = 'pending';  // что сейчас происходит
  let value;              // результат (когда будет)
  let callbacks = [];     // список тех, кто ждёт результата

  function resolve(val) { //  resolve и reject - функции, которые меняют состояние коробки
    if (state !== 'pending') return;
    state = 'fulfilled';
    value = val;
    // будим всех кто ждал
    callbacks.forEach(cb => queueMicrotask(() => cb.onFulfilled?.(val)));  // queueMicrotask — чтобы callbacks вызывались асинхронно, как в настоящем Promise.
  }

  function reject(reason) {
    if (state !== 'pending') return;
    state = 'rejected';
    value = reason;
    callbacks.forEach(cb => queueMicrotask(() => cb.onRejected?.(reason)));
  }

  const api = {
    then(onFulfilled, onRejected) { // .then подписывается на результат и возвращает новый промис.
      return myPromise((res, rej) => {
        const handle = (fn, val, fallback) => { // функция, которая запускает твой callback и решает что делать с результатом
          if (typeof fn !== 'function') return fallback(val);
          try { res(fn(val)); }
          catch(e) { rej(e); }
        };

        if (state === 'fulfilled') queueMicrotask(() => handle(onFulfilled, value, res)); // если Промис уже выполнен — сразу запускаем callback
        else if (state === 'rejected') queueMicrotask(() => handle(onRejected, value, rej)); // если Промис уже упал — сразу запускаем обработчик ошибки
        else callbacks.push({ // если Промис ещё pending — записываемся в список ожидающих
          onFulfilled: val => handle(onFulfilled, val, res),
          onRejected:  val => handle(onRejected, val, rej),
        });
      });
    },
    catch(fn) { return api.then(undefined, fn); }
  };

  try { executor(resolve, reject); } // запускаем executor
  catch(e) { reject(e); } // try/catch нужен на случай если внутри executor синхронно выбросится ошибка — чтобы промис не завис в pending

  return api;
}
```

### Promise.all

```javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    // Проверяем, является ли аргумент итерируемым объектом
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument is not iterable'));
    }

    const results = [];
    const array = Array.from(promises);
    
    // Если передан пустой массив, сразу возвращаем пустой результат
    if (array.length === 0) {
      return resolve(results);
    }

    let completedCount = 0;

    array.forEach((item, index) => {
      // Оборачиваем каждый элемент в Promise.resolve на случай, если это не промис
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          completedCount++;
          
          // Когда все промисы выполнились, разрешаем основной промис
          if (completedCount === array.length) {
            resolve(results);
          }
        },
        (error) => {
          // Если хоть один промис завершился ошибкой, отклоняем весь результат
          reject(error);
        }
      );
    });
  });
};
```