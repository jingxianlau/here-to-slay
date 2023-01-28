import { Game } from 'boardgame.io';
import { GameState } from '../types';
import { DrawCard, moves, PlayStage } from './moves';

export default {
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
      moves: moves,
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
            moves: PlayStage
          }
        }
      }
    }
  }
} as Game<GameState>;
