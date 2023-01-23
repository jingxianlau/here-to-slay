enum HeroClass {
  Fighter = 'FIGHTER',
  Bard = 'BARD',
  Guardian = 'GUARDIAN',
  Ranger = 'RANGER',
  Thief = 'THIEF',
  Wizard = 'WIZARD'
}

enum CardType {
  Modifier = 'MODIFIER',
  Challenge = 'CHALLENGE',
  Hero = 'HERO',
  Large = 'LARGE',
  Magic = 'MAGIC',
  Item = 'ITEM'
}

export interface Card {
  player: number;
  name: string;
  type: CardType;
  id: number;
}
export interface HeroCard extends Card {
  type: CardType.Hero;
  class: HeroClass;
}
export interface ChallengeCard extends Card {
  type: CardType.Challenge;
  upgraded: boolean;
  upgradeRequirement?: HeroClass;
}
export interface ModifierCard extends Card {
  type: CardType.Modifier;
  modifier: number;
  diceId: 1 | 2;
}
export interface ItemCard extends Card {
  type: CardType.Item;
  heroId: number;
}
export interface MagicCard extends Card {
  type: CardType.Magic;
}
export interface MonsterCard extends Card {
  type: CardType.Large;
}
export interface LeaderCard extends MonsterCard {
  type: CardType.Large;
  class: HeroClass;
}

export type LargeCard = LeaderCard | MonsterCard;

export interface GameState {
  dice: { d1: [number, number]; d2: [number, number] } | null;
  players: {
    [key: number]: [Card];
  } | null;
  board: {
    [key: number]: {
      heroCards: [
        HeroCard | null,
        HeroCard | null,
        HeroCard | null,
        HeroCard | null,
        HeroCard | null
      ];
      largeCards: [
        LargeCard | null,
        LargeCard | null,
        LargeCard | null,
        LargeCard | null
      ];
    };
    main: {
      deck: [Card];
      discardPile: [Card];
      monsterPile: [MonsterCard];
      monsters: [MonsterCard, MonsterCard, MonsterCard];
    };
  } | null;
}
