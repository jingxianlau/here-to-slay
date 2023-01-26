import { Move } from 'boardgame.io';
import { v4 as UUID } from 'uuid';
import { INVALID_MOVE } from 'boardgame.io/core';
import {
  AnyCard,
  CardType,
  GameState,
  HeroCard,
  ItemCard,
  LeaderCard,
  MonsterCard
} from '../types';

function includesID(arr: AnyCard[], id: string) {
  console.log(
    id,
    arr.filter(x => x.id === id)
  );
  return arr.filter(x => x.id === id).length === 1;
}

function removeCard(arr: AnyCard[], cardID: string): AnyCard {
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
        const newCard = G.secret.deck.pop() as AnyCard;
        newCard.id = UUID();
        cards.push(newCard);
      }
      G.players[playerID] = G.players[playerID].concat(cards);
    } else if (ctx.phase === 'draw') {
      // DRAW ALL CARDS FOR SETUP
      // decks and monsters
      if (playerID == '0') {
        G.secret.leaderPile = random.Shuffle(G.secret.leaderPile);
        G.secret.deck = random.Shuffle(G.secret.deck);
        G.mainDeck.monsterPile = random.Shuffle(G.mainDeck.monsterPile);
        const monsterPile = G.mainDeck.monsterPile;
        const monsterCards: [MonsterCard, MonsterCard, MonsterCard] = [
          monsterPile.pop() as MonsterCard,
          monsterPile.pop() as MonsterCard,
          monsterPile.pop() as MonsterCard
        ];
        for (const card of monsterCards) {
          card.id = UUID();
        }
        G.mainDeck.monsters = monsterCards;
      }

      // draw cards
      const cards: AnyCard[] = [];
      for (let _ = 0; _ < 7; _++) {
        const card = G.secret.deck.pop() as AnyCard;
        card.id = UUID();
        cards.push(card);
      }
      G.players[playerID] = cards;

      // setup board
      const partyLeader = G.secret.leaderPile.pop() as LeaderCard;
      partyLeader.id = UUID();
      G.board[playerID] = {
        classes: {
          FIGHTER: 0,
          GUARDIAN: 0,
          RANGER: 0,
          THIEF: 0,
          WIZARD: 0,
          BARD: 0
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
  cardID: string
) => {
  if (G.board[playerID].heroCards.length === 5) return INVALID_MOVE;
  if (!includesID(G.players[playerID], cardID)) return INVALID_MOVE;

  const hero = removeCard(G.players[playerID], cardID);

  if (hero.type !== CardType.Hero) return INVALID_MOVE;
  // add to board
  G.board[playerID].heroCards.push(hero as HeroCard);
  // update classes obj
  G.board[playerID].classes[(hero as HeroCard).class]++;
  return;
};

export const AddItem: Move<GameState> = (
  { G, playerID },
  heroID: string,
  itemID: string
) => {
  if (!includesID(G.board[playerID].heroCards, heroID)) return INVALID_MOVE;
  if (!includesID(G.players[playerID], itemID)) return INVALID_MOVE;

  const itemCard = removeCard(G.players[playerID], itemID) as ItemCard;

  if (itemCard.type !== CardType.Item) return INVALID_MOVE;

  const heroCard = G.board[playerID].heroCards.find(
    value => value.id === heroID
  ) as HeroCard;

  if (heroCard.type !== CardType.Hero) return INVALID_MOVE;

  if (heroCard.items) {
    heroCard.items.push(itemCard);
  } else {
    heroCard.items = [itemCard];
  }

  return;
};

export const DestroyHero: Move<GameState> = (
  { G, playerID },
  heroID: string
) => {
  if (!includesID(G.board[playerID].heroCards, heroID)) return INVALID_MOVE;

  removeCard(G.board[playerID].heroCards, heroID);
  return;
};
