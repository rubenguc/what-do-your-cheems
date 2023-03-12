import { Card, Player } from '@wdyc/game-interfaces';

export interface SocketResponse<T> {
  message: string;
  data?: T;
  error?: boolean;
}

// create room
export interface CreateRoomPayload {
  username: string;
}

export interface CreateRoomResponse {
  username: string;
  roomCode: string;
}

// join room
export interface JoinRoomPayload {
  username: string;
  roomCode: string;
}

export interface JoinRoomResponse {
  username: string;
  roomCode: string;
}

// get room players
export interface GetRoomPlayersPayload {
  username: string;
  roomCode: string;
}

export interface GetWaitingRoomInfoResponse {
  isRoomCreator: boolean;
  players: Player[];
}

// start game
interface RoomConfig {
  totalRounds: number;
  gameMode: string;
}

export interface StartGamePayload {
  roomCode: string;
  roomConfig: RoomConfig;
}

// get room info
export interface GetRoomInfoPayload {
  username: string;
  roomCode: string;
}

export interface GetRoomInfoResponse {
  players: { username: string; numberOfWins: number }[];
  cardsToSelect: string[];
  playerCards: Card[];
  waitingForJudge: boolean;
  judge: {
    username: string;
    card: Card;
  };
}
