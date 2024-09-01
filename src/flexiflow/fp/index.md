# FP

Популярные функции из FP

pipe - Возвращает значение  
pipeFn - Возвращает функцию

```ts
const value = pipe(
  () => 10,
  (a) => a * 2,
  (b) => b + 2,
);

const fn = pipeFn(
  () => 10,
  (a) => a * 2,
  (b) => b + 2,
);
```
