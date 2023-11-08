import * as react from 'react';
import { FC, PropsWithChildren } from 'react';
import { Socket } from 'socket.io-client';

interface ISocketContext {
    socket: Socket | undefined;
    isSocketOnline: boolean;
}
declare const SocketContext: react.Context<ISocketContext>;
declare const SocketProvider: FC<PropsWithChildren>;

export { ISocketContext as I, SocketContext as S, SocketProvider as a };
