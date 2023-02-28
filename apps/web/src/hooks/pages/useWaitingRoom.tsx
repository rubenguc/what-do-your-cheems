import { useState, useEffect } from 'react';
import { useSocketContext, useToast } from '../common';
// import { Player } from "interfaces/room-interfaces";
import useStore from '../../store';
// import {
//   GetWaitingRoomInfoResponse,
//   JoinPlayerResponse,
//   PlayerLeavesResponse,
//   SocketResponse,
// } from "interfaces/socketResponses-interfaces";
// import { RoomConfigForm } from "interfaces/form-interfaces";
import { useNavigate } from 'react-router-dom';
import { GAME_MODES } from '../../utils/constants';

export const useWaitingRoom = () => {
  // store
  const user = useStore((state) => state.user);
  const clear = useStore((state) => state.clear);

  // hooks
  const navigate = useNavigate();
  const { isSocketOnline, socket } = useSocketContext();
  const { showErrorToast } = useToast();

  // state
  const [roomConfig, setRoomConfig] = useState<any>({
    totalRounds: 5,
    gameMode: GAME_MODES[0].key,
    winCondition: 'firstToWin',
    winConditionNumber: 0,
  });
  const [players, setPlayers] = useState<any[]>([]);
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.roomCode) return;

    isSocketOnline &&
      socket?.emit('get-waiting-room-info', user, (res: any) => {
        if (res.error) return showErrorToast(res.message);

        setIsRoomCreator(res.data?.isRoomCreator || false);
        setPlayers(res.data?.players || []);
      });
  }, [isSocketOnline, user]);

  useEffect(() => {
    if (!user?.roomCode) return;

    isSocketOnline &&
      socket?.on('join-player', (res: any) => {
        setPlayers((state) => [...state, { username: res.username }]);
      });

    return () => {
      socket?.off('join-player');
    };
  }, [isSocketOnline, user]);

  useEffect(() => {
    if (!user?.roomCode) return;

    isSocketOnline &&
      socket?.on('player-leaves', (res: any) => {
        setPlayers((state) => state.filter((p) => p.username !== res.username));
      });

    return () => {
      socket?.off('player-leaves');
    };
  }, [isSocketOnline, user]);

  useEffect(() => {
    if (!user?.roomCode) return;

    isSocketOnline &&
      socket?.on('move-to-game', () => {
        navigate('/room');
      });

    return () => {
      socket?.off('move-to-game');
    };
  }, [isSocketOnline, user]);

  const startGame = () => {
    const data = {
      roomCode: user.roomCode,
      roomConfig,
    };

    if (isSocketOnline) {
      setIsLoading(true);
      socket?.emit('start-game', data, (res: any) => {
        if (res.error) {
          showErrorToast(res.message);
          setIsLoading(false);
        }
      });
    }
  };

  const onChangeRoomConfig = (name: string, value: any) => {
    setRoomConfig((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const leaveRoom = () => {
    if (isSocketOnline) {
      setIsLoading(true);
      socket?.emit('leave-room', user, (res: any) => {
        if (res.error) {
          setIsLoading(false);
          return showErrorToast(res.message);
        }
        clear();
        navigate('/');
      });
    }
  };

  return {
    players,
    startGame,
    roomConfig,
    onChangeRoomConfig,
    isRoomCreator,
    leaveRoom,
    isLoading,
  };
};
