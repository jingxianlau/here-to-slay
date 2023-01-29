// apparently you only need the move name to send the req to the server
export const DrawCard = () => {};
export const SummonHero = () => {};
export const AddItem = () => {};
export const DestroyHero = () => {};
export const DrawFromDiscardPile = () => {};
export const RollDice = () => {};
export const ClearDice = () => {};
export const ModifyDice = () => {};
export const Discard = () => {};
export const StealCard = () => {};
export const TakeFromHand = () => {};
export const SwapHeroes = () => {};
export const SlayMonster = () => {};
export const RevealCard = () => {};
export const PeekHand = () => {};
export const RemoveSecrets = () => {};
export const ChallengeCard = () => {};
export const PrepareCard = () => {};
export const UnprepareCard = () => {};

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
