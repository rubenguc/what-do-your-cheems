declare const messages: {
    error: {
        invalid_username: string;
        invalid_room_code: string;
        connection_error: string;
        server_error: string;
        room_does_not_exist: string;
        invalid_room: string;
        room_already_started: string;
        username_already_taken: string;
        room_not_found: string;
        player_not_found: string;
        player_can_not_start_the_game: string;
        at_least_three_players_to_start_game: string;
        invalid_card: string;
        you_already_played: string;
        you_are_not_room_creator: string;
        not_enough_cards_to_play: string;
    };
};

declare const PATHS: {
    CLOSE_ROOM: string;
    CREATE_ROOM: string;
    CREATOR_FINISH_GAME: string;
    GET_ROOM_INFO: string;
    GET_WAITING_ROOM_INFO: string;
    JOIN_ROOM: string;
    LEAVE_ROOM: string;
    RECONNECT: string;
    SET_CARD: string;
    SET_WINNER_CARD: string;
    START_GAME: string;
};

declare const ROUNDS_TO_SELECT: number[];
declare const GAME_MODES: {
    key: string;
    value: string;
}[];

export { GAME_MODES, PATHS, ROUNDS_TO_SELECT, messages };
