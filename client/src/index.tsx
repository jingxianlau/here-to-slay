import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GameClient from './pages/GameClient';
import Create from './pages/Lobby/Create';
import Find from './pages/Lobby/Find';
import Lobby from './pages/Lobby/Lobby';
import Match from './pages/Lobby/Match';
import NotFound from './pages/NotFound';
import './css/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='lobby'>
          <Route index element={<Lobby />} />
          <Route path='create' element={<Create />} />
          <Route path='find' element={<Find />} />
          <Route path='match' element={<Match />} />
        </Route>
        <Route path='game' element={<GameClient />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
