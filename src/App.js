import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Start from './components/Start';


function App() {



  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
