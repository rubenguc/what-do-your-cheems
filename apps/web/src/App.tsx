import { ChakraProvider } from '@chakra-ui/react';
import Routes from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { useSocketContext } from './hooks/common/useSocketContext';
import { ConnectionInfo } from './layout/ConnectionInfo';

function App() {
  const { isSocketOnline } = useSocketContext();

  return (
    <ChakraProvider>
      <ConnectionInfo isSocketOnline={isSocketOnline} />
      <Routes />
      <ToastContainer />
    </ChakraProvider>
  );
}

export default App;
