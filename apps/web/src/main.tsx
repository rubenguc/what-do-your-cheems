import { createRoot } from 'react-dom/client';
import App from './App';
import { SocketProvider } from './providers/SocketProvider';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
