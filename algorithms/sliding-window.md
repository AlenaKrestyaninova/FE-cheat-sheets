# Скользящее окно

Дана строка s. Найдите длину самой длинной подстроки (непрерывного куска), в которой все символы уникальны (не повторяются).

```javascript
function findSubstrLength (st) {
  let left = 0 // ставим левый указатель
  let right = 0 // ставим правый указатель
  let maxLength = 0 // создаем переменную для максимальной длины подстроки
  let map = new Map() // создаем мапу для записи значений (ключ - буква, значение - индекс)
  while (right < st.length) { // цикл выполняется, пока правый указатель не дойдет до конца строки
    const char = st[right] // текущая буква - символ в строке по индексу правого указателя
    if (map.has(char) && (left <= map.get(char))) { // если буква есть в мапе и есть в текущей подстроке
      left = map.get(char) + 1 // сдвигаем левый указатель на индекс, следующий после этой буквы
    }
    map.set(char, right) // в любом случае сетим в мапу эту букву
    right ++ // в любом случае увеличиваем правый указатель на 1
    if(right - left > maxLength) { // если длина текущей подстроки больше сохраненной - перезаписываем
      maxLength = right - left
    }
  }
  
  return maxLength
}

console.log(findSubstrLength('abcabcbb')) // 'abc' => 3
console.log(findSubstrLength('bbbbb')) // 'b' => 1
console.log(findSubstrLength('pwwkew')) // 'wke' => 3
console.log(findSubstrLength('abba')) // 'ab' или 'ba' => 2
```