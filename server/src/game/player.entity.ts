type PlayerAction = 'idle' | 'walk' | 'attack' | 'damage';
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
  health: number;
  username: string;
}

export interface PlayerPayload {
  id: string;
  position: { x: number; y: number };
  action: PlayerAction;
  direction: PlayerDirection;
  velocity: number;
  username: string;
}

export interface Attack {
  playerId: string;
  damage: number;
}
