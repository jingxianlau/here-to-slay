// apparently you only need the move name to send the req to the server
export const DrawCard = () => {};
export const SummonHero = () => {};
export const AddItem = () => {};
export const DestroyHero = () => {};
export const DrawFromDiscardPile = () => {};
export const RollDice = () => {};
export const ModifyDice = () => {};
export const Discard = () => {};
export const StealCard = () => {};
export const TakeFromHand = () => {};
export const SwapHeroes = () => {};
export const SlayMonster = () => {};
export const RevealCard = () => {};
export const PeekHand = () => {};
export const RemoveSecrets = () => {};

export const PlayStage = {
  SummonHero,
  AddItem,
  DestroyHero,
  DrawFromDiscardPile,
  RollDice,
  Discard,
  StealCard,
  TakeFromHand,
  SwapHeroes,
  SlayMonster,
  RevealCard,
  PeekHand,
  RemoveSecrets
};

export const moves = {
  ...PlayStage,
  DrawCard,
  ModifyDice
};
