import { SocketProvider, UserProvider } from '@wdyc/game/providers';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18nInit';

createRoot(document.getElementById('root') as HTMLElement).render(
  <SocketProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </SocketProvider>
);
