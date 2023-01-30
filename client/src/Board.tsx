import { BoardProps } from 'boardgame.io/react';
import './css/game.css';
import { GameState } from './types';

interface HereToSlayBoardProps extends BoardProps<GameState> {}

const HereToSlayBoard: React.FC<HereToSlayBoardProps> = ({ ctx, G, moves }) => {
  return <div></div>;
};

export default HereToSlayBoard;
