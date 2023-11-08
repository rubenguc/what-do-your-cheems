import {
  store_default
} from "./chunk-AZM33ZMQ.mjs";

// providers/SocketProvider.tsx
import { createContext } from "react";

// hooks/useSocket.ts
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
var SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
var useSocket = () => {
  const socket = useMemo(() => io(SOCKET_URL), []);
  const [isSocketOnline, setIsSocketOnline] = useState(false);
  useEffect(() => {
    setIsSocketOnline(socket.connected);
  }, [socket]);
  useEffect(() => {
    socket.on("connect", () => {
      setIsSocketOnline(true);
    });
  }, [socket]);
  useEffect(() => {
    socket.on("disconnect", () => {
      setIsSocketOnline(false);
    });
  }, [socket]);
  return {
    socket,
    isSocketOnline
  };
};

// hooks/useHome.ts
import { useState as useState2 } from "react";

// hooks/useUserContext.ts
import { useContext } from "react";
var useUserContext = () => useContext(UserContext);

// hooks/useHome.ts
import { messages } from "wdyc-utils";

// hooks/useSocketContext.ts
import { useContext as useContext2 } from "react";
var useSocketContext = () => useContext2(SocketContext);

// hooks/useHome.ts
var useHome = ({ navigate, onShowError, onLogin }) => {
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();
  if (!user)
    throw new Error("User context needed");
  const [selectedOption, setSelectedOption] = useState2(null);
  const [loginForm, setLoginForm] = useState2(() => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    return {
      username: "",
      roomCode: "",
      avatar: randomNumber
    };
  });
  const onChangeForm = (name, value) => {
    setLoginForm((state) => ({
      ...state,
      [name]: value
    }));
  };
  const createRoom = () => {
    const username = loginForm.username.trim();
    const avatar = loginForm.avatar;
    if (!username)
      return onShowError(messages.error.invalid_username);
    if (!isSocketOnline)
      return onShowError(messages.error.connection_error);
    const data = {
      username,
      avatar
    };
    socket == null ? void 0 : socket.emit("create-room", data, (res) => {
      if (res.error)
        return onShowError(res.message);
      moveToWaitingRoom(res.data);
    });
  };
  const joinRoom = () => {
    var _a;
    const username = loginForm.username.trim();
    const roomCode = (_a = loginForm.roomCode) == null ? void 0 : _a.trim();
    const avatar = loginForm.avatar;
    if (!username)
      return onShowError(messages.error.invalid_username);
    if (!roomCode)
      return onShowError(messages.error.invalid_room_code);
    if (!isSocketOnline)
      return onShowError(messages.error.connection_error);
    const data = {
      username,
      roomCode,
      avatar
    };
    socket == null ? void 0 : socket.emit("join-room", data, (res) => {
      if (res.error)
        return onShowError(res.message);
      moveToWaitingRoom(res.data);
    });
  };
  const moveToWaitingRoom = async (data) => {
    if (!data)
      return;
    await onLogin(data);
    navigate("/waiting-room");
  };
  return {
    loginForm,
    createRoom,
    joinRoom,
    onChangeForm,
    selectedOption,
    setSelectedOption
  };
};

