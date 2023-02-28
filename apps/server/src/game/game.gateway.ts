import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  CreateRoomPayload,
  CreateRoomResponse,
  GetRoomPlayersPayload,
  GetWaitingRoomInfoResponse,
  JoinRoomPayload,
  JoinRoomResponse,
  SocketResponse,
} from './dto/gateway-dt';
import { GameService } from './game.service';
import { Card, Judge, MemeCard, PhraseCard, Room } from './types';
import { MemeService } from '../meme/meme.service';
import { PhraseToAnswerService } from '../phrase-to-answer/phrase-to-answer.service';
import { StartGamePayload } from './dto/gateway-dt';
import {
  handleSocketResponse,
  getTotalCardsToPlayers,
  fillCards,
  dataToCards,
} from './game.utils';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import {
  CREATE_ROOM,
  CREATOR_FINISH_GAME,
  GET_ROOM_INFO,
  GET_WAITING_ROOM_INFO,
  JOIN_ROOM,
  LEAVE_ROOM,
  RECONNECT,
  SET_CARD,
  SET_WINNER_CARD,
  START_GAME,
} from './paths';
import { customAlphabet } from 'nanoid';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('GameGateway');

  constructor(
    private readonly redisService: GameService,
    private readonly memeService: MemeService,
    private readonly phraseToAnswerService: PhraseToAnswerService,
    @InjectSentry() private readonly sentry: SentryService
  ) {}

  // overrides
  afterInit() {
    this.logger.log('Init sockets');
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(CREATE_ROOM)
  async handleCreateRoom(
    client: Socket,
    payload: CreateRoomPayload
  ): Promise<SocketResponse<CreateRoomResponse>> {
    try {
      const { username } = payload;

      const nanoid = customAlphabet('1234567890');
      const roomCode = nanoid(6);

      await this.redisService.createRoom({
        roomCode,
        username,
        socketId: client.id,
      });

      client.join(roomCode);

      return handleSocketResponse({
        data: {
          username,
          roomCode,
        },
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: CREATE_ROOM,
          clientId: client.id,
          payload,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage(JOIN_ROOM)
  async handleJoinRoom(
    client: Socket,
    payload: JoinRoomPayload
  ): Promise<SocketResponse<JoinRoomResponse>> {
    let decodedRoom: Room;
    try {
      const { roomCode, username } = payload;

      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: "Room doesn't exist",
          error: true,
        });
      }

      decodedRoom = JSON.parse(room);

      if (decodedRoom.isStarted) {
        return handleSocketResponse({
          message: 'Room already started',
          error: true,
        });
      }

      const alreadyUsername = decodedRoom.players.some(
        (p) => p.username === username
      );

      if (alreadyUsername) {
        return handleSocketResponse({
          message: 'Username already taken',
          error: true,
        });
      }

      await this.redisService.joinRoom({
        username,
        roomCode,
        room,
        socketId: client.id,
      });

      client.in(roomCode).emit('join-player', { username });

      client.join(roomCode);

      return handleSocketResponse({
        message: 'ok',
        data: {
          username,
          roomCode,
        },
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: JOIN_ROOM,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage(GET_WAITING_ROOM_INFO)
  async handleGetWaitingRoomInfo(
    client: Socket,
    payload: GetRoomPlayersPayload
  ): Promise<SocketResponse<any>> {
    let decodedRoom: Room;
    try {
      const { roomCode, username } = payload;

      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: "Room doesn't exist",
          error: true,
        });
      }

      decodedRoom = JSON.parse(room);

      const isUserInGame = decodedRoom.players.some(
        (p) => p.username === username
      );

      if (!isUserInGame) {
        return handleSocketResponse({
          message: 'Invalid room',
          error: true,
        });
      }

      const isRoomCreator = decodedRoom.roomCreator === username;

      const usernamePlayers = decodedRoom.players.map((p) => ({
        username: p.username,
      }));

      return handleSocketResponse({
        message: 'ok',
        data: {
          isRoomCreator,
          players: usernamePlayers,
        },
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: GET_WAITING_ROOM_INFO,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage(LEAVE_ROOM)
  async handleLeaveRoom(client: Socket, payload: any) {
    let decodedRoom: Room;
    try {
      const { roomCode, username } = payload;

      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: 'room not found',
          error: true,
        });
      }

      decodedRoom = JSON.parse(room);

      const playerIndex = decodedRoom.players.findIndex(
        (player) => player.username === username
      );

      if (playerIndex === -1) {
        return handleSocketResponse({
          message: 'player not found',
          error: true,
        });
      }

      const removedPlayer = decodedRoom.players.splice(
        playerIndex,
        playerIndex
      );

      await this.redisService.updateRoom({
        roomCode,
        room: decodedRoom,
      });

      this.server.in(roomCode).emit('player-leaves', {
        username: removedPlayer[0].username,
      });

      return handleSocketResponse({
        message: 'ok',
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: LEAVE_ROOM,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage(START_GAME)
  async handleStartGame(
    client: Socket,
    payload: StartGamePayload
  ): Promise<SocketResponse<null>> {
    let decodedRoom: Room;
    try {
      const { roomCode, roomConfig } = payload;

      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: 'room not found',
          error: true,
        });
      }

      decodedRoom = JSON.parse(room);

      const playerSocketId = client.id;

      const players = decodedRoom.players;

      const playerInfoIndex = decodedRoom.players.findIndex(
        (p) => p.socketId === playerSocketId
      );

      if (players[playerInfoIndex]?.username !== decodedRoom.roomCreator) {
        return handleSocketResponse({
          message: `you can\'t start the game`,
          error: true,
        });
      }

      if (decodedRoom.players.length < 3) {
        return handleSocketResponse({
          message: `At least three players are required to start`,
          error: true,
        });
      }

      const { totalJudgeCards, totalPlayersCards } = getTotalCardsToPlayers({
        rounds: roomConfig.totalRounds,
        players: players.length,
        cardsPerPlayer: 7,
      });

      // load cards to judge

      const mainCardIsMeme = roomConfig.gameMode === 'mm';

      const numberOfMemesToBeSearched = mainCardIsMeme
        ? totalJudgeCards
        : totalPlayersCards;
      const numberOfPhrasesToBeSearched = mainCardIsMeme
        ? totalPlayersCards
        : totalJudgeCards;

      const memes = await this.memeService.getRandomBySize(
        numberOfMemesToBeSearched
      );

      // load card to players
      const phrases = await this.phraseToAnswerService.getRandomBySize(
        numberOfPhrasesToBeSearched
      );

      const memesCards = dataToCards(memes, 'memes');
      const phrasesCards = dataToCards(phrases, 'phrases');

      const judgeCards: Card[] = mainCardIsMeme ? memesCards : phrasesCards;
      const playerCards: Card[] = !mainCardIsMeme ? memesCards : phrasesCards;

      // get random judge
      const randomPlayerIndex = Math.floor(
        Math.random() * decodedRoom.players.length
      );

      const judge: Judge = {
        card: judgeCards[0],
        username: decodedRoom.players[randomPlayerIndex].username,
        receivedCards: [],
      };

      const { filledCards, needRefill } = fillCards({
        totalPlayersCards,
        playerCards,
      });

      const copyFilledCards = [...filledCards];
      // set players cards
      decodedRoom.players.forEach((player) => {
        let totalCards = 0;
        while (totalCards < 7) {
          const randomCardIndex = Math.floor(
            Math.random() * filledCards.length
          );

          if (!player.cards.some((c) => c === filledCards[randomCardIndex])) {
            const card = filledCards.splice(randomCardIndex, 1)[0];

            player.cards.push(card);
            totalCards++;
          }
        }
      });

      decodedRoom = {
        ...decodedRoom,
        config: roomConfig,
        isStarted: true,
        judge,
        playerCards: needRefill ? copyFilledCards : filledCards,
        judgeCards,
      };

      // modify game
      await this.redisService.updateRoom({ roomCode, room: decodedRoom });

      this.server.in(roomCode).emit('move-to-game', null);

      return handleSocketResponse({
        message: 'ok',
        data: null,
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: START_GAME,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage(GET_ROOM_INFO)
  async handleGetRoomInfo(
    client: Socket,
    payload: any
  ): Promise<SocketResponse<any>> {
    let decodedRoom: Room;
    try {
      const { roomCode, username } = payload;

      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: 'room not found',
          error: true,
        });
      }

      decodedRoom = JSON.parse(room);

      const playerIndex = decodedRoom.players.findIndex(
        (player) => player.username === username
      );

      if (playerIndex === -1) {
        return handleSocketResponse({
          message: 'Player not found',
          error: true,
        });
      }

      const players = decodedRoom.players.map((player) => ({
        username: player.username,
        numberOfWins: player.numberOfWins,
      }));

      const judge = {
        username: decodedRoom.judge?.username,
        card: decodedRoom.judge?.card,
      };

      const cardsToSelect = decodedRoom.players[playerIndex].cards;

      const isJudge = judge.username === username;

      const receivedCards = isJudge ? decodedRoom.judge.receivedCards : [];
      const waitingForJudge =
        decodedRoom.judge.receivedCards.length ===
        decodedRoom.players.length - 1;
      const round = decodedRoom.round;
      const config = decodedRoom.config;

      return handleSocketResponse({
        message: 'ok',
        data: {
          players,
          cardsToSelect,
          judge,
          playerCards: receivedCards,
          waitingForJudge,
          round,
          config,
          roomCreator: decodedRoom.roomCreator,
        },
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: GET_ROOM_INFO,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage(SET_CARD)
  async handleSetCard(
    client: Socket,
    payload: any
  ): Promise<SocketResponse<null>> {
    let decodedRoom: Room;
    try {
      const { roomCode, username, card } = payload;
      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: 'room not found',
          error: true,
        });
      }

      decodedRoom = JSON.parse(room);

      const userIsJudge = decodedRoom.judge.username === username;

      if (userIsJudge) {
        return handleSocketResponse({
          message: 'you are the judge',
          error: true,
        });
      }

      const userAlreadyPlay = decodedRoom.judge.receivedCards.some(
        (p) => p.username === username
      );

      if (userAlreadyPlay) {
        return {
          message: 'you already play',
          error: true,
        };
      }

      const playerIndex = decodedRoom.players.findIndex(
        (p) => p.username === username
      );

      if (playerIndex > -1) {
        const cardIndex = decodedRoom.players[playerIndex].cards.findIndex(
          (c) => {
            if (c.type === 'MEME') {
              return c.url === (card as MemeCard).url;
            }

            if (c.type === 'PHRASE') {
              return c.content === (card as PhraseCard).content;
            }
          }
        );

        if (cardIndex > -1) {
          decodedRoom.players[playerIndex].cards.splice(cardIndex, 1);
        }
      }

      client.broadcast.to(roomCode).emit('player-set-card', username);

      decodedRoom.judge.receivedCards.push({
        username,
        card,
      });

      const isRoundOver =
        decodedRoom.judge.receivedCards.length ===
        decodedRoom.players.length - 1;

      if (isRoundOver) {
        // send socket to all partcipants, the judge have to take the winner
        this.server.to(roomCode).emit('all-players-ready');

        const judgeIndex = decodedRoom.players.findIndex(
          (p) => p.username === decodedRoom.judge.username
        );

        if (judgeIndex > -1) {
          const judgeSocket = decodedRoom.players[judgeIndex].socketId;
          client
            .to(judgeSocket)
            .emit('select-judge-card', decodedRoom.judge.receivedCards);
        }
      }

      await this.redisService.updateRoom({
        roomCode,
        room: decodedRoom,
      });

      return handleSocketResponse({
        message: 'ok',
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: SET_CARD,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage('set-winner-card')
  async handleSetWinnerCard(
    client: Socket,
    payload: any
  ): Promise<SocketResponse<any>> {
    let decodedRoom: Room;
    try {
      const { roomCode, username, card } = payload;
      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: 'room not found',
          error: true,
        });
      }

      decodedRoom = JSON.parse(room);

      const userIsJudge = decodedRoom.judge.username === username;

      if (!userIsJudge) {
        return handleSocketResponse({
          message: 'you are not the judge',
          error: true,
        });
      }

      const winnerPlayer = card.username;

      const winnerPlayerIndex = decodedRoom.players.findIndex(
        (p) => p.username === card.username
      );

      this.server.to(roomCode).emit('winner-card', winnerPlayer);

      decodedRoom.players[winnerPlayerIndex].numberOfWins += 1;
      decodedRoom.round += 1;

      if (decodedRoom.round > decodedRoom.config.totalRounds) {
        this.logger.debug('*** GAME ENDED ***');
        // winner
        const maxWins = Math.max(
          ...decodedRoom.players.map((p) => p.numberOfWins)
        );
        const index = decodedRoom.players.findIndex(
          (p) => p.numberOfWins === maxWins
        );
        decodedRoom.winner = decodedRoom.players[index].username;

        client.broadcast.to(roomCode).emit('end-game', winnerPlayer);
        client.emit('end-game', winnerPlayer);

        this.redisService.deleteRoom(roomCode);

        return handleSocketResponse({
          message: 'ok',
        });
      }

      // set new judge
      const judgeIndex = decodedRoom.players.findIndex(
        (p) => p.username === decodedRoom.judge.username
      );

      const nextJudgeIndex =
        judgeIndex + 1 === decodedRoom.players.length ? 0 : judgeIndex + 1;

      decodedRoom.judgeCards.shift();

      const newJudge: Judge = {
        card: decodedRoom.judgeCards[0],
        receivedCards: [],
        username: decodedRoom.players[nextJudgeIndex].username,
      };

      const oldJudge = decodedRoom.judge;

      decodedRoom.judge = newJudge;

      for (const [index, player] of decodedRoom.players.entries()) {
        if (player.username !== oldJudge.username) {
          let cardSetted = false;

          while (!cardSetted) {
            const randomCardIndex = Math.floor(
              Math.random() * decodedRoom.playerCards.length
            );

            if (
              !player.cards.some(
                (c) => c === decodedRoom.playerCards[randomCardIndex]
              )
            ) {
              const card = decodedRoom.playerCards.splice(
                randomCardIndex,
                1
              )[0];

              decodedRoom.players[index].cards.push(card);
              client.in(player.socketId).emit('new-card', {
                card,
              });
              cardSetted = true;
            }
          }
        }
      }

      await this.redisService.updateRoom({
        roomCode,
        room: decodedRoom,
      });

      client.in(roomCode).emit('next-round', {
        judge: {
          username: decodedRoom.judge.username,
          card: decodedRoom.judge.card,
        },
      });

      client.emit('next-round', {
        judge: {
          username: decodedRoom.judge.username,
          card: decodedRoom.judge.card,
        },
      });

      return handleSocketResponse({
        message: 'ok',
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: SET_WINNER_CARD,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage(CREATOR_FINISH_GAME)
  async handleFinishGame(
    client: Socket,
    payload: any
  ): Promise<SocketResponse<any>> {
    let decodedRoom: Room;
    try {
      const { roomCode, username } = payload;
      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: 'room not found',
          error: true,
        });
      }

      const decodedRoom: Room = JSON.parse(room);

      const userIsCreator = decodedRoom.roomCreator === username;

      if (!userIsCreator) {
        return handleSocketResponse({
          message: 'you are not the room creator',
          error: true,
        });
      }

      await this.redisService.deleteRoom(roomCode);

      this.server.in(roomCode).emit('finish-game');

      return handleSocketResponse({
        message: 'ok',
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: CREATOR_FINISH_GAME,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }

  @SubscribeMessage(RECONNECT)
  async handleReconnect(
    client: Socket,
    payload: any
  ): Promise<SocketResponse<any>> {
    let decodedRoom: Room;
    try {
      const { username, roomCode } = payload;

      const room = await this.redisService.getRoomByKey(roomCode);

      if (!room) {
        return handleSocketResponse({
          message: 'ok',
          data: {
            room: null,
          },
        });
      }

      decodedRoom = JSON.parse(room);

      const playerIndex = decodedRoom.players.findIndex(
        (player) => player.username === username
      );
      const isPlayerInRoom = playerIndex > -1;

      if (!isPlayerInRoom) {
        return handleSocketResponse({
          message: 'ok',
          data: {
            room: null,
          },
        });
      }

      return handleSocketResponse({
        message: 'ok',
        data: {
          room: {
            isStarted: decodedRoom.isStarted,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      this.sentry.instance().captureException(error, (scope) => {
        scope.setExtras({
          path: RECONNECT,
          clientId: client.id,
          payload,
          decodedRoom,
        });
        return scope;
      });
      return handleSocketResponse({
        message: 'server error',
        error: true,
      });
    }
  }
}
