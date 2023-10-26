import { useState, useEffect } from "react";
import {
  GetRoomPlayersResponse,
  LeaveRoomResponse,
  RoomConfig,
  StartGameResponse,
  WaitRoomPlayer,
} from "wdyc-interfaces";
import { useSocketContext } from "./useSocketContext";
import { useUserContext } from "./useUserContext";
import { GAME_MODES } from "wdyc-utils";

interface useWaitingRoomProps {
  navigate: (route: string) => void;
  onShowError: (message: string) => void;
  onClear: () => void;
  startRoom: () => void;
}

export const useWaitingRoom = ({
  navigate,
  onShowError,
  onClear,
  startRoom,
}: useWaitingRoomProps) => {
  // hooks
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();

  if (!user) throw new Error("User context needed");

  // state
  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    totalRounds: 5,
    gameMode: GAME_MODES[0].key,
  });
  const [players, setPlayers] = useState<WaitRoomPlayer[]>([]);
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user.roomCode) return;

    isSocketOnline &&
      socket?.emit(
        "get-waiting-room-info",
        user,
        (res: GetRoomPlayersResponse) => {
          if (res.error) return onShowError(res.message);

          setIsRoomCreator(res.data?.isRoomCreator || false);
          setPlayers(res.data?.players || []);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocketOnline, socket, user.roomCode]);

  useEffect(() => {
    isSocketOnline &&
      socket?.on("join-player", (res: WaitRoomPlayer) => {
        setPlayers((state) => [...state, { username: res.username }]);
      });

    return () => {
      socket?.off("join-player");
    };
  }, [isSocketOnline, socket]);

  useEffect(() => {
    isSocketOnline &&
      socket?.on("player-leaves", (res: WaitRoomPlayer) => {
        setPlayers((state) => state.filter((p) => p.username !== res.username));
      });

    return () => {
      socket?.off("player-leaves");
    };
  }, [isSocketOnline, socket]);

  useEffect(() => {
    isSocketOnline &&
      socket?.on("move-to-game", () => {
        startRoom();
      });

    return () => {
      socket?.off("move-to-game");
    };
  }, [isSocketOnline, navigate, socket, startRoom]);

  useEffect(() => {
    isSocketOnline &&
      socket?.on("close-room", () => {
        onClear();
      });

    return () => {
      socket?.off("close-room");
    };
  }, [isSocketOnline, navigate, onClear, socket]);

  const startGame = () => {
    const data = {
      roomCode: user.roomCode,
      roomConfig,
    };

    if (isSocketOnline) {
      setIsLoading(true);
      socket?.emit("start-game", data, (res: StartGameResponse) => {
        if (res.error) {
          onShowError(res.message);
          setIsLoading(false);
        }
      });
    }
  };

  const onChangeRoomConfig = (name: string, value: string) => {
    setRoomConfig((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const leaveRoom = () => {
    if (isSocketOnline) {
      setIsLoading(true);
      socket?.emit("leave-room", user, (res: LeaveRoomResponse) => {
        if (res.error) {
          setIsLoading(false);
          return onShowError(res.message);
        }
        onClear();
      });
    }
  };

  const closeRoom = () => {
    if (isSocketOnline) {
      setIsLoading(true);
      socket?.emit("close-room", user, (res: LeaveRoomResponse) => {
        if (res.error) {
          setIsLoading(false);
          return onShowError(res.message);
        }
        onClear();
      });
    }
  };

  return {
    closeRoom,
    isLoading,
    isRoomCreator,
    leaveRoom,
    onChangeRoomConfig,
    players,
    roomConfig,
    startGame,
  };
};
