import { SocketProvider, UserProvider } from '@wdyc/game';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <SocketProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </SocketProvider>
);
