import React, { createContext, FC, PropsWithChildren } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../hooks';

interface ISocketContext {
  socket: Socket | null;
  isSocketOnline: boolean;
}

export const SocketContext = createContext({} as ISocketContext);

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const { socket, isSocketOnline } = useSocket();

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketOnline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};