import React from 'react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { DrawCard } from './game/moves';
// import { DrawCard } from './game/moves';
// import { HereToSlay } from './game/Game';

const HereToSlayClient = Client({
  game: {
    phases: {
      draw: {
        moves: { DrawCard },
        turn: {
          maxMoves: 1,
          minMoves: 1
        },
        start: true,
        next: 'play'
      },
      play: {
        moves: {}
      }
    }
  },
  // board: HereToSlayBoard,
  multiplayer: SocketIO({ server: 'localhost:8000' })
});

function App() {
  return (
    <div>
      <HereToSlayClient playerID='0' />
      <HereToSlayClient playerID='1' />
      {/* <HereToSlayClient playerID='2' /> */}
    </div>
  );
}

export default App;
