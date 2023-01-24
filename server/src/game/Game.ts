import { GameState } from '../types';
import { PlayerView } from 'boardgame.io/core';
import { Game } from 'boardgame.io';
import { deck, leaderCards, monsterPile } from './cards';
import { DrawCard } from './moves';

const startingState: GameState = {
  secret: {
    deck: deck,
    leaderCards: leaderCards
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

function isVictory(board: GameState['board'], playerID: string): boolean {
  if (board[playerID].largeCards.filter(x => x === null).length === 0) {
    return true;
  }
  let classes = Object.values(board[playerID].classes);
  if (
    classes.filter(x => x === 1).length === 6 && // there are 6 '1's in the array -> 1 of every class
    board[playerID].classes['NUM_HEROES'] === 5
  ) {
    return true;
  }
  return false;
}

export const HereToSlay: Game<GameState> = {
  setup: () => startingState,

  playerView: PlayerView.STRIP_SECRETS,

  // victory condition
  endIf: ({ G, ctx }) => {
    if (ctx.phase !== 'draw') {
      for (let i = 0; i < ctx.numPlayers; i++) {
        if (isVictory(G.board, String(i))) {
          return { winner: String(i) };
        }
      }
      return;
    }
    return;
  },

  // moves
  phases: {
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
};
