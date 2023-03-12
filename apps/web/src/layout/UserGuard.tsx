import { useUserContext } from '@wdyc/game/hooks';
import { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const UserGuard: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useUserContext();

  if (!user?.roomCode && pathname !== '/') {
    return <Navigate to="/" />;
  }

  if (user?.roomCode && !user?.roomIsStarted && pathname !== '/waiting-room') {
    return <Navigate to="/waiting-room" />;
  }

  if (user?.roomCode && user?.roomIsStarted && pathname !== '/room') {
    return <Navigate to="/room" />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
