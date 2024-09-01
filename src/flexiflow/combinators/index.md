# Combinators

- [get](./get/index.md) - Обеспечивает подписку на Effector store или Flexible
- [seq](./seq/index.md) - Ждет пока произойдут все события
- [seqTime](./seqTime/index.md) - Ждет пока произойдут все события, но если истечет время нужно будет заново ждать события
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

### Description

Все комбинаторы могут принимать 3 типа аргументов, сделано так специально для удобства работы в Effector

1. Аргументы:

```ts
const flexible = merge($number0, $string0);
```

2. Объект:

```ts
const flexible = merge({a: $number0, b: $string0});
```

3. Массив:

```ts
const flexible = merge([$number0, $string0]);
```

Значения аргументов во всех комбинаторах могут быть 2 типами:

1. Unit из Effector - Это любые Event, Store, Effect
2. Flexible - Аналог Observable из RxJS

Комбинаторы всегда возвращают Flexible

```ts
const flexible = get(merge($number0, merge(get(get($string0)))), eventChanged, sideEffectFx);
```

### Effector + Flexiflow + React examples

[Примеры](../../react/index.md)
