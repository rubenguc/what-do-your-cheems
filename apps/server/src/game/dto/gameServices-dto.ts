import { Room } from 'wdyc-interfaces';

export interface CreateRoomServiceProps {
  username: string;
  roomCode: string;
  avatar: number;
  socketId: string;
}

export interface JoinRoomServiceProps {
  username: string;
  roomCode: string;
  avatar: number;
  room: string;
  socketId: string;
}

export interface GetPlayersProps {
  roomCode: string;
}

export interface UpdateRoomServiceProps {
  roomCode: string;
  room: Room;
}
