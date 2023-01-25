import React from 'react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import game from './game/Game';

// TODO: Simple lobby system

const HereToSlayClient = Client({
  game: game,
  numPlayers: 3,
  // board: HereToSlayBoard,
  multiplayer: SocketIO({ server: 'localhost:8000' })
});

function App() {
  return (
    <div>
      <HereToSlayClient playerID='0' />
      <HereToSlayClient playerID='1' />
      <HereToSlayClient playerID='2' />
    </div>
  );
}

export default App;
