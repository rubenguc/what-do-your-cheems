import { useEffect } from "react";
import { useSocketContext, useUserContext } from "wdyc-shared-ui/hooks";
import { ConnectionInfo } from "./components/layout"
import Routes from "./Routes";
import { Toaster } from 'react-hot-toast';
import { ReconnectResponse, User } from 'wdyc-interfaces';

const SERVER_URL = import.meta.env.VITE_SOCKET_URL;


function App() {
  const { isSocketOnline, socket } = useSocketContext();
  const { initUser, login, user } = useUserContext();

  useEffect(() => {
    (async () => {
      await fetch(`${SERVER_URL}/ping`).catch(console.log);
    })();
  }, []);

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
    <>
      <ConnectionInfo isSocketOnline={isSocketOnline} />
      {!user.isInit ? <p /> : <Routes />}
      <Toaster />
    </>
  )
}

export default App
