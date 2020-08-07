import './App.scss';
import React, { useState } from 'react';
import { ApiTesterSection } from './Components/ApiResponseDisplay';

function App() {
  return (
    <div className='App'>
      <section className='mb2'>
        <h1>restapi-typescript-decorators-front-end-example</h1>
      </section>

      <div>
        <ApiTesterSection />
      </div>
    </div>
  );
}

export default App;
