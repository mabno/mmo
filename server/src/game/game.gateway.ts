import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Attack, Player, PlayerPayload } from './player.entity';

export const EVENTS = {
  SOCKET_CONNECT: 'connect',
  GAME_INIT: 'game:init',
  PLAYER_CONNECTION: 'player:connection',
  PLAYER_DISCONNECTION: 'player:disconnection',
  PLAYER_MOVEMENT: 'player:movement',
  PLAYER_ATTACK: 'player:attack',
};

@WebSocketGateway(80, { cors: { origin: '*' } })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  socket: Socket;

  players: Player[] = [];

  @SubscribeMessage(EVENTS.PLAYER_MOVEMENT)
  handleMovement(client: any, payload: Omit<PlayerPayload, 'username'>): void {
    const playerWhoMoves = this.players.find((x) => x.id === payload.id);
    if (!playerWhoMoves) return;
    playerWhoMoves.position.x = payload.position.x;
    playerWhoMoves.position.y = payload.position.y;
    playerWhoMoves.direction = payload.direction;
    playerWhoMoves.action = payload.action;
    client.broadcast.emit(EVENTS.PLAYER_MOVEMENT, payload);
    // console.log(payload);
  }

  @SubscribeMessage(EVENTS.PLAYER_ATTACK)
  handleAttack(client: any, payload: Attack): void {
    const playerWhoAttacks = this.players.find(
      (x) => x.id === payload.playerId,
    );
    if (!playerWhoAttacks) return;
    const playersAttacked = this.players.filter((player) => {
      const distance = Math.sqrt(
        (player.position.x - playerWhoAttacks.position.x) ** 2 +
          (player.position.y - playerWhoAttacks.position.y) ** 2,
      );
      return distance <= 64 && player.id !== payload.playerId;
    });

    playersAttacked.forEach((player) => {
      player.health -= payload.damage;
      client.broadcast.emit(EVENTS.PLAYER_ATTACK, {
        playerId: player.id,
        damage: payload.damage,
      });

      if (player.health <= 0) {
        this.players = this.players.filter((x) => x.id !== player.id);
        client.broadcast.emit(EVENTS.PLAYER_DISCONNECTION, player.id);
      }
    });
  }
  d;
  @SubscribeMessage(EVENTS.GAME_INIT)
  handleInit(client: any, payload: PlayerPayload): void {
    const player: Player = {
      ...payload,
      health: 100,
    };
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
    this.socket.emit(EVENTS.PLAYER_DISCONNECTION, client.id);
  }
}
