import { Move } from 'boardgame.io';
import { AnyCard, GameState, LeaderCard, MonsterCard } from '../types';
import { leaderCards } from './cards';

export const DrawCard: Move<GameState> = {
  move: ({ G, ctx, random, playerID }, number) => {
    if (ctx.phase === 'play') {
      // STANDARD DRAW
      const cards: AnyCard[] = [];
      for (let i = 0; i < number; i++) {
        cards.push(G.secret.deck.pop() as AnyCard);
      }
      G.players[playerID] = G.players[playerID].concat(cards);
    } else if (ctx.phase === 'draw') {
      // DRAW ALL CARDS FOR SETUP
      // decks and monsters
      if (playerID == '0') {
        G.secret.leaderCards = random.Shuffle(leaderCards);
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
      const partyLeader = G.secret.leaderCards.pop() as LeaderCard;
      G.board[playerID] = {
        classes: {
          FIGHTER: 0,
          GUARDIAN: 0,
          RANGER: 0,
          THIEF: 0,
          WIZARD: 0,
          BARD: 0,
          NUM_HEROES: 0
        },
        heroCards: [null, null, null, null, null],
        largeCards: [partyLeader, null, null, null]
      };
      G.board[playerID].classes[partyLeader.class]++;
    }
  },
  client: false
};
