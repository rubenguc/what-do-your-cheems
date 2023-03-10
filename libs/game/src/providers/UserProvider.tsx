import { LoginProps } from '@wdyc/game-interfaces';
import { createContext, FC, PropsWithChildren } from 'react';
import useStore, { GlobalState } from '../store';

type IUserContext = GlobalState & {
  initUser: () => void;
};

export const UserContext = createContext({} as IUserContext);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const user = useStore((state) => state.user);
  const _login = useStore((state) => state.login);
  const clear = useStore((state) => state.clear);
  const startRoom = useStore((state) => state.startRoom);

  const initUser = () => {
    _login({
      roomCode: '',
      username: '',
      roomIsStarted: false,
    });
  };

  const login = (props: LoginProps) => {
    _login(props);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        clear,
        initUser,
        startRoom,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
