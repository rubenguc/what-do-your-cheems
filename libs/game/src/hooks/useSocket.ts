import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useSocket = () => {
  const socket = useMemo(() => io(SOCKET_URL), []);
  const [isSocketOnline, setIsSocketOnline] = useState(false);

  useEffect(() => {
    setIsSocketOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsSocketOnline(true);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('disconnect', () => {
      setIsSocketOnline(false);
    });
  }, [socket]);

  return {
    socket,
    isSocketOnline,
  };
};
