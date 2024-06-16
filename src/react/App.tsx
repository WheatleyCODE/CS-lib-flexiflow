import { useState } from 'react';
import '../flexiflow/index';
import './App.css';

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Flexiflow</h1>
      <div className='app' onClick={() => setCount((p) => p + 1)}>{count}</div>
    </div>
  );
};
