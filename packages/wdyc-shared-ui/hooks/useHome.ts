import { useState } from "react";
import { CreateRoomResponse, JoinRoomResponse } from "wdyc-interfaces";
import { useUserContext } from "./useUserContext";
import { messages } from "wdyc-utils";
import { useSocketContext } from "./useSocketContext";

interface LoginForm {
  username: string;
  roomCode?: string;
}

interface useHomeProps {
  navigate: (route: string) => void;
  onShowError: (message: string) => void;
  onLogin: (data: CreateRoomResponse["data"]) => void;
}

export const useHome = ({ navigate, onShowError, onLogin }: useHomeProps) => {
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();

  if (!user) throw new Error("User context needed");

  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    roomCode: "",
  });

  const onChangeForm = (name: "username" | "roomCode", value: string) => {
    setLoginForm((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const createRoom = () => {
    const username = loginForm.username.trim();

    if (!username) return onShowError(messages.error.invalid_username);
    if (!isSocketOnline) return onShowError(messages.error.connection_error);

    const data = {
      username,
    };

    socket?.emit("create-room", data, (res: CreateRoomResponse) => {
      if (res.error) return onShowError(res.message);

      moveToWaitingRoom(res.data);
    });
  };

  const joinRoom = () => {
    const username = loginForm.username.trim();
    const roomCode = loginForm.roomCode?.trim();
    if (!username) return onShowError(messages.error.invalid_username);
    if (!roomCode) return onShowError(messages.error.invalid_room_code);
    if (!isSocketOnline) return onShowError(messages.error.connection_error);
    const data = {
      username,
      roomCode,
    };
    socket?.emit("join-room", data, (res: JoinRoomResponse) => {
      if (res.error) return onShowError(res.message);
      moveToWaitingRoom(res.data);
    });
  };

  const moveToWaitingRoom = async (
    data: JoinRoomResponse["data"] | CreateRoomResponse["data"]
  ) => {
    if (!data) return;
    await onLogin(data);
    navigate("/waiting-room");
  };

  return {
    loginForm,
    createRoom,
    joinRoom,
    onChangeForm,
  };
};
