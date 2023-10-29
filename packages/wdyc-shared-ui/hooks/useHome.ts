import { useState } from "react";
import { CreateRoomResponse, JoinRoomResponse } from "wdyc-interfaces";
import { useUserContext } from "./useUserContext";
import { messages } from "wdyc-utils";
import { useSocketContext } from "./useSocketContext";

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

export const useHome = ({ navigate, onShowError, onLogin }: useHomeProps) => {
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();

  if (!user) throw new Error("User context needed");

  const [selectedOption, setSelectedOption] = useState<
    "create_game" | "join_game" | null
  >(null);

  const [loginForm, setLoginForm] = useState<LoginForm>(() => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;

    return {
      username: "",
      roomCode: "",
      avatar: randomNumber,
    };
  });

  const onChangeForm = (
    name: "username" | "roomCode" | "avatar",
    value: any
  ) => {
    setLoginForm((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const createRoom = () => {
    const username = loginForm.username.trim();
    const avatar = loginForm.avatar;

    if (!username) return onShowError(messages.error.invalid_username);
    if (!isSocketOnline) return onShowError(messages.error.connection_error);

    const data = {
      username,
      avatar,
    };

    socket?.emit("create-room", data, (res: CreateRoomResponse) => {
      if (res.error) return onShowError(res.message);

      moveToWaitingRoom(res.data);
    });
  };

  const joinRoom = () => {
    const username = loginForm.username.trim();
    const roomCode = loginForm.roomCode?.trim();
    const avatar = loginForm.avatar;

    if (!username) return onShowError(messages.error.invalid_username);
    if (!roomCode) return onShowError(messages.error.invalid_room_code);
    if (!isSocketOnline) return onShowError(messages.error.connection_error);
    const data = {
      username,
      roomCode,
      avatar,
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
    selectedOption,
    setSelectedOption,
  };
};
