type PlayerAction = 'idle' | 'walk';
type PlayerDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right';

export interface Player {
  id: string;
  position: { x: number; y: number };
  action: PlayerAction;
  direction: PlayerDirection;
  username: string;
}
