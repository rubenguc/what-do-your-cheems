import { ChakraProvider } from '@chakra-ui/react';
import Routes from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { ConnectionInfo } from './layout/ConnectionInfo';
import { useSocketContext, useUserContext } from '@wdyc/game';
import { useEffect } from 'react';
import { ReconnectResponse, User } from '@wdyc/game-interfaces';

function App() {
  const { isSocketOnline, socket } = useSocketContext();
  const { userIsInit, initUser, login } = useUserContext();

  // Move to separate
  useEffect(() => {
    if (isSocketOnline && !userIsInit) {
      const user = localStorage.getItem('user');

      if (user) {
        const parsedUser: User = JSON.parse(user);

        if (parsedUser.roomCode) {
          socket?.emit('reconnect', parsedUser, (resp: ReconnectResponse) => {
            if (resp.error || !resp?.data?.room) {
              window.localStorage.removeItem('user');
              return;
            }

            const isRoomStarted = resp.data.room.isStarted;

            login({
              roomCode: parsedUser.roomCode,
              username: parsedUser.username,
              redirectTo: isRoomStarted ? 'room' : 'waiting-room',
            });
            initUser();
          });
        }
      }
    }
  }, [userIsInit, isSocketOnline, socket, login, initUser]);

  return (
    <ChakraProvider>
      <ConnectionInfo isSocketOnline={isSocketOnline} />
      <Routes />
      <ToastContainer />
    </ChakraProvider>
  );
}

export default App;
