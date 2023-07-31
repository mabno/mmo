import { Vector2D } from '../core/interfaces'

export const WALK_VELOCITY = 96
export const SPRINT_VELOCITY = 160
export const TARGET_VELOCITY = 32
export const STAMINA_REGENERATION = 1
export const STAMINA_DEPLETION = 5

export const ANGLE_DIRECTION: Record<number, string> = {
  360: 'right',
  315: 'top-right',
  270: 'top',
  225: 'top-left',
  180: 'left',
  135: 'bottom-left',
  90: 'bottom',
  45: 'bottom-right',
  0: 'right',
}

export const DIRECTION_MOVEMENT: Record<string, Vector2D> = {
  right: { x: 1, y: 0 },
  'top-right': { x: 1, y: -1 },
  top: { x: 0, y: -1 },
  'top-left': { x: -1, y: -1 },
  left: { x: -1, y: 0 },
  'bottom-left': { x: -1, y: 1 },
  bottom: { x: 0, y: 1 },
  'bottom-right': { x: 1, y: 1 },
}
