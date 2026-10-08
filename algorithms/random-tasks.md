# Разные задачи

Напиши функцию unusedCashback, которая
Принимает на вход массив активных категорий кешбека и список операций с категориями
Возвращает массив неиспользованных категорий кешбека

```javascript
function unusedCashback(categories, operations) {
    let unused = new Set(categories)
    for (item of operations) {
        if(unused.has(item.category)) {
            unused.delete(item.category)
        }
    }
    return [...unused]
}

console.log(unusedCashback(['groceries', 'bar'], [
  { category: 'groceries' }, 
  { category: 'fuel' }
])) // ['bar']
```