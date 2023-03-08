import { useContext } from 'react';
import { SocketContext } from '../providers';

export const useSocketContext = () => useContext(SocketContext);
