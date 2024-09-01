/* eslint-disable prettier/prettier */
import {createEvent, createStore} from 'effector';
import {useUnit} from 'effector-react';
import {MouseEvent, useEffect, useState} from 'react';
import {filter, seq} from '../flexiflow';

// Effector init
const $count1 = createStore(0);
const count1Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $count2 = createStore(0);
const count2Changed = createEvent<MouseEvent<HTMLButtonElement>>();

const $isStartGame = createStore(false);
const isStartGameChanged = createEvent<MouseEvent<HTMLButtonElement>>();

const interval1Submitted = createEvent<boolean>();
const interval2Submitted = createEvent<boolean>();

// Effector logic
$count1.on(count1Changed, (state) => state + 1);
$count2.on(count2Changed, (state) => state + 1);
$isStartGame.on(isStartGameChanged, (state) => !state);

// Flexiflow events logic
const counts$ = seq($count1, $count2);

const redTower$ = filter(
  seq(
    counts$,
    interval2Submitted,
    $isStartGame,
  ),
  ([[a, b], interval2Submitted, isStartGame]) => {
    return interval2Submitted && isStartGame && (a + b) % 5 == 0;
  }
);

const greenTower$ = filter(
  seq(
    counts$,
    interval2Submitted,
    $isStartGame,
  ),
  ([[a, b], interval2Submitted, isStartGame]) => {
    return interval2Submitted && isStartGame && (a + b) % 3 == 0;
  }
);

// Component
export const BaseExampleFive = () => {
  const [count1, count2, isStartGame] = useUnit([$count1, $count2, $isStartGame]);

  const [greenTowerHeight, setGreenTowerHeight] = useState(1);
  const [redTowerHeight, setRedTowerHeight] = useState(1);

  useEffect(() => {
    const timer1 = setInterval(() => interval1Submitted(true), 1000);
    const timer2 = setInterval(() => interval2Submitted(true), 500);

    const redTowerSub = redTower$.subscribe((value) => {
      console.log('redTower', value);

      setRedTowerHeight((prev) => prev + 1);
    });

    const greenTowerSub = greenTower$.subscribe((value) => {
      console.log('greenTower', value);

      setGreenTowerHeight((prev) => prev + 1);
    });


    return () => {
      clearInterval(timer1);
      clearInterval(timer2);

      redTowerSub.unsubscribe();
      greenTowerSub.unsubscribe();
    };
  }, [isStartGame]);

  return (
    <div className='example'>
      <h1>Idle tower builder game 2024 !</h1>

      <div>Count 1: {count1}</div>
      <div>Count 2: {count2}</div>

      <div className='buttons'>
        <button onClick={count1Changed}>Add count 1</button>
        <button onClick={count2Changed}>Add count 2</button>

        <button onClick={isStartGameChanged}>{isStartGame ? 'End game' : 'Start game'}</button>
        <button onClick={() => {setGreenTowerHeight(1); setRedTowerHeight(1);}}>Refresh game</button>
      </div>

      <div className='towers'>
        <div className='tower'>
          {new Array(greenTowerHeight).fill(undefined).map((_, i) => <div  key={i} className='block green' />)}
        </div>

        <div className='tower'>
          {new Array(redTowerHeight).fill(true).map((_, i) => <div key={i} className='block red' />)}
        </div>
      </div>
    </div>
  );
};
