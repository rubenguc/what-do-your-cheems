import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./i18n"
import './index.css'
import { SocketProvider, UserProvider } from "wdyc-shared-ui/providers"

createRoot(document.getElementById('root')!).render(
  <SocketProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </SocketProvider>
  ,
)
