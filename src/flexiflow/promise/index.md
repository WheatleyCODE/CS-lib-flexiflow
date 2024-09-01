# SyncPromise

Монада которая повторяет поведение обычного Promise, благодаря ней можно легко описывать синхронные и асинхронные effect в Effector

### Effector + SyncPromise example:

```ts
import {createEffect, sample} from 'effector';
import {getRandomNumber} from '../tests/getRandomNumber';
export {SyncPromise} from './syncPromise';

const syncOrAsyncSideEffect = (num: 10) => (getRandomNumber() >= num ? SyncPromise.resolve() : Promise.resolve());

const syncOrAsyncEffectFx = createEffect(syncOrAsyncSideEffect);

sample({
  // Логика ...
  target: syncOrAsyncEffectFx,
});
```
