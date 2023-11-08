"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// hooks/index.ts
var hooks_exports = {};
__export(hooks_exports, {
  useHome: () => useHome,
  useRoom: () => useRoom,
  useSocket: () => useSocket,
  useSocketContext: () => useSocketContext,
  useUserContext: () => useUserContext,
  useWaitingRoom: () => useWaitingRoom
});
module.exports = __toCommonJS(hooks_exports);

// hooks/useSocket.ts
var import_react = require("react");
var import_socket = require("socket.io-client");
var import_meta = {};
var SOCKET_URL = import_meta.env.VITE_SOCKET_URL;
var useSocket = () => {
  const socket = (0, import_react.useMemo)(() => (0, import_socket.io)(SOCKET_URL), []);
  const [isSocketOnline, setIsSocketOnline] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setIsSocketOnline(socket.connected);
  }, [socket]);
  (0, import_react.useEffect)(() => {
    socket.on("connect", () => {
      setIsSocketOnline(true);
    });
  }, [socket]);
  (0, import_react.useEffect)(() => {
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
var import_react6 = require("react");

// hooks/useUserContext.ts
var import_react4 = require("react");

// providers/SocketProvider.tsx
var import_react2 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var SocketContext = (0, import_react2.createContext)({});

// providers/UserProvider.tsx
var import_react3 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var UserContext = (0, import_react3.createContext)({});

// hooks/useUserContext.ts
var useUserContext = () => (0, import_react4.useContext)(UserContext);

// hooks/useHome.ts
var import_wdyc_utils = require("wdyc-utils");

// hooks/useSocketContext.ts
var import_react5 = require("react");
var useSocketContext = () => (0, import_react5.useContext)(SocketContext);

// hooks/useHome.ts
var useHome = ({ navigate, onShowError, onLogin }) => {
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();
  if (!user)
    throw new Error("User context needed");
  const [selectedOption, setSelectedOption] = (0, import_react6.useState)(null);
  const [loginForm, setLoginForm] = (0, import_react6.useState)(() => {
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
      return onShowError(import_wdyc_utils.messages.error.invalid_username);
    if (!isSocketOnline)
      return onShowError(import_wdyc_utils.messages.error.connection_error);
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
      return onShowError(import_wdyc_utils.messages.error.invalid_username);
    if (!roomCode)
      return onShowError(import_wdyc_utils.messages.error.invalid_room_code);
    if (!isSocketOnline)
      return onShowError(import_wdyc_utils.messages.error.connection_error);
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
var import_react7 = require("react");
var import_react_i18next = require("react-i18next");
var import_wdyc_utils2 = require("wdyc-utils");
var useRoom = ({
  navigate,
  onShowError,
  onClear,
  onShowMessage,
  onCloseAllToasts
}) => {
  const { t } = (0, import_react_i18next.useTranslation)("room");
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();
  if (!user)
    throw new Error("User context needed");
  const [cardsToSelect, setCardToSelect] = (0, import_react7.useState)([]);
  const [judge, setJudge] = (0, import_react7.useState)({
    username: "",
    card: {}
  });
  const [players, setPlayers] = (0, import_react7.useState)([]);
  const [game, setGame] = (0, import_react7.useState)({
    isEnded: false,
    config: {},
    winner: "",
    round: 0,
    roomCreator: "",
    players: []
  });
  const [waitingForJudge, setWaitingForJudge] = (0, import_react7.useState)(false);
  const [playerCards, setPlayerCards] = (0, import_react7.useState)([]);
  const isJudge = judge.username === user.username;
  const isRoomCreator = game.roomCreator === user.username;
  const setCard = (card) => {
    const data = {
      ...user,
      card
    };
    const socketMethod = isJudge ? import_wdyc_utils2.PATHS.SET_WINNER_CARD : import_wdyc_utils2.PATHS.SET_CARD;
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
  const goToHome = (0, import_react7.useCallback)(() => {
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
      import_wdyc_utils2.PATHS.CREATOR_FINISH_GAME,
      data,
      (resp) => {
        if (resp.error)
          onShowError(resp.message);
      }
    );
  };
  (0, import_react7.useEffect)(() => {
    if (!user.roomCode)
      return;
    socket == null ? void 0 : socket.emit(import_wdyc_utils2.PATHS.GET_ROOM_INFO, user, (resp) => {
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
  (0, import_react7.useEffect)(() => {
    socket == null ? void 0 : socket.on("player-set-card", (resp) => {
    });
    return () => {
      socket == null ? void 0 : socket.off("player-set-card");
    };
  }, [isSocketOnline, onShowError, socket]);
  (0, import_react7.useEffect)(() => {
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
  (0, import_react7.useEffect)(() => {
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
  (0, import_react7.useEffect)(() => {
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
  (0, import_react7.useEffect)(() => {
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
  (0, import_react7.useEffect)(() => {
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
  (0, import_react7.useEffect)(() => {
    socket == null ? void 0 : socket.on("new-card", (resp) => {
      if (resp.card) {
        setCardToSelect((state) => [...state, resp.card]);
      }
    });
    return () => {
      socket == null ? void 0 : socket.off("new-card");
    };
  }, [socket]);
  (0, import_react7.useEffect)(() => {
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
var import_react8 = require("react");
var import_wdyc_utils3 = require("wdyc-utils");
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
  const [roomConfig, setRoomConfig] = (0, import_react8.useState)({
    totalRounds: 5,
    gameMode: import_wdyc_utils3.GAME_MODES[0].key
  });
  const [players, setPlayers] = (0, import_react8.useState)([]);
  const [isRoomCreator, setIsRoomCreator] = (0, import_react8.useState)(false);
  const [isLoading, setIsLoading] = (0, import_react8.useState)(false);
  (0, import_react8.useEffect)(() => {
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
  (0, import_react8.useEffect)(() => {
    isSocketOnline && (socket == null ? void 0 : socket.on("join-player", (res) => {
      setPlayers((state) => [...state, res]);
    }));
    return () => {
      socket == null ? void 0 : socket.off("join-player");
    };
  }, [isSocketOnline, socket]);
  (0, import_react8.useEffect)(() => {
    isSocketOnline && (socket == null ? void 0 : socket.on("player-leaves", (res) => {
      setPlayers((state) => state.filter((p) => p.username !== res.username));
    }));
    return () => {
      socket == null ? void 0 : socket.off("player-leaves");
    };
  }, [isSocketOnline, socket]);
  (0, import_react8.useEffect)(() => {
    isSocketOnline && (socket == null ? void 0 : socket.on("move-to-game", () => {
      startRoom();
    }));
    return () => {
      socket == null ? void 0 : socket.off("move-to-game");
    };
  }, [isSocketOnline, navigate, socket, startRoom]);
  (0, import_react8.useEffect)(() => {
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
      socket == null ? void 0 : socket.emit(import_wdyc_utils3.PATHS.START_GAME, data, (res) => {
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
      socket == null ? void 0 : socket.emit(import_wdyc_utils3.PATHS.LEAVE_ROOM, user, (res) => {
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
      socket == null ? void 0 : socket.emit(import_wdyc_utils3.PATHS.CLOSE_ROOM, user, (res) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useHome,
  useRoom,
  useSocket,
  useSocketContext,
  useUserContext,
  useWaitingRoom
});
