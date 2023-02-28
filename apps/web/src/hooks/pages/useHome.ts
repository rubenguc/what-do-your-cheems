import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext, useToast } from '../common';
// import {
//   JoinRoomResponse,
//   SocketResponse,
//   CreateRoomResponse,
// } from "interfaces/socketResponses-interfaces";
import useStore from '../../store';

interface LoginForm {
  username: string;
  roomCode?: string;
}

export const useHome = () => {
  // store
  const login = useStore((state) => state.login);

  // hooks
  const navigate = useNavigate();
  const { showErrorToast } = useToast();
  const { isSocketOnline, socket } = useSocketContext();

  // state
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: '',
    roomCode: '',
  });

  const onChangeForm = (name: 'username' | 'roomCode', value: string) => {
    setLoginForm((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const createRoom = () => {
    const username = loginForm.username.trim();

    if (!username) return showErrorToast('Invalid username');
    if (!isSocketOnline) return showErrorToast('Connection error');

    const data = {
      username,
    };

    socket?.emit('create-room', data, (res: any) => {
      if (res.error) return showErrorToast(res.message);

      moveToWaitingRoom(res.data);
    });
  };

  const joinRoom = () => {
    const username = loginForm.username.trim();
    const roomCode = loginForm.roomCode?.trim();

    if (!username) return showErrorToast('Invalid username');
    if (!roomCode) return showErrorToast('Invalid roomCode');
    if (!isSocketOnline) return showErrorToast('Connection error');

    const data = {
      username,
      roomCode,
    };

    socket?.emit('join-room', data, (res: any) => {
      if (res.error) return showErrorToast(res.message);

      moveToWaitingRoom(res.data);
    });
  };

  const moveToWaitingRoom = (data: any | any) => {
    login(data);
    navigate('/waiting-room');
  };

  return {
    loginForm,
    createRoom,
    joinRoom,
    onChangeForm,
  };
};
