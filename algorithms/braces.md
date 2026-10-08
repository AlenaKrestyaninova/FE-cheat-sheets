# Валидные скобки

Дана строка s, состоящая только из символов (, ), {, }, [, ]. Определите, корректна ли расстановка скобок. Скобки корректны, если:

Каждая открывающая скобка закрыта скобкой того же типа.
Скобки закрываются в правильном порядке.
У каждой закрывающей скобки есть соответствующая открывающая.
```
Вход: "()"        Выход: true
Вход: "()[]{}"    Выход: true
Вход: "(]"        Выход: false
Вход: "([)]"      Выход: false
Вход: "{[]}"      Выход: true
Вход: ""          Выход: true
```

```javascript
const braces = {
  ')': '(',
  '}': '{',
  ']': '['
}
function isCorrectBraces (s) {
  const stask = []
  for (let symb of s) {
    if(Object.values(braces).includes(symb)) { // если пришла открывающая скобка
      stask.push(symb)
    } else {
      // если скобка такого же типа, что и последняя в стеке - удаляем последний элемент стека
      if (stask[stask.length - 1] === braces[symb]) {
        stask.pop()
      } else { // если нет - возвращаем false
        return false
      }
    }
  }
  if (stask.length !== 0) {
    return false
  }
  return true
}

console.log(isCorrectBraces('(((')) // false
```