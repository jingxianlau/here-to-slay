import React from 'react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { DrawCard } from './game/moves';
import { Game } from 'boardgame.io';
import { GameState } from './types';

// TODO: Simple lobby system

const HereToSlayClient = Client({
  game: {
    phases: {
      // setup
      draw: {
        moves: { DrawCard },
        turn: {
          maxMoves: 1,
          minMoves: 1
        },
        endIf: ({ G, ctx }) => Object.keys(G.players).length >= ctx.numPlayers,
        start: true,
        next: 'play'
      },
      // actual game
      play: {
        moves: {},
        turn: {
          minMoves: 3,
          stages: {
            draw: {
              moves: { DrawCard }
            },
            challenge: {
              moves: {}
            },
            modify: {
              moves: {}
            },
            play: {
              moves: {}
            }
          }
        }
      }
    }
  } as Game<GameState>,
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
