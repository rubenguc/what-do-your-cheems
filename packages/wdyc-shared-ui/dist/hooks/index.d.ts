import { Socket } from 'socket.io-client';
import * as react from 'react';
import { CreateRoomResponse, Card, RoomJudge, RoomPlayer, WaitRoomPlayer, RoomConfig } from 'wdyc-interfaces';
import { I as ISocketContext } from '../SocketProvider-ec1ba0b5.js';
import { GlobalState } from '../store.js';
import 'zustand';

type UseSocketReturnType = {
    socket: Socket | undefined;
    isSocketOnline: boolean;
};
declare const useSocket: () => UseSocketReturnType;

interface LoginForm {
    username: string;
    roomCode?: string;
    avatar: number;
}
interface useHomeProps {
    navigate: (route: string) => void;
    onShowError: (message: string) => void;
    onLogin: (data: CreateRoomResponse["data"]) => void;
}
declare const useHome: ({ navigate, onShowError, onLogin }: useHomeProps) => {
    loginForm: LoginForm;
    createRoom: () => void;
    joinRoom: () => void;
    onChangeForm: (name: "username" | "roomCode" | "avatar", value: any) => void;
    selectedOption: "create_game" | "join_game" | null;
    setSelectedOption: react.Dispatch<react.SetStateAction<"create_game" | "join_game" | null>>;
};

interface useRoomProps {
    navigate: (route: string) => void;
    onShowError: (message: string) => void;
    onShowMessage: (message: string, persistent?: boolean, id?: string) => void;
    onClear: () => void;
    onCloseAllToasts: () => void;
}
declare const useRoom: ({ navigate, onShowError, onClear, onShowMessage, onCloseAllToasts, }: useRoomProps) => {
    isJudge: boolean;
    isRoomCreator: boolean;
    setCard: (card: Card) => void;
    cardsToSelect: Card[];
    judge: RoomJudge;
    players: RoomPlayer[];
    game: any;
    waitingForJudge: boolean;
    playerCards: any[];
    goToHome: () => void;
    finishGame: () => void;
};

declare const useSocketContext: () => ISocketContext;

interface useWaitingRoomProps {
    navigate: (route: string) => void;
    onShowError: (message: string) => void;
    onClear: () => void;
    startRoom: () => void;
}
declare const useWaitingRoom: ({ navigate, onShowError, onClear, startRoom, }: useWaitingRoomProps) => {
    closeRoom: () => void;
    isLoading: boolean;
    isRoomCreator: boolean;
    leaveRoom: () => void;
    onChangeRoomConfig: (name: string, value: string) => void;
    players: WaitRoomPlayer[];
    roomConfig: RoomConfig;
    startGame: () => void;
};

declare const useUserContext: () => GlobalState & {
    initUser: () => void;
};

export { useHome, useRoom, useSocket, useSocketContext, useUserContext, useWaitingRoom };
