import { Inject, Injectable } from '@nestjs/common';
import { Room } from 'wdyc-interfaces';
import Redis from 'ioredis';
import {
  CreateRoomServiceProps,
  JoinRoomServiceProps,
  UpdateRoomServiceProps,
} from './dto/gameServices-dto';
import { IORedisKey } from './redis.module';

@Injectable()
export class GameService {
  constructor(@Inject(IORedisKey) private readonly redisClient: Redis) {}

  async getRoomByKey(key: string) {
    return await this.redisClient.get(key);
  }

  async createRoom({
    roomCode,
    username,
    avatar,
    socketId,
  }: CreateRoomServiceProps) {
    const room: Room = {
      roomCreator: username,
      config: {
        totalRounds: 0,
        gameMode: '',
      },
      round: 1,
      playerCards: [],
      judgeCards: [],
      judge: {
        card: {
          url: '',
          imageOrientation: '',
        },
        username: '',
        receivedCards: [],
      },
      winner: '',
      players: [
        {
          username,
          numberOfWins: 0,
          cards: [],
          socketId,
          avatar,
        },
      ],
      isStarted: false,
      isEnded: false,
    };

    await this.redisClient.set(roomCode, JSON.stringify(room));
  }

  async joinRoom({
    roomCode,
    username,
    room,
    socketId,
    avatar,
  }: JoinRoomServiceProps) {
    const jsonRoom = JSON.parse(room);

    await this.redisClient.set(
      roomCode,
      JSON.stringify({
        ...jsonRoom,
        players: [
          ...jsonRoom.players,
          {
            username,
            numberOfWins: 0,
            cards: [],
            socketId,
            avatar,
          },
        ],
      }),
    );
  }

  async updateRoom({ roomCode, room }: UpdateRoomServiceProps) {
    await this.redisClient.set(roomCode, JSON.stringify(room));
  }

  async deleteRoom(roomCode: string) {
    await this.redisClient.del(roomCode);
  }
}
