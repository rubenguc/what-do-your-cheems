import { createContext, FC, PropsWithChildren, useState } from 'react';
import useStore, { GlobalState } from '../store';

type IUserContext = GlobalState & {
  userIsInit: boolean;
  initUser: () => void;
};

export const UserContext = createContext({} as IUserContext);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [userIsInit, setuserIsInit] = useState(false);

  const user = useStore((state) => state.user);
  const login = useStore((state) => state.login);
  const clear = useStore((state) => state.clear);

  const initUser = () => {
    setuserIsInit(true);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        clear,
        userIsInit,
        initUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
