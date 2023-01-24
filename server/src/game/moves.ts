import { Move } from 'boardgame.io';
import { AnyCard, GameState, LeaderCard, MonsterCard } from '../types';
import { leaderCards } from './cards';

export const DrawCard: Move<GameState> = {
  move: ({ G, ctx, random, playerID }, number) => {
    if (ctx.turn > ctx.numPlayers) {
      // STANDARD DRAW
      const cards: AnyCard[] = [];
      for (let i = 0; i < number; i++) {
        cards.push(G.secret.deck.pop() as AnyCard);
      }
      G.players[playerID] = G.players[playerID].concat(cards);
    } else {
      // DRAW ALL CARDS FOR SETUP
      // decks and monsters
      if (playerID == '0') {
        G.secret.deck = random.Shuffle(G.secret.deck);
        G.mainDeck.monsterPile = random.Shuffle(G.mainDeck.monsterPile);
        const monsterPile = G.mainDeck.monsterPile;
        G.mainDeck.monsters = [
          monsterPile.pop() as MonsterCard,
          monsterPile.pop() as MonsterCard,
          monsterPile.pop() as MonsterCard
        ];
      }

      // draw cards
      const cards: AnyCard[] = [];
      for (let _ = 0; _ < 7; _++) {
        cards.push(G.secret.deck.pop() as AnyCard);
      }
      G.players[playerID] = cards;

      // setup board
      const partyLeaders = random.Shuffle(leaderCards);
      G.board[playerID] = {
        heroCards: [null, null, null, null, null],
        largeCards: [partyLeaders.pop() as LeaderCard, null, null, null]
      };
      G.board[playerID].heroCards = [null, null, null, null, null];
      G.board[playerID].largeCards = [
        partyLeaders.pop() as LeaderCard,
        null,
        null,
        null
      ];
    }
  },
  client: false
};
