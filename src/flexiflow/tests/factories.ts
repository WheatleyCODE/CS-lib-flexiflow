import {createEvent, createStore, EventCallable, StoreWritable} from 'effector';

export type TestStore<T> = [StoreWritable<T>, EventCallable<void>];

export const createCountStore = (): TestStore<number> => {
  const $count = createStore(0);
  const countChanged = createEvent();

  $count.on(countChanged, (state) => state + 1);

  return [$count, countChanged];
};

export const createBooleanStore = (): TestStore<boolean> => {
  const $boolean = createStore(false);
  const countChanged = createEvent();

  $boolean.on(countChanged, (state) => !state);

  return [$boolean, countChanged];
};

export const createStringStore = (): TestStore<string> => {
  const $string = createStore('');
  const stringChanged = createEvent();

  $string.on(stringChanged, (state) => state + '__foo');

  return [$string, stringChanged];
};
