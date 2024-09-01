import {createEffect, createEvent, createStore, sample} from 'effector';
import {MouseEvent, useEffect} from 'react';
import {delay} from '../flexiflow/tests/delay';
import {debounce, filter, seq, SyncPromise} from '../flexiflow';
import {useUnit} from 'effector-react';
import {seqTime} from '../flexiflow/combinators/seqTime/seqTime';

// Effector init
const $count1 = createStore(0);
const count1Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $count2 = createStore(0);
const count2Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $sumSeq = createStore(0);
const sumSeqChanged = createEvent<number>();

const $sum = createStore(0);
const sumChanged = createEvent<number>();

const $sumSeqTime = createStore(0);
const sumSeqTimeChanged = createEvent<number>();

const $toggle = createStore(false);
const toggleChanged = createEvent<MouseEvent<HTMLButtonElement>>();

// Работает либо асинхронно либо синхронно
const sideSyncOrAsyncEffectFx = createEffect((boolean: boolean) => {
  return boolean ? delay(700) : SyncPromise.resolve();
});

// Effector logic
$count1.on(count1Changed, (state) => state + 1);
$count2.on(count2Changed, (state) => state + 1);
$toggle.on(toggleChanged, (state) => !state);

$sumSeq.on(sumSeqChanged, (_, payload) => payload);
$sum.on(sumChanged, (_, payload) => payload);
$sumSeqTime.on(sumSeqTimeChanged, (_, payload) => payload);

// При изменении $toggle вызывается sideSyncOrAsyncEffectFx либо с true либо с false
sample({
  clock: $toggle,
  target: sideSyncOrAsyncEffectFx,
});

export const BaseExampleTwo = () => {
  const [count1, count2, toggle, sumSeq, sum, sumSeqTime, isAsync] = useUnit([
    $count1,
    $count2,
    $toggle,
    $sumSeq,
    $sum,
    $sumSeqTime,
    sideSyncOrAsyncEffectFx.pending,
  ]);

  // Flexiflow
  useEffect(() => {
    const flexibleSeq = debounce(seq($count1, $count2), 500);
    const flexible = debounce({a: $count1, b: $count2}, 500);
    const flexibleSeqTime = debounce(seqTime([$count1, $count2], 300), 800);

    const subscriptionSeq = flexibleSeq.subscribe(([count1, count2]) => {
      sumSeqChanged(count1 + count2);
    });

    const subscription = flexible.subscribe(({a, b}) => {
      // a, b - Optional монады, так как эти события могут никогда не произойти
      sumChanged(a.getOrElse(0) + b.getOrElse(0));
    });

    const subscriptionSeqTime = flexibleSeqTime.subscribe(([count1, count2]) => {
      sumSeqTimeChanged(count1 + count2);
    });

    // ? Можно еще написать seqCount ? -> Чтобы отрабатывала последовательность только N раз ?
    // ? Или может объединить все в один seq ?

    // Отслеживание ивентов
    const flexibleEvents = filter(seq(sumChanged, sumSeqChanged, sumSeqTimeChanged, $toggle), ([, , , toggle]) => toggle);

    const subscriptionEvents = flexibleEvents.subscribe(([event1, event2, event3, toggle]) => {
      alert(`Выполнено 3 Ивента и toggle true ${event1} ${event2} ${event3} ${toggle}`);
    });

    return () => {
      subscriptionSeq.unsubscribe();
      subscription.unsubscribe();
      subscriptionSeqTime.unsubscribe();
      subscriptionEvents.unsubscribe();
    };
  }, []);

  return (
    <div className='example'>
      <div>Count 1: {count1}</div>
      <div>Count 2: {count2}</div>

      <div>Debounced seq sum: {sumSeq}</div>
      <div>Debounced sum: {sum}</div>
      <div>Debounced seq time sum: {sumSeqTime}</div>

      <div>Effect работает: {isAsync ? 'Асинхронно' : 'Синхронно'}</div>

      <div className='buttons'>
        <button onClick={count1Changed}>Add count 1</button>
        <button onClick={count2Changed}>Add count 2</button>

        <button onClick={toggleChanged}>{toggle ? 'On' : 'Off'}</button>
      </div>
    </div>
  );
};
