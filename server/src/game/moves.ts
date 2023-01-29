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
  MagicCard,
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

export const DrawCard: Move<GameState> = {
  move: ({ G, ctx, random, playerID }, number) => {
    if (ctx.phase === 'play') {
      // STANDARD DRAW
      const cards: AnyCard[] = [];
      for (let i = 0; i < number; i++) {
        const newCard = G.secret.deck.pop() as AnyCard;
        if (!newCard.id) {
          newCard.id = UUID();
        }
        cards.push(newCard);
      }
      G.players[playerID].hand = G.players[playerID].hand.concat(cards);
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
      G.players[playerID].hand = cards;
      G.players[playerID].knownSecrets = [];

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

export const DrawFromDiscardPile: Move<GameState> = (
  { G, playerID },
  cardID: string
): typeof INVALID_MOVE | void => {
  if (!includesID(G.mainDeck.discardPile, cardID)) return INVALID_MOVE;

  const card = removeCard(G.mainDeck.discardPile, cardID);
  G.players[playerID].hand.push(card);
};

export const RollDice: Move<GameState> = ({ G, random }, diceID: 1 | 2) => {
  G.dice[diceID] = { roll: [random.D6(), random.D6()], modifier: 0 };
};

export const ClearDice: Move<GameState> = ({ G }) => {
  G.dice[1] = null;
  G.dice[2] = null;
};

export const Discard: Move<GameState> = (
  { G, playerID },
  cardID: string
): typeof INVALID_MOVE | void => {
  if (!includesID(G.players[playerID].hand, cardID)) return INVALID_MOVE;

  const card = removeCard(G.players[playerID].hand, cardID);
  G.mainDeck.discardPile.push(card);
};

export const ModifyDice: Move<GameState> = (
  { G, playerID },
  diceID: 1 | 2,
  modifierID: string,
  modifier: number
): typeof INVALID_MOVE | void => {
  if (!includesID(G.players[playerID].hand, modifierID)) return INVALID_MOVE;

  const dice = G.dice[diceID];
  if (dice !== null) {
    removeCard(G.players[playerID].hand, modifierID);
    dice.modifier += modifier;
  } else return INVALID_MOVE;
};

export const SummonHero: Move<GameState> = (
  { G, playerID },
  heroID: string
): typeof INVALID_MOVE | void => {
  if (G.board[playerID].heroCards.length === 5) return INVALID_MOVE;
  if (!includesID(G.players[playerID].hand, heroID)) return INVALID_MOVE;

  const hero = removeCard(G.players[playerID].hand, heroID);

  if (hero.type !== CardType.Hero) return INVALID_MOVE;
  // add to board
  G.board[playerID].heroCards.push(hero as HeroCard);
  // update classes obj
  G.board[playerID].classes[(hero as HeroCard).class]++;
};

export const AddItem: Move<GameState> = (
  { G, playerID },
  heroID: string,
  itemID: string
): typeof INVALID_MOVE | void => {
  if (!includesID(G.board[playerID].heroCards, heroID)) return INVALID_MOVE;
  if (!includesID(G.players[playerID].hand, itemID)) return INVALID_MOVE;

  const itemCard = removeCard(G.players[playerID].hand, itemID) as ItemCard;

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
};

export const DestroyHero: Move<GameState> = (
  { G, playerID },
  heroID: string
): typeof INVALID_MOVE | void => {
  if (!includesID(G.board[playerID].heroCards, heroID)) return INVALID_MOVE;

  const heroCard = removeCard(G.board[playerID].heroCards, heroID) as HeroCard;

  if (heroCard.items) {
    for (let i = 0; i < heroCard.items.length; i++) {
      G.mainDeck.discardPile.push(heroCard.items[i]);
    }
  }
  G.mainDeck.discardPile.push(heroCard);
};

export const StealCard: Move<GameState> = {
  move: (
    { G, ctx, playerID },
    enemyID: string,
    heroID: string
  ): typeof INVALID_MOVE | void => {
    if (Number(enemyID) + 1 > ctx.numPlayers) return INVALID_MOVE;
    if (!includesID(G.board[enemyID].heroCards, heroID)) return INVALID_MOVE;

    const hero = removeCard(G.board[enemyID].heroCards, heroID) as HeroCard;

    if (G.board[playerID].heroCards.length === 5) return INVALID_MOVE;

    G.board[playerID].heroCards.push(hero);

    G.board[enemyID].classes[hero.class]--;
    G.board[playerID].classes[hero.class]++;
  },
  client: false
};

export const TakeFromHand: Move<GameState> = {
  move: ({ G, playerID }, enemyID, cardID): typeof INVALID_MOVE | void => {
    if (!includesID(G.players[enemyID].hand, cardID)) return INVALID_MOVE;

    const card = removeCard(G.players[enemyID].hand, cardID);
    G.players[playerID].hand.push(card);
  },
  client: false
};

export const SwapHeroes: Move<GameState> = (
  { G, ctx, playerID },
  playerCardID,
  enemyID,
  enemyCardID
): typeof INVALID_MOVE | void => {
  if (Number(enemyID) >= ctx.numPlayers) return INVALID_MOVE;
  if (!includesID(G.board[playerID].heroCards, playerCardID))
    return INVALID_MOVE;
  if (!includesID(G.board[enemyID].heroCards, enemyCardID)) return INVALID_MOVE;

  const playerCard = removeCard(
    G.board[playerID].heroCards,
    playerCardID
  ) as HeroCard;
  const enemyCard = removeCard(
    G.board[enemyID].heroCards,
    enemyCardID
  ) as HeroCard;

  G.board[playerID].heroCards.push(enemyCard);
  G.board[enemyID].heroCards.push(playerCard);

  // update classes obj
  G.board[playerID].classes[playerCard.class]--;
  G.board[playerID].classes[enemyCard.class]++;
  G.board[enemyID].classes[enemyCard.class]--;
  G.board[enemyID].classes[playerCard.class]++;
};

export const SlayMonster: Move<GameState> = (
  { G, playerID },
  monsterID: string
): typeof INVALID_MOVE | void => {
  const monsterIndex = G.mainDeck.monsters.findIndex(
    value => value.id === monsterID
  );

  if (monsterIndex === undefined || monsterIndex === -1) return INVALID_MOVE;

  const monster = G.mainDeck.monsters[monsterIndex];
  G.board[playerID].largeCards.push(monster);

  const newMonster = G.mainDeck.monsterPile.pop() as MonsterCard;
  G.mainDeck.monsters[monsterIndex] = newMonster;
};

export const RevealCard: Move<GameState> = {
  move: ({ G, ctx, playerID }, cardID: string): typeof INVALID_MOVE | void => {
    if (!includesID(G.players[playerID].hand, cardID)) return INVALID_MOVE;

    const card = G.players[playerID].hand.find(
      value => value.id === cardID
    ) as AnyCard;

    for (let i = 0; i < ctx.numPlayers; i++) {
      G.players[String(i)].knownSecrets.push(card);
    }
  },
  client: false
};

export const PeekHand: Move<GameState> = {
  move: ({ G, ctx, playerID }, enemyID: string): typeof INVALID_MOVE | void => {
    if (Number(enemyID) >= ctx.numPlayers) return INVALID_MOVE;

    const hand = G.players[enemyID].hand;

    G.players[playerID].knownSecrets.concat(hand);
  },
  client: false
};

export const RemoveSecrets: Move<GameState> = ({ G, playerID }) => {
  G.players[playerID].knownSecrets = [];
};

export const PrepareCard: Move<GameState> = (
  { G, playerID },
  cardID
): typeof INVALID_MOVE | void => {
  if (!includesID(G.players[playerID].hand, cardID)) return INVALID_MOVE;

  const card = removeCard(G.players[playerID].hand, cardID) as
    | HeroCard
    | ItemCard
    | MagicCard;

  if (!G.mainDeck.preparedCard) {
    G.mainDeck.preparedCard = {
      card: card,
      successful: null
    };
    return;
  }
  G.mainDeck.preparedCard.card = card;
};

export const UnprepareCard: Move<GameState> = ({ G }) => {
  G.mainDeck.preparedCard = undefined;
};

export const ChallengeCard: Move<GameState> = (
  { G },
  cardID: string
): typeof INVALID_MOVE | void => {
  if (!G.mainDeck.preparedCard) return INVALID_MOVE;
  if (G.mainDeck.preparedCard.card.id !== cardID) return INVALID_MOVE;
  if (!G.dice[1] || !G.dice[2]) return INVALID_MOVE;

  const roll1 = G.dice[1].roll[0] + G.dice[1].roll[1] + G.dice[1].modifier; // attacker
  const roll2 = G.dice[2].roll[0] + G.dice[2].roll[1] + G.dice[2].modifier; // defender
  if (roll1 >= roll2) G.mainDeck.preparedCard.successful = false;
  if (roll1 < roll2) G.mainDeck.preparedCard.successful = true;
};

export const PlayStage = {
  SummonHero,
  AddItem,
  DestroyHero,
  DrawFromDiscardPile,
  RollDice,
  ClearDice,
  Discard,
  StealCard,
  TakeFromHand,
  SwapHeroes,
  SlayMonster,
  RevealCard,
  PeekHand,
  RemoveSecrets,
  PrepareCard,
  UnprepareCard
};

export const moves = {
  ...PlayStage,
  DrawCard,
  ChallengeCard,
  ModifyDice
};
