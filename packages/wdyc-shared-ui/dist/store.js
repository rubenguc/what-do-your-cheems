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

// store.ts
var store_exports = {};
__export(store_exports, {
  default: () => store_default
});
module.exports = __toCommonJS(store_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
