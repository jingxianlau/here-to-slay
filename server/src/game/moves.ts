import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import {
  AnyCard,
  GameState,
  HeroCard,
  ItemCard,
  LeaderCard,
  MonsterCard
} from '../types';
import { leaderCards } from './cards';

function includesID(arr: AnyCard[], id: number) {
  return arr.filter(x => x.id !== id).length === 1;
}

function removeCard(arr: AnyCard[], cardID: number): AnyCard {
  return arr.splice(
    arr.findIndex(value => value.id === cardID),
    1
  )[0];
}

// TODO: ADD ID PROPERTY TO ALL DRAWN CARDS
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
        G.secret.leaderPile = random.Shuffle(leaderCards);
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
      const partyLeader = G.secret.leaderPile.pop() as LeaderCard;
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
        heroCards: [],
        largeCards: [partyLeader]
      };
      G.board[playerID].classes[partyLeader.class]++;
    }
  },
  client: false
};

export const SummonHero: Move<GameState> = (
  { G, playerID },
  cardID: number
) => {
  if (G.board[playerID].heroCards.length === 5) return;
  if (!includesID(G.players[playerID], cardID)) return;
  const hero = removeCard(G.players[playerID], cardID);
  // add to board
  G.board[playerID].heroCards.push(hero as HeroCard);
  // update classes obj
  G.board[playerID].classes[(hero as HeroCard).class]++;
  return;
};

export const AddItem: Move<GameState> = (
  { G, playerID },
  heroID: number,
  itemID: number
) => {
  if (G.board[playerID].heroCards.filter(x => x.id !== heroID))
    return INVALID_MOVE;
  if (!includesID(G.board[playerID].heroCards, heroID)) return INVALID_MOVE;
  if (!includesID(G.players[playerID], itemID)) return INVALID_MOVE;

  const itemCard = removeCard(G.players[playerID], itemID) as ItemCard;

  const heroCard = G.board[playerID].heroCards.find(
    value => value.id === heroID
  ) as HeroCard;

  if (heroCard.items) {
    heroCard.items.push(itemCard);
  } else {
    heroCard.items = [itemCard];
  }

  return;
};

export const DestroyHero: Move<GameState> = (
  { G, playerID },
  heroID: number
) => {
  if (!includesID(G.board[playerID].heroCards, heroID)) return INVALID_MOVE;

  removeCard(G.board[playerID].heroCards, heroID);
  return;
};
