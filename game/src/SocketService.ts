import { Socket, io } from 'socket.io-client'
import Singleton from './core/Singleton'
import { EVENTS } from './constants/events'
import { ServerPlayer } from './types'

class SocketService extends Singleton {
  protected static _instance: SocketService
  protected static _class: typeof SocketService = SocketService

  private socket: Socket = io('http://192.168.10.82:80')

  get socketId() {
    return this.socket.id
  }

  emitInit(player: ServerPlayer) {
    this.socket.emit(EVENTS.GAME_INIT, player)
  }

  emitPlayerMovement(player: Omit<ServerPlayer, 'username'>) {
    this.socket.emit(EVENTS.PLAYER_MOVEMENT, player)
  }

  onSocketConnect(callback: () => void) {
    this.socket.on(EVENTS.SOCKET_CONNECT, callback)
    //if (this.socket.connected) callback()
  }

  onPlayerMovement(callback: (player: ServerPlayer) => void) {
    this.socket.on(EVENTS.PLAYER_MOVEMENT, callback)
  }

  onPlayerConnection(callback: (player: ServerPlayer) => void) {
    this.socket.on(EVENTS.PLAYER_CONNECTION, callback)
  }

  onPlayerDisconnection(callback: (player: string) => void) {
    this.socket.on(EVENTS.PLAYER_DISCONNECTION, callback)
  }

  onGameInit(callback: (players: ServerPlayer[]) => void) {
    this.socket.on(EVENTS.GAME_INIT, callback)
  }
}

export default SocketService
