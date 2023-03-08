import { LoginState, User } from '@wdyc/game-interfaces';
import { create } from 'zustand';

export interface GlobalState {
  user: User;
  login: LoginState;
  clear: () => void;
}

const useStore = create<GlobalState>((set) => ({
  user: {
    username: '',
    roomCode: '',
  },
  login: ({ roomCode, username, redirectTo }) => {
    const user = {
      roomCode,
      username,
      redirectTo,
    };
    set((state) => {
      return {
        ...state,
        user,
      };
    });
  },
  clear: () => {
    set((state) => ({
      ...state,
      user: {
        username: '',
        roomCode: '',
      },
    }));
  },
}));

export default useStore;
