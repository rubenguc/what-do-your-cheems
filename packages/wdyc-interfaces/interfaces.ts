interface CommonPayload {
  username: string;
  roomCode: string;
  avatar?: number;
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
  type: "PHRASE";
  content: string;
}

export interface MemeCard {
  type: "MEME";
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
  avatar: number;
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
  isEnded: boolean;
}

export interface Judge {
  card: any;
  username: string;
  receivedCards: ReceiveCard[];
}

export interface RoomJudge {
  card: any;
  username: string;
}
export interface WaitRoomPlayer {
  username: string;
  avatar: number;
}

export interface RoomPlayer {
  username: string;
  numberOfWins: number;
  avatar: number;
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
  players: WaitRoomPlayer[];
}>;

// Leave Room

export type LeaveRoomPayload = CommonPayload;
export type LeaveRoomResponse = SocketResponse<{
  message: "ok";
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
  players: RoomPlayer[];
  cardsToSelect: Card[];
  judge: RoomJudge;
  playerCards: ReceiveCard[];
  waitingForJudge: boolean;
  round: number;
  config: RoomConfig;
  roomCreator: string;
  isEnded: boolean;
  winner: string;
}>;

// Set Card

export type SetCardPayload = CommonPayload & {
  card: Card;
};
export type SetCardResponse = SocketResponse<{
  isRoundOver: boolean;
}>;

// Set Winnet Card
export type SetWinnerCardPayload = CommonPayload & {
  card: Card;
};
export type SetWinnerCardResponse = SocketResponse<null>;

// Creator Finish Game

export type CreatorFinishGamePayload = CommonPayload;
export type CreatorFinishGameResponse = SocketResponse<null>;

// Creator Finish Game

export type closeRoomPayload = CommonPayload;
export type closeRoomResponse = SocketResponse<null>;

// Reconnect

export type ReconnectPayload = CommonPayload;
export type ReconnectResponse = SocketResponse<{
  room: {
    isStarted: boolean;
  };
}>;

// Game
export interface User {
  username: string;
  roomCode: string;
  roomIsStarted: boolean;
  isInit: boolean;
}

export interface LoginProps {
  roomCode: string;
  username: string;
  roomIsStarted: boolean;
}

export type LoginState = (props: LoginProps) => void;

export enum Adapater {
  RN = "React native",
  R = "React",
}

export type OnShowMessageIcon = 'success' | 'loading' | 'winner'

export interface OnShowMessage {
  message: string;
  persistent?: boolean;
  id?: string;
  icon: OnShowMessageIcon;
}
