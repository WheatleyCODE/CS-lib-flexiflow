# Combinators

- [get](./get/index.md) - Обеспечивает подписку на Effector store или Flexible
- [seq](./seq/index.md) - Ждет пока произойдут все события
- [map](./map/index.md) - Преобразовывает значение в другое
- [filter](./filter/index.md) - Исполняются только те события которые удовлетворяют функции predicate
- [debounce](./debounce/index.md) - Накладывает контракт debounce на события из аргументов
- [throttle](./throttle/index.md) - Накладывает throttle debounce на события из аргументов
- [enumerable](./enumerable/index.md) - Добавляет счетчик к событиям
- [repeat](./repeat/index.md) - Повторяет события N раз
- [watch](./watch/index.md) - Вызывает функцию когда срабатывает одно из событий
- [merge](./merge/index.md) - Сливает события из агрументов в одно событие
- [checkBefore](./checkBefore/index.md) - Проверяет N событий после элемента
- [checkAfter](./checkAfter/index.md) - Проверяет N событий перед элементом

### React Example

```ts
useEffect(() => {
  const observable = debounce(
    filter(
      scheduler(
        seq(
          seq($count1, debounce($count2, 100)),
          seq($count3, throttle($count4, 200)),
          enumerable($count5),
          checkBefore(
            watch($count1, console.log),
            $count2,
            pipeFn(
              () => console.log('pipe 1'),
              () => console.log('pipe 2'),
              () => console.log('pipe 3'),
              () => true,
            ),
          ),
        ),
        seq(
          seq($string1, get($string2)),
          seq($string3, repeat($string4, 4)),
          map($count5, () => 10),
          checkAfter(
            memo($count1),
            $count2,
            pipeFn(
              () => console.log('pipe 1'),
              () => console.log('pipe 2'),
              () => console.log('pipe 3'),
              () => true,
            ),
          ),
        ),
        300,
      ),
      pipeFn(
        () => console.log('Ничего не понятно'),
        () => console.log('.'),
        () => console.log('Но очень интересно'),
        () => true,
      ),
    ),
    10,
  );

  const unsub = observable.subscribe(
    pipeFn(
      (v) => v,
      (v) => v,
      (v) => v,
      ([counts]) => {
        console.log(counts, 'counts');
      },
    ),
  );

  return () => unsub.unsubscribe();
}, []);
```
