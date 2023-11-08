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

// providers/index.ts
var providers_exports = {};
__export(providers_exports, {
  SocketContext: () => SocketContext,
  SocketProvider: () => SocketProvider,
  UserContext: () => UserContext,
  UserProvider: () => UserProvider
});
module.exports = __toCommonJS(providers_exports);

// providers/SocketProvider.tsx
var import_react2 = require("react");

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

// providers/SocketProvider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SocketContext = (0, import_react2.createContext)({});
var SocketProvider = ({ children }) => {
  const { socket, isSocketOnline } = useSocket();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocketContext.Provider, {
    value: {
      socket,
      isSocketOnline
    },
    children
  });
};

// providers/UserProvider.tsx
var import_react3 = require("react");

// store.ts
var import_zustand = require("zustand");
var useStore = (0, import_zustand.create)((set) => ({
  user: {
    username: "",
    roomCode: "",
    roomIsStarted: false,
    isInit: false
  },
  login: ({ roomCode, username, roomIsStarted }) => {
    const user = {
      roomCode,
      username,
      roomIsStarted,
      isInit: true
    };
    set((state) => {
      return {
        ...state,
        user
      };
    });
  },
  startRoom: () => {
    set((state) => ({
      ...state,
      user: {
        ...state.user,
        roomIsStarted: true
      }
    }));
  },
  clear: () => {
    set((state) => ({
      ...state,
      user: {
        username: "",
        roomCode: "",
        roomIsStarted: false,
        isInit: true
      }
    }));
  }
}));
var store_default = useStore;

// providers/UserProvider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var UserContext = (0, import_react3.createContext)({});
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserContext.Provider, {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SocketContext,
  SocketProvider,
  UserContext,
  UserProvider
});
