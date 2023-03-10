import { LoginState, User } from '@wdyc/game-interfaces';
import { create } from 'zustand';

export interface GlobalState {
  user: User;
  login: LoginState;
  clear: () => void;
  startRoom: () => void;
}

const useStore = create<GlobalState>((set) => ({
  user: {
    username: '',
    roomCode: '',
    roomIsStarted: false,
    isInit: false,
  },
  login: ({ roomCode, username, roomIsStarted }) => {
    const user: User = {
      roomCode,
      username,
      roomIsStarted,
      isInit: true,
    };
    set((state) => {
      return {
        ...state,
        user,
      };
    });
  },
  startRoom: () => {
    set((state) => ({
      ...state,
      user: {
        ...state.user,
        roomIsStarted: true,
      },
    }));
  },
  clear: () => {
    set((state) => ({
      ...state,
      user: {
        username: '',
        roomCode: '',
        roomIsStarted: false,
        isInit: true,
      },
    }));
  },
}));

export default useStore;
