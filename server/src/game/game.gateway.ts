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

@WebSocketGateway(80, { cors: { origin: '*' } })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  socket: Socket;

  players: Player[] = [];

  @SubscribeMessage('player:movement')
  handleMessage(client: any, payload: Omit<Player, 'username'>): void {
    const playerWhoMoves = this.players.find((x) => x.id === payload.id);
    if (!playerWhoMoves) return;
    playerWhoMoves.position.x = payload.position.x;
    playerWhoMoves.position.y = payload.position.y;
    playerWhoMoves.direction = payload.direction;
    playerWhoMoves.action = payload.action;
    client.broadcast.emit('player:movement', payload);
    console.log(payload);
  }

  @SubscribeMessage('init')
  handleInit(client: any, payload: Player): void {
    const player: Player = payload;
    client.emit('init', this.players);

    this.players.push(player);
    client.broadcast.emit('user_connection', player);
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
    client.broadcast.emit('user_disconnection', client.id);
  }
}
