type PlayerAction = 'idle' | 'walk';
type PlayerDirection = 'top' | 'bottom' | 'left' | 'right';

export interface Player {
  id: string;
  position: { x: number; y: number };
  action: PlayerAction;
  direction: PlayerDirection;
  username: string;
}
