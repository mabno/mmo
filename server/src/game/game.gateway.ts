import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Player } from './player.entity';

export const EVENTS = {
  SOCKET_CONNECT: 'connect',
  GAME_INIT: 'game:init',
  PLAYER_CONNECTION: 'player:connection',
  PLAYER_DISCONNECTION: 'player:disconnection',
  PLAYER_MOVEMENT: 'player:movement',
};

@WebSocketGateway(80, { cors: { origin: '*' } })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  socket: Socket;

  players: Player[] = [];

  @SubscribeMessage(EVENTS.PLAYER_MOVEMENT)
  handleMessage(client: any, payload: Omit<Player, 'username'>): void {
    const playerWhoMoves = this.players.find((x) => x.id === payload.id);
    if (!playerWhoMoves) return;
    playerWhoMoves.position.x = payload.position.x;
    playerWhoMoves.position.y = payload.position.y;
    playerWhoMoves.direction = payload.direction;
    playerWhoMoves.action = payload.action;
    client.broadcast.emit(EVENTS.PLAYER_MOVEMENT, payload);
    console.log(payload);
  }

  @SubscribeMessage(EVENTS.GAME_INIT)
  handleInit(client: any, payload: Player): void {
    const player: Player = payload;
    client.emit(EVENTS.GAME_INIT, this.players);

    this.players.push(player);
    client.broadcast.emit(EVENTS.PLAYER_CONNECTION, player);
  }

  afterInit(server: any) {
    console.log('initialized');
  }

  handleConnection(client: Socket) {
    console.log('connected', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('disconnected', client.id);
    this.players = this.players.filter((player) => player.id !== client.id);
    client.broadcast.emit(EVENTS.PLAYER_DISCONNECTION, client.id);
  }
}
