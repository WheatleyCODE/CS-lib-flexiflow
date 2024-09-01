import {createEvent, createStore} from 'effector';
import {useUnit} from 'effector-react';
import {MouseEvent, useEffect} from 'react';
import {checkAfter, checkBefore} from '../flexiflow';

// Effector init
const $count1 = createStore(0);
const count1Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $count2 = createStore(0);
const count2Changed = createEvent<MouseEvent<HTMLButtonElement>>();

// Effector logic
$count1.on(count1Changed, (state) => state + 1);
$count2.on(count2Changed, (state) => state + 1);

// Component
export const BaseExampleFour = () => {
  const [count1, count2] = useUnit([$count1, $count2]);

  useEffect(() => {
    const flexibleBefore = checkBefore([$count1, $count2], 3, (currentValue, prevValues) => {
      const currentResult = currentValue.reduce((acc, val) => acc + val.getOrElse(0), 0);
      const prevResult = prevValues.flat().reduce((acc, val) => acc + val.getOrElse(0), 0);

      console.log(currentResult, 'currentResult');
      console.log(prevResult, 'prevResult');

      return currentResult < prevResult;
    });

    const flexibleAfter = checkAfter([$count1, $count2], 3, (currentValue, futureValues) => {
      const currentResult = currentValue.reduce((acc, val) => acc + val.getOrElse(0), 0);
      const futureResult = futureValues.flat().reduce((acc, val) => acc + val.getOrElse(0), 0);

      console.log(currentResult, 'currentResult');
      console.log(futureResult, 'prevResult');

      return currentResult < futureResult;
    });

    const subscriptionBefore = flexibleBefore.subscribe(([count1, count2]) => {
      console.log([count1, count2]);
    });

    const subscriptionAfter = flexibleAfter.subscribe(([count1, count2]) => {
      console.log([count1, count2]);
    });

    return () => {
      subscriptionBefore.unsubscribe();
      subscriptionAfter.unsubscribe();
    };
  }, []);

  return (
    <div className='example'>
      <div>Count 1: {count1}</div>
      <div>Count 2: {count2}</div>

      <div className='buttons'>
        <button onClick={count1Changed}>Add count 1</button>
        <button onClick={count2Changed}>Add count 2</button>
      </div>
    </div>
  );
};
