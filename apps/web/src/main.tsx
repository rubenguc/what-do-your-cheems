import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./i18n"
import './index.css'
import { SocketProvider, UserProvider } from "wdyc-shared-ui/providers"
import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider>
    <SocketProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </SocketProvider>
  </ChakraProvider>
  ,
)
