export type PlayerAction = 'idle' | 'walk' | 'attack' | 'damage'
export type PlayerDirection = 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export interface PlayerPayload {
  id: string
  position: { x: number; y: number }
  action: PlayerAction
  direction: PlayerDirection
  velocity: number
  username: string
}

export interface AttackPayload {
  playerId: string
  damage: any
}
