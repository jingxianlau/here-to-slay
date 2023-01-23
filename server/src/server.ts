import { Server, Origins } from 'boardgame.io/server';
import { HereToSlay } from './game/Game';

const server = Server({
  games: [HereToSlay],
  origins: [Origins.LOCALHOST]
});

server.run(8000);
