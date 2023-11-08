import { useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";

// @ts-ignore
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

type UseSocketReturnType = {
  socket: Socket | undefined;
  isSocketOnline: boolean;
};

export const useSocket = (): UseSocketReturnType => {
  const socket = useMemo(() => io(SOCKET_URL), []);
  const [isSocketOnline, setIsSocketOnline] = useState(false);

  useEffect(() => {
    setIsSocketOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsSocketOnline(true);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("disconnect", () => {
      setIsSocketOnline(false);
    });
  }, [socket]);

  return {
    socket,
    isSocketOnline,
  };
};
