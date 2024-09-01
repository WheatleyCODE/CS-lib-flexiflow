import {useState} from 'react';
import {BaseExampleOne} from './base.example.one';
import {BaseExampleTwo} from './base.example.two';
import {BaseExampleThree} from './base.example.three';
import {BaseExampleFour} from './base.example.four';
import {BaseExampleFive} from './base.example.five';
import './App.css';

type Examples = 'base.example.one' | 'base.example.two' | 'base.example.three' | 'base.example.four' | 'advanced.example.one';

export const App = () => {
  const [example, setExample] = useState<Examples>('base.example.one');

  return (
    <div className='page'>
      <h3>{example}</h3>

      <div className='buttons'>
        <button onClick={() => setExample('base.example.one')}>base.example.one</button>
        <button onClick={() => setExample('base.example.two')}>base.example.two</button>
        <button onClick={() => setExample('base.example.three')}>base.example.three</button>
        <button onClick={() => setExample('base.example.four')}>base.example.four</button>
        <button onClick={() => setExample('advanced.example.one')}>advanced.example.one</button>
      </div>

      {example === 'base.example.one' && <BaseExampleOne />}
      {example === 'base.example.two' && <BaseExampleTwo />}
      {example === 'base.example.three' && <BaseExampleThree />}
      {example === 'base.example.four' && <BaseExampleFour />}
      {example === 'advanced.example.one' && <BaseExampleFive />}
    </div>
  );
};
