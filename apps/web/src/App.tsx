import { useEffect } from 'react';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import Routes from './Routes';
import { Toaster } from 'react-hot-toast';
import { ConnectionInfo } from './layout';
import { useSocketContext, useUserContext } from '@wdyc/game/hooks';
import { ReconnectResponse, User } from '@wdyc/game-interfaces';

function App() {
  const { isSocketOnline, socket } = useSocketContext();
  const { initUser, login, user } = useUserContext();

  useEffect(() => {
    if (isSocketOnline) {
      const user = localStorage.getItem('user');
      if (!user) return initUser();
      const parsedUser: User = JSON.parse(user);
      if (!parsedUser.roomCode) return initUser();
      socket?.emit('reconnect', parsedUser, (resp: ReconnectResponse) => {
        if (resp.error || !resp?.data?.room) {
          window.localStorage.removeItem('user');
          return initUser();
        }
        const roomIsStarted = resp.data.room.isStarted;
        window.localStorage.setItem(
          'user',
          JSON.stringify({ ...parsedUser, roomIsStarted })
        );
        login({
          roomCode: parsedUser.roomCode || '',
          username: parsedUser.username || '',
          roomIsStarted,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocketOnline]);

  return (
    <ChakraProvider>
      <ConnectionInfo isSocketOnline={isSocketOnline} />
      {!user.isInit ? <Spinner /> : <Routes />}
      <Toaster />
    </ChakraProvider>
  );
}

export default App;
