// card function interfaces
type heroAbility = (roll: number) => void;
type passiveAbility = [() => void, () => void]; // [requirement comparer, effect]
type effect = () => void;

// card functions
export const cardFunctions = {};
