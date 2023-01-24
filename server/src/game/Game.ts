import { GameState } from '../types';
import { PlayerView } from 'boardgame.io/core';
import { Game } from 'boardgame.io';
import { deck, monsterPile } from './cards';
import { DrawCard } from './moves';

const startingState: GameState = {
  secret: {
    deck: deck
  },
  dice: {
    d1: [6, 6],
    d2: null
  },
  players: {},
  board: {},
  mainDeck: {
    discardPile: [],
    monsterPile: monsterPile,
    monsters: [null, null, null]
  }
};

export const HereToSlay: Game<GameState> = {
  setup: () => startingState,

  playerView: PlayerView.STRIP_SECRETS,

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
};
