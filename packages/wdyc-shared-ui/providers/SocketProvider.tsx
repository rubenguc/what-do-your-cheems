import { createContext, FC, PropsWithChildren } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../hooks';

export interface ISocketContext {
  socket: Socket | undefined;
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