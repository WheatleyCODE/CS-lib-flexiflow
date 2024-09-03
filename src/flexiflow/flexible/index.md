# Flexible

Является аналогом Observable из RxJS

### Example:

```ts
const flexible = new Flexible<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
});

const subscription = flexible.subscribe((num) => {
  console.log(num);
});
```
