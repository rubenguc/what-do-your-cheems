// store.ts
import { create } from "zustand";
var useStore = create((set) => ({
  user: {
    username: "",
    roomCode: "",
    roomIsStarted: false,
    isInit: false
  },
  login: ({ roomCode, username, roomIsStarted }) => {
    const user = {
      roomCode,
      username,
      roomIsStarted,
      isInit: true
    };
    set((state) => {
      return {
        ...state,
        user
      };
    });
  },
  startRoom: () => {
    set((state) => ({
      ...state,
      user: {
        ...state.user,
        roomIsStarted: true
      }
    }));
  },
  clear: () => {
    set((state) => ({
      ...state,
      user: {
        username: "",
        roomCode: "",
        roomIsStarted: false,
        isInit: true
      }
    }));
  }
}));
var store_default = useStore;

export {
  store_default
};
