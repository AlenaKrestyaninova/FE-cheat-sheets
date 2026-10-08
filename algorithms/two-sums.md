# Two Sum

Дан массив целых чисел nums и число target. Найдите индексы двух разных элементов, сумма которых равна target. Гарантируется, что решение существует и оно единственное.

Вход: nums = [2, 7, 11, 15], target = 9
Выход: [0, 1]   // 2 + 7 = 9

Вход: nums = [3, 2, 4], target = 6
Выход: [1, 2]   // 2 + 4 = 6

Вход: nums = [3, 3], target = 6
Выход: [0, 1]

```javascript
function findIndexes (nums, target) {
  let res = []
  const map = new Map() // создаем мапу
  for (let i = 0; i < nums.length; i++) { // проходимся по массиву
    const currentNum = nums[i] // находим текущее число
    const diff = target - currentNum // находим разницу между таргетом и текущим
    if (map.has(diff)) { // если в мапе уже есть разница - 
      res.push(map.get(diff), i) // пушим в результат индексы
      return res // возвращаем результат заранее
    }
    map.set(currentNum, i) // в любом случае кладем в мапу: ключ - разница, значение - индекс элемента массива
  }
}

console.log(findIndexes([2, 7, 11, 15], 9))
console.log(findIndexes([3, 2, 4], 6))
console.log(findIndexes([1, 2, 4, 5, 6, 7], 3))
```