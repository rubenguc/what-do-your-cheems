// import { Store } from "interfaces/store-interfaces";
import { create } from 'zustand';

const useStore = create<any>((set) => ({
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

    window.localStorage.setItem('user', JSON.stringify(user));
    set((state) => {
      return {
        ...state,
        user,
      };
    });
  },
  clear: () => {
    window.localStorage.removeItem('user');

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
