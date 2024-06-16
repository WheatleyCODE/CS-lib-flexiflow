import { useState } from 'react';
import './App.css';

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className='app' onClick={() => setCount((p) => p + 1)}>{count}</div>
  );
};