// hooks/useRoom.ts
import { useState as useState3, useEffect as useEffect2, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PATHS } from "wdyc-utils";
var useRoom = ({
  navigate,
  onShowError,
  onClear,
  onShowMessage,
  onCloseAllToasts
}) => {
  const { t } = useTranslation("room");
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();
  if (!user)
    throw new Error("User context needed");
  const [cardsToSelect, setCardToSelect] = useState3([]);
  const [judge, setJudge] = useState3({
    username: "",
    card: {}
  });
  const [players, setPlayers] = useState3([]);
  const [game, setGame] = useState3({
    isEnded: false,
    config: {},
    winner: "",
    round: 0,
    roomCreator: "",
    players: []
  });
  const [waitingForJudge, setWaitingForJudge] = useState3(false);
  const [playerCards, setPlayerCards] = useState3([]);
  const isJudge = judge.username === user.username;
  const isRoomCreator = game.roomCreator === user.username;
  const setCard = (card) => {
    const data = {
      ...user,
      card
    };
    const socketMethod = isJudge ? PATHS.SET_WINNER_CARD : PATHS.SET_CARD;
    socket == null ? void 0 : socket.emit(
      socketMethod,
      data,
      (resp) => {
        var _a;
        if (resp.error)
          return onShowError(t(resp.message));
        if (!isJudge) {
          setCardToSelect(
            (state) => state.filter((c) => {
              if (c.type === "MEME") {
                return c.url !== card.url;
              }
              if (c.type === "PHRASE") {
                return c.content !== card.content;
              }
              return c;
            })
          );
          if (socketMethod === "set-card") {
            onShowMessage(
              ((_a = resp.data) == null ? void 0 : _a.isRoundOver) ? t("waiting_for_judge") : t("waiting_for_players"),
              true
            );
          }
        }
      }
    );
  };
  const goToHome = useCallback(() => {
    onClear();
  }, [onClear]);
  const finishGame = () => {
    if (!isRoomCreator)
      return;
    const data = {
      roomCode: user.roomCode,
      username: user.username
    };
    socket == null ? void 0 : socket.emit(
      PATHS.CREATOR_FINISH_GAME,
      data,
      (resp) => {
        if (resp.error)
          onShowError(resp.message);
      }
    );
  };
  useEffect2(() => {
    if (!user.roomCode)
      return;
    socket == null ? void 0 : socket.emit(PATHS.GET_ROOM_INFO, user, (resp) => {
      const {
        cardsToSelect: cardsToSelect2,
        judge: judge2,
        players: players2,
        playerCards: playerCards2,
        waitingForJudge: waitingForJudge2,
        round,
        config,
        roomCreator,
        isEnded,
        winner
      } = resp.data;
      if (isEnded) {
        setGame({
          isEnded: true,
          config: {},
          winner,
          round: 0,
          roomCreator: ""
        });
        return;
      }
      setCardToSelect(cardsToSelect2 || []);
      setPlayers(players2 || []);
      setJudge(judge2 || null);
      setPlayerCards(
        playerCards2.map((c) => ({
          ...c.card,
          username: c.username
        })) || []
      );
      setWaitingForJudge(waitingForJudge2 || cardsToSelect2.length < 7);
      if (waitingForJudge2 || cardsToSelect2.length < 7) {
        if (waitingForJudge2 && user.username === judge2.username) {
          return onShowMessage(t("select_the_winner_card"), true);
        }
        onShowMessage(
          waitingForJudge2 ? t("waiting_for_judge") : t("waiting_for_judge"),
          true
        );
      }
      setGame((state) => ({
        ...state,
        round,
        config,
        roomCreator
      }));
    });
  }, [isSocketOnline, user.roomCode]);
  useEffect2(() => {
    socket == null ? void 0 : socket.on("player-set-card", (resp) => {
    });
    return () => {
      socket == null ? void 0 : socket.off("player-set-card");
    };
  }, [isSocketOnline, onShowError, socket]);
  useEffect2(() => {
    socket == null ? void 0 : socket.on("select-judge-card", (resp) => {
      if (isJudge)
        setPlayerCards(
          resp.map((c) => ({
            ...c.card,
            username: c.username
          }))
        );
    });
    return () => {
      socket == null ? void 0 : socket.off("select-judge-card");
    };
  }, [isSocketOnline, isJudge, socket]);
  useEffect2(() => {
    socket == null ? void 0 : socket.on("all-players-ready", () => {
      setWaitingForJudge(true);
      if (isJudge) {
        return onShowMessage(t("select_the_winner_card"), true);
      }
      onShowMessage(t("waiting_for_judge"), true);
    });
    return () => {
      socket == null ? void 0 : socket.off("all-players-ready");
    };
  }, [isSocketOnline, isJudge, socket, onShowMessage, t]);
  useEffect2(() => {
    socket == null ? void 0 : socket.on("winner-card", (resp) => {
      onShowMessage(`winner ${resp}`, false, "winner");
      setPlayers(
        (state) => state.map(
          (player) => player.username === resp ? { ...player, numberOfWins: player.numberOfWins + 1 } : player
        )
      );
    });
    return () => {
      socket == null ? void 0 : socket.off("winner-card");
    };
  }, [isSocketOnline, isJudge, socket, onShowError, onShowMessage]);
  useEffect2(() => {
    socket == null ? void 0 : socket.on("next-round", (resp) => {
      setJudge(resp.judge);
      setWaitingForJudge(false);
      setPlayerCards([]);
      onShowMessage(t("starting_next_round"));
      setGame((state) => ({
        ...state,
        round: state.round + 1
      }));
    });
    return () => {
      socket == null ? void 0 : socket.off("next-round");
    };
  }, [isSocketOnline, onShowError, onShowMessage, socket, t]);
  useEffect2(() => {
    socket == null ? void 0 : socket.on(
      "end-game",
      ({ winner, players: players2 }) => {
        onCloseAllToasts();
        setGame({
          isEnded: true,
          winner,
          config: "",
          round: 0,
          players: players2
        });
      }
    );
    return () => {
      socket == null ? void 0 : socket.off("end-game");
    };
  }, [onShowError, socket]);
  useEffect2(() => {
    socket == null ? void 0 : socket.on("new-card", (resp) => {
      if (resp.card) {
        setCardToSelect((state) => [...state, resp.card]);
      }
    });
    return () => {
      socket == null ? void 0 : socket.off("new-card");
    };
  }, [socket]);
  useEffect2(() => {
    socket == null ? void 0 : socket.on("finish-game", () => {
      goToHome();
    });
    return () => {
      socket == null ? void 0 : socket.off("finish-game");
    };
  }, [goToHome, socket]);
  return {
    isJudge,
    isRoomCreator,
    setCard,
    cardsToSelect,
    judge,
    players,
    game,
    waitingForJudge,
    playerCards,
    goToHome,
    finishGame
  };
};

