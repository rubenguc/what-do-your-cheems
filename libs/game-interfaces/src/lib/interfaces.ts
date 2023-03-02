interface CommonPayload {
  username: string;
  roomCode: string;
}

interface CommonResponse {
  username: string;
  roomCode: string;
}

export interface RoomConfig {
  totalRounds: number;
  gameMode: string;
}

export interface PhraseCard {
  type: 'PHRASE';
  content: string;
}

export interface MemeCard {
  type: 'MEME';
  url: string;
  imageOrientation: string;
}

export type Card = PhraseCard | MemeCard;

export interface ReceiveCard {
  username: string;
  card: Card;
}

export interface Player {
  username: string;
  numberOfWins: number;
  cards: Card[];
  socketId: string;
}

export interface Room {
  roomCreator: string;
  config: RoomConfig;
  round: number;
  playerCards: Card[];
  judgeCards: Card[];
  judge: Judge;
  winner: string;
  players: Player[];
  isStarted: boolean;
}

export interface Judge {
  card: any;
  username: string;
  receivedCards: ReceiveCard[];
}

// Socket interfaces

export interface SocketResponse<T> {
  message: string;
  data?: T;
  error?: boolean;
}

// Create Room

export type CreateRoomPayload = CommonPayload;
export type CreateRoomResponse = SocketResponse<CommonResponse>;

// Join Room

export type JoinRoomPayload = CommonPayload;
export type JoinRoomResponse = SocketResponse<CommonResponse>;

// Get Room Players

export type GetRoomPlayersPayload = CommonPayload;
export type GetRoomPlayersResponse = SocketResponse<{
  isRoomCreator: boolean;
  players: { username: string }[];
}>;

// Leave Room

export type LeaveRoomPayload = CommonPayload;
export type LeaveRoomResponse = SocketResponse<{
  message: 'ok';
}>;

// Start Game

export type StartGamePayload = {
  roomCode: string;
  roomConfig: RoomConfig;
};
export type StartGameResponse = SocketResponse<null>;

// Get Room Info

export type GetRoomInfoPayload = CommonPayload;
export type GetRoomInfoResponse = SocketResponse<{
  players: {
    username: string;
    numberOfWins: number;
  }[];
  cardsToSelect: Card[];
  judge: {
    username: string;
    card: any;
  };
  playerCards: ReceiveCard[];
  waitingForJudge: boolean;
  round: number;
  config: RoomConfig;
  roomCreator: string;
}>;

// Set Card

export type SetCardPayload = CommonPayload & {
  card: Card;
};
export type SetCardResponse = SocketResponse<null>;

// Set Winnet Card
export type SetWinnerCardPayload = CommonPayload & {
  card: Card;
};
export type SetWinnerCardResponse = SocketResponse<null>;

// Creator Finish Game

export type CreatorFinishGamePayload = CommonPayload;
export type CreatorFinishGameResponse = SocketResponse<null>;

// Reconnect

export type ReconnectPayload = CommonPayload;
export type ReconnectResponse = SocketResponse<{
  room: {
    isStarted: boolean;
  };
}>;
