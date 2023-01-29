import { CardType, GameState } from '../types';
import { PlayerView } from 'boardgame.io/core';
import { Game } from 'boardgame.io';
import { deck, leaderPile, monsterPile } from './cards';
import {
  AddItem,
  ChallengeCard,
  DestroyHero,
  DrawCard,
  ModifyDice,
  moves,
  PlayStage,
  RollDice,
  SummonHero
} from './moves';

const startingState: GameState = {
  secret: {
    deck: deck,
    leaderPile: leaderPile
  },
  dice: {
    1: null,
    2: null
  },
  players: {},
  board: {},
  mainDeck: {
    discardPile: [],
    monsterPile: monsterPile,
    monsters: [
      { type: CardType.Large, name: '' },
      { type: CardType.Large, name: '' },
      { type: CardType.Large, name: '' }
    ]
  }
};

function isVictory(board: GameState['board'], playerID: string): boolean {
  if (board[playerID].largeCards.length === 4) {
    return true;
  }
  let classes = Object.values(board[playerID].classes);
  if (
    classes.filter(x => x === 1).length === 6 && // there are 6 '1's in the array -> 1 of every class
    board[playerID].heroCards.length === 5
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
      moves: moves,
      turn: {
        minMoves: 3,
        stages: {
          draw: {
            moves: { DrawCard }
          },
          challenge: {
            moves: { ChallengeCard, RollDice }
          },
          modify: {
            moves: { ModifyDice }
          },
          play: {
            moves: PlayStage
          }
        }
      }
    }
  }
};
