import { ClientStateObj } from '../types';

export const popupHand = (
  showHand: ClientStateObj['showHand'],
  time = 1200
) => {
  showHand.set(true);
  showHand.setLocked(true);
  setTimeout(() => {
    showHand.set(false);
    showHand.setLocked(false);
  }, time);
};
