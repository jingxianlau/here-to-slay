import React from 'react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import game from '../game/Game';
import HereToSlayBoard from '../Board';

const HereToSlayClient = Client({
  game: game,
  numPlayers: 3,
  board: HereToSlayBoard,
  multiplayer: SocketIO({ server: 'localhost:8000' })
});

const GameClient = () => {
  return (
    <div>
      <HereToSlayClient playerID='0' />
    </div>
  );
};

export default GameClient;