// hooks/useWaitingRoom.ts
import { useState as useState4, useEffect as useEffect3 } from "react";
import { GAME_MODES, PATHS as PATHS2 } from "wdyc-utils";
var useWaitingRoom = ({
  navigate,
  onShowError,
  onClear,
  startRoom
}) => {
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();
  if (!user)
    throw new Error("User context needed");
  const [roomConfig, setRoomConfig] = useState4({
    totalRounds: 5,
    gameMode: GAME_MODES[0].key
  });
  const [players, setPlayers] = useState4([]);
  const [isRoomCreator, setIsRoomCreator] = useState4(false);
  const [isLoading, setIsLoading] = useState4(false);
  useEffect3(() => {
    if (!user.roomCode)
      return;
    isSocketOnline && (socket == null ? void 0 : socket.emit(
      "get-waiting-room-info",
      user,
      (res) => {
        var _a, _b;
        if (res.error)
          return onShowError(res.message);
        setIsRoomCreator(((_a = res.data) == null ? void 0 : _a.isRoomCreator) || false);
        setPlayers(((_b = res.data) == null ? void 0 : _b.players) || []);
      }
    ));
  }, [isSocketOnline, socket, user.roomCode]);
  useEffect3(() => {
    isSocketOnline && (socket == null ? void 0 : socket.on("join-player", (res) => {
      setPlayers((state) => [...state, res]);
    }));
    return () => {
      socket == null ? void 0 : socket.off("join-player");
    };
  }, [isSocketOnline, socket]);
  useEffect3(() => {
    isSocketOnline && (socket == null ? void 0 : socket.on("player-leaves", (res) => {
      setPlayers((state) => state.filter((p) => p.username !== res.username));
    }));
    return () => {
      socket == null ? void 0 : socket.off("player-leaves");
    };
  }, [isSocketOnline, socket]);
  useEffect3(() => {
    isSocketOnline && (socket == null ? void 0 : socket.on("move-to-game", () => {
      startRoom();
    }));
    return () => {
      socket == null ? void 0 : socket.off("move-to-game");
    };
  }, [isSocketOnline, navigate, socket, startRoom]);
  useEffect3(() => {
    isSocketOnline && (socket == null ? void 0 : socket.on("close-room", () => {
      onClear();
    }));
    return () => {
      socket == null ? void 0 : socket.off("close-room");
    };
  }, [isSocketOnline, navigate, onClear, socket]);
  const startGame = () => {
    const data = {
      roomCode: user.roomCode,
      roomConfig
    };
    if (isSocketOnline) {
      setIsLoading(true);
      socket == null ? void 0 : socket.emit(PATHS2.START_GAME, data, (res) => {
        if (res.error) {
          onShowError(res.message);
          setIsLoading(false);
        }
      });
    }
  };
  const onChangeRoomConfig = (name, value) => {
    setRoomConfig((state) => ({
      ...state,
      [name]: value
    }));
  };
  const leaveRoom = () => {
    if (isSocketOnline) {
      setIsLoading(true);
      socket == null ? void 0 : socket.emit(PATHS2.LEAVE_ROOM, user, (res) => {
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
      socket == null ? void 0 : socket.emit(PATHS2.CLOSE_ROOM, user, (res) => {
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
    startGame
  };
};

// providers/SocketProvider.tsx
import { jsx } from "react/jsx-runtime";
var SocketContext = createContext({});
var SocketProvider = ({ children }) => {
  const { socket, isSocketOnline } = useSocket();
  return /* @__PURE__ */ jsx(SocketContext.Provider, {
    value: {
      socket,
      isSocketOnline
    },
    children
  });
};

// providers/UserProvider.tsx
import { createContext as createContext2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var UserContext = createContext2({});
var UserProvider = ({ children }) => {
  const user = store_default((state) => state.user);
  const _login = store_default((state) => state.login);
  const clear = store_default((state) => state.clear);
  const startRoom = store_default((state) => state.startRoom);
  const initUser = () => {
    _login({
      roomCode: "",
      username: "",
      roomIsStarted: false
    });
  };
  const login = (props) => {
    _login(props);
  };
  return /* @__PURE__ */ jsx2(UserContext.Provider, {
    value: {
      user,
      login,
      clear,
      initUser,
      startRoom
    },
    children
  });
};

export {
  useSocket,
  SocketContext,
  SocketProvider,
  UserContext,
  UserProvider,
  useUserContext,
  useSocketContext,
  useHome,
  useRoom,
  useWaitingRoom
};
