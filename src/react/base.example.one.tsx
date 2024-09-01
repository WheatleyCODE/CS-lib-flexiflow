import {createEffect, createEvent, createStore, sample} from 'effector';
import {useUnit} from 'effector-react';
import {MouseEvent, useEffect} from 'react';
import {filter, seq} from '../flexiflow';
import {delay} from '../flexiflow/tests/delay';

// Effector init
const $count1 = createStore(0);
const count1Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $count2 = createStore(0);
const count2Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $toggle = createStore(false);
const toggleChanged = createEvent<MouseEvent<HTMLButtonElement>>();

const sideEffectFx = createEffect(({a, b}: {a: number; b: number}) => {
  console.log(a, b);

  return delay(1000);
});

// Effector logic
$count1.on(count1Changed, (state) => state + 1);
$count2.on(count2Changed, (state) => state + 1);
$toggle.on(toggleChanged, (state) => !state);

// При изменении стора $count1 или стора $count2, возьми данные из source и если условие в filter валидно выполни target
sample({
  clock: [$count1, $count2],
  source: {a: $count1, b: $count2},
  filter: ({a, b}) => a > 0 && b > 0,
  target: sideEffectFx,
});

// Component
export const BaseExampleOne = () => {
  // Хук из Effector передающий состояние в компонент
  const [count1, count2, toggle] = useUnit([$count1, $count2, $toggle]);

  // * Пример альтернативного варианта передачи аргументов
  // const {a, b, toggle} = useUnit({a: $count1, b: $count2, toggle: $toggle});

  // Flexiflow base example
  useEffect(() => {
    // * Пример альтернативного варианта передачи аргументов
    // const flexible = seq($count1, $count2);
    // const flexible = seq([$count1, $count2]);

    const flexible = seq({arg: $count1, b: $count2});

    const flexiblePending = seq($count1, $count2, sideEffectFx.pending);
    const flexibleDone = seq($count1, $count2, sideEffectFx.done);
    const flexibleFail = seq($count1, $count2, sideEffectFx.fail);

    const subscription = flexible.subscribe(({arg, b}) => {
      console.log('Выполнится когда $count1 и $count2, изменят свои значения и будет выполняться всегда после этого');
      console.log(arg, b);
    });

    const subscriptionPending = flexiblePending.subscribe(([count1, count2, _]) => {
      console.log('Выполнится когда $count1 и $count2, изменят свои значения и sideEffect будет в значении pending');
      console.log(count1, count2, _);
    });

    const subscriptionDone = flexibleDone.subscribe(([count1, count2, _]) => {
      console.log('Выполнится когда $count1 и $count2, изменят свои значения и sideEffect выполнился успешно');
      console.log(count1, count2, _);
    });

    const subscriptionFail = flexibleFail.subscribe(([count1, count2, _]) => {
      console.log('Выполнится когда $count1 и $count2, изменят свои значения и sideEffect выполнился успешно');
      console.log(count1, count2, _);
    });

    const flexibleFilter = filter(
      seq({arg: $count1, b: $count2, pending: sideEffectFx.pending, toggle: $toggle}),
      ({arg, b, pending, toggle}) => {
        return arg > 2 && b > 2 && pending && !toggle;
      },
    );

    const subscriptionFilter = flexibleFilter.subscribe(({arg, b, pending, toggle}) => {
      console.log(`
        Выполнится когда $count1 и $count2 и sideEffectFx.pending,
        изменят свои значения и значения счетчиков будет больше 2, 
        pending в значении true и toggle в значении false
      `);

      console.log(arg, b, pending, toggle);
    });

    // Отписки
    return () => {
      subscription.unsubscribe();

      subscriptionPending.unsubscribe();
      subscriptionDone.unsubscribe();
      subscriptionFail.unsubscribe();

      subscriptionFilter.unsubscribe();
    };
  }, []);

  return (
    <div className='example'>
      <div>Count 1: {count1}</div>
      <div>Count 2: {count2}</div>

      <div className='buttons'>
        <button onClick={count1Changed}>Add count 1</button>
        <button onClick={count2Changed}>Add count 2</button>

        <button onClick={toggleChanged}>{toggle ? 'On' : 'Off'}</button>
      </div>
    </div>
  );
};
