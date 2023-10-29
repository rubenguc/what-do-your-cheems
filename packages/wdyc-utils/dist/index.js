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

// index.ts
var wdyc_utils_exports = {};
__export(wdyc_utils_exports, {
  GAME_MODES: () => GAME_MODES,
  PATHS: () => PATHS,
  ROUNDS_TO_SELECT: () => ROUNDS_TO_SELECT,
  messages: () => messages
});
module.exports = __toCommonJS(wdyc_utils_exports);

// messages.ts
var messages = {
  error: {
    invalid_username: "invalid_username",
    invalid_room_code: "invalid_room_code",
    connection_error: "connection_error",
    server_error: "server_error",
    room_does_not_exist: "room_does_not_exist",
    invalid_room: "invalid_room",
    room_already_started: "room_already_started",
    username_already_taken: "username_already_taken",
    room_not_found: "room_not_found",
    player_not_found: "player_not_found",
    player_can_not_start_the_game: "player_can_not_start_the_game",
    at_least_three_players_to_start_game: "at_least_three_players_to_start_game",
    invalid_card: "invalid_card",
    you_already_played: "you_already_played",
    you_are_not_room_creator: "your_are_not_room_creator",
    not_enough_cards_to_play: "not_enough_cards_to_play"
  }
};

// socket-paths.ts
var CLOSE_ROOM = "close-room";
var CREATE_ROOM = "create-room";
var CREATOR_FINISH_GAME = "creator-finish-game";
var GET_ROOM_INFO = "get-room-info";
var GET_WAITING_ROOM_INFO = "get-waiting-room-info";
var JOIN_ROOM = "join-room";
var LEAVE_ROOM = "leave-room";
var RECONNECT = "reconnect";
var SET_CARD = "set-card";
var SET_WINNER_CARD = "set-winner-card";
var START_GAME = "start-game";
var PATHS = {
  CLOSE_ROOM,
  CREATE_ROOM,
  CREATOR_FINISH_GAME,
  GET_ROOM_INFO,
  GET_WAITING_ROOM_INFO,
  JOIN_ROOM,
  LEAVE_ROOM,
  RECONNECT,
  SET_CARD,
  SET_WINNER_CARD,
  START_GAME
};

// game-modes.ts
var ROUNDS_TO_SELECT = [5, 6, 7, 8, 9, 10];
var GAME_MODES = [
  {
    key: "mm",
    value: "game_mode_meme"
  },
  {
    key: "mp",
    value: "game_mode_phrase"
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GAME_MODES,
  PATHS,
  ROUNDS_TO_SELECT,
  messages
});
