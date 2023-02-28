import { useContext } from 'react';
import { SocketContext } from '../../providers/SocketProvider';

export const useSocketContext = () => useContext(SocketContext);
