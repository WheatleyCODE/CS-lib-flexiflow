import {createEvent, createStore} from 'effector';
import {MouseEvent, useEffect} from 'react';
import {useUnit} from 'effector-react';
import {debounce, enumerable, get, map, merge, pipeFn, repeat, seq, throttle, watch} from '../flexiflow';

// Effector init
const $string1 = createStore('');
const string1Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $count1 = createStore(2);
const count1Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $count2 = createStore(2);
const count2Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $count3 = createStore(2);
const count3Changed = createEvent<MouseEvent<HTMLButtonElement>>();

// Effector logic
$count1.on(count1Changed, (state) => state * 2);
$count2.on(count2Changed, (state) => state * 2);
$count3.on(count3Changed, (state) => state * 2);

$string1.on(string1Changed, (state) => state + '__foo');

export const BaseExampleThree = () => {
  const [count1, count2, count3, string1] = useUnit([$count1, $count2, $count3, $string1]);

  // Flexiflow
  useEffect(() => {
    const flexible = merge(
      enumerable(
        watch(
          map(
            $count1,
            pipeFn(
              (count) => count,
              (count) => count,
              (count) => count * 10,
            ),
          ),
          (mapped) => console.log(mapped, 'watch'),
        ),
      ),
      enumerable(throttle($count2, 300)),
      enumerable(debounce(get($count3), 300)),
    );

    const subscription = flexible.subscribe(([count, num]) => {
      console.log('count', count);
      console.log('enumerable', num);
    });

    const flexibleRepeat = repeat(seq(flexible, $string1), 2);

    const subscriptionRepeat = flexibleRepeat.subscribe((arg) => {
      // Типизация вся на месте
      console.log(arg);
    });

    return () => {
      subscription.unsubscribe();
      subscriptionRepeat.unsubscribe();
    };
  }, []);

  return (
    <div className='example'>
      <div>Count 1: {count1}</div>
      <div>Count 2: {count2}</div>
      <div>Count 3: {count3}</div>
      <div>String 1: {string1}</div>

      <div className='buttons'>
        <button onClick={count1Changed}>Add count 1</button>
        <button onClick={count2Changed}>Add count 2</button>
        <button onClick={count3Changed}>Add count 3</button>

        <button onClick={string1Changed}>Add string 1</button>
      </div>
    </div>
  );
};
