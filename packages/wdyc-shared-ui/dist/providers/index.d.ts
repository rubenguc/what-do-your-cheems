export { S as SocketContext, a as SocketProvider } from '../SocketProvider-ec1ba0b5.js';
import * as react from 'react';
import { FC, PropsWithChildren } from 'react';
import { GlobalState } from '../store.js';
import 'socket.io-client';
import 'zustand';
import 'wdyc-interfaces';

type IUserContext = GlobalState & {
    initUser: () => void;
};
declare const UserContext: react.Context<IUserContext>;
declare const UserProvider: FC<PropsWithChildren>;

export { UserContext, UserProvider };
