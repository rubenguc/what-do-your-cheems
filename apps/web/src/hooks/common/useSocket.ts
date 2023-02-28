// import {
//   ReconnectResponse,
//   SocketResponse,
// } from "interfaces/socketResponses-interfaces";
// import { User } from "interfaces/store-interfaces";
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import useStore from '../../store';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

console.log(SOCKET_URL);

export const useSocket = () => {
  const socket = useMemo(() => io(SOCKET_URL), [SOCKET_URL]);
  const [isSocketOnline, setIsSocketOnline] = useState(false);

  const login = useStore((state) => state.login);

  useEffect(() => {
    setIsSocketOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsSocketOnline(true);

      const user = window.localStorage.getItem('user');

      if (user) {
        const parsedUser: any = JSON.parse(user);

        if (parsedUser.roomCode) {
          socket.emit('reconnect', parsedUser, (resp: any) => {
            if (resp.error || !resp.data.room) {
              window.localStorage.removeItem('user');
              return;
            }

            const isRoomStarted = resp.data.room.isStarted;

            login({
              roomCode: parsedUser.roomCode,
              username: parsedUser.username,
              redirectTo: isRoomStarted ? 'room' : 'waiting-room',
            });
          });
        }
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('disconnect', () => {
      console.log('disconnected');
      setIsSocketOnline(false);
    });
  }, [socket]);

  return {
    socket,
    isSocketOnline,
  };
};
