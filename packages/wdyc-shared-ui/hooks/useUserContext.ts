import { useContext } from 'react';
import { UserContext } from '../providers';

export const useUserContext = () => useContext(UserContext);
