import type { HealthResponse } from '@startup-stack/shared';
import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // TODO: test api response - remove
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data: HealthResponse) => {
        console.log(data);
      });
  }, []);

  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank' rel='noreferrer'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)} type='button'>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
