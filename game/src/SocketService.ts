import { Socket, io } from 'socket.io-client'
import Singleton from './core/Singleton'
import { EVENTS } from './constants/events'
import { PlayerPayload, AttackPayload } from './types'

class SocketService extends Singleton {
  protected static _instance: SocketService
  protected static _class: typeof SocketService = SocketService

  private socket: Socket = io('http://localhost:80')

  get socketId() {
    return this.socket.id
  }

  emitInit(player: PlayerPayload) {
    this.socket.emit(EVENTS.GAME_INIT, player)
  }

  emitPlayerMovement(player: Omit<PlayerPayload, 'username'>) {
    this.socket.emit(EVENTS.PLAYER_MOVEMENT, player)
  }

  emitPlayerAttack(attack: AttackPayload) {
    this.socket.emit(EVENTS.PLAYER_ATTACK, attack)
  }

  onSocketConnect(callback: () => void) {
    this.socket.on(EVENTS.SOCKET_CONNECT, callback)
    if (this.socket.connected) callback()
  }

  onPlayerMovement(callback: (player: PlayerPayload) => void) {
    this.socket.on(EVENTS.PLAYER_MOVEMENT, callback)
  }

  onPlayerAttack(callback: (player: AttackPayload) => void) {
    this.socket.on(EVENTS.PLAYER_ATTACK, callback)
  }

  onPlayerConnection(callback: (player: PlayerPayload) => void) {
    this.socket.on(EVENTS.PLAYER_CONNECTION, callback)
  }

  onPlayerDisconnection(callback: (player: string) => void) {
    this.socket.on(EVENTS.PLAYER_DISCONNECTION, callback)
  }

  onGameInit(callback: (players: PlayerPayload[]) => void) {
    this.socket.on(EVENTS.GAME_INIT, callback)
  }
}

export default SocketService
