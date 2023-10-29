import { useState, useEffect, useCallback } from "react";
import {
  CreatorFinishGamePayload,
  CreatorFinishGameResponse,
  GetRoomInfoResponse,
  SetCardPayload,
  SetCardResponse,
  SetWinnerCardPayload,
  SetWinnerCardResponse,
  MemeCard,
  PhraseCard,
  Card,
  RoomPlayer,
  RoomJudge,
  ReceiveCard,
  Judge,
  Player,
} from "wdyc-interfaces";
import { useSocketContext } from "./useSocketContext";
import { useUserContext } from "./useUserContext";
import { useTranslation } from "react-i18next";
import { PATHS } from "wdyc-utils";

interface useRoomProps {
  navigate: (route: string) => void;
  onShowError: (message: string) => void;
  onShowMessage: (message: string, persistent?: boolean, id?: string) => void;
  onClear: () => void;
  onCloseAllToasts: () => void;
}

export const useRoom = ({
  navigate,
  onShowError,
  onClear,
  onShowMessage,
  onCloseAllToasts,
}: useRoomProps) => {
  const { t } = useTranslation("room");
  // hooks
  const { isSocketOnline, socket } = useSocketContext();
  const { user } = useUserContext();

  if (!user) throw new Error("User context needed");

  // state

  // cards to play
  const [cardsToSelect, setCardToSelect] = useState<Card[]>([]);
  const [judge, setJudge] = useState<RoomJudge>({
    username: "",
    card: {},
  });
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [game, setGame] = useState<any>({
    isEnded: false,
    config: {},
    winner: "",
    round: 0,
    roomCreator: "",
    players: [],
  });
  const [waitingForJudge, setWaitingForJudge] = useState(false);

  // card to select to win
  const [playerCards, setPlayerCards] = useState<any[]>([]);

  const isJudge = judge.username === user.username;

  const isRoomCreator = game.roomCreator === user.username;

  const setCard = (card: Card) => {
    const data: SetCardPayload | SetWinnerCardPayload = {
      ...user,
      card,
    };

    const socketMethod = isJudge ? PATHS.SET_WINNER_CARD : PATHS.SET_CARD;

    socket?.emit(
      socketMethod,
      data,
      (resp: SetCardResponse | SetWinnerCardResponse) => {
        if (resp.error) return onShowError(t(resp.message));
        if (!isJudge) {
          setCardToSelect((state) =>
            state.filter((c) => {
              if (c.type === "MEME") {
                return c.url !== (card as MemeCard).url;
              }

              if (c.type === "PHRASE") {
                return c.content !== (card as PhraseCard).content;
              }

              return c;
            })
          );

          if (socketMethod === "set-card") {
            onShowMessage(
              resp.data?.isRoundOver
                ? t("waiting_for_judge")
                : t("waiting_for_players"),
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
    if (!isRoomCreator) return;
    const data: CreatorFinishGamePayload = {
      roomCode: user.roomCode,
      username: user.username,
    };

    socket?.emit(
      PATHS.CREATOR_FINISH_GAME,
      data,
      (resp: CreatorFinishGameResponse) => {
        if (resp.error) onShowError(resp.message);
      }
    );
  };

  useEffect(() => {
    if (!user.roomCode) return;
    socket?.emit(PATHS.GET_ROOM_INFO, user, (resp: GetRoomInfoResponse) => {
      const {
        cardsToSelect,
        judge,
        players,
        playerCards,
        waitingForJudge,
        round,
        config,
        roomCreator,
        isEnded,
        winner,
      } = resp.data!;

      if (isEnded) {
        setGame({
          isEnded: true,
          config: {},
          winner: winner,
          round: 0,
          roomCreator: "",
        });

        return;
      }

      setCardToSelect(cardsToSelect || []);
      setPlayers(players || []);
      setJudge(judge || null);
      setPlayerCards(
        playerCards.map((c) => ({
          ...c.card,
          username: c.username,
        })) || []
      );
      setWaitingForJudge(waitingForJudge || cardsToSelect.length < 7);
      if (waitingForJudge || cardsToSelect.length < 7) {
        if (waitingForJudge && user.username === judge.username) {
          return onShowMessage(t("select_the_winner_card"), true);
        }

        onShowMessage(
          waitingForJudge ? t("waiting_for_judge") : t("waiting_for_judge"),
          true
        );
      }

      setGame((state: any) => ({
        ...state,
        round,
        config,
        roomCreator,
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocketOnline, user.roomCode]);

  useEffect(() => {
    socket?.on("player-set-card", (resp: string) => {
      // onShowError(`${resp} set a card`);
      // TODO: update player in bottom
    });

    return () => {
      socket?.off("player-set-card");
    };
  }, [isSocketOnline, onShowError, socket]);

  useEffect(() => {
    socket?.on("select-judge-card", (resp: ReceiveCard[]) => {
      if (isJudge)
        setPlayerCards(
          resp.map((c) => ({
            ...c.card,
            username: c.username,
          }))
        );
    });

    return () => {
      socket?.off("select-judge-card");
    };
  }, [isSocketOnline, isJudge, socket]);

  useEffect(() => {
    // socket called when all players (except de judge) set a card
    socket?.on("all-players-ready", () => {
      setWaitingForJudge(true);
      if (isJudge) {
        return onShowMessage(t("select_the_winner_card"), true);
      }
      onShowMessage(t("waiting_for_judge"), true);
    });

    return () => {
      socket?.off("all-players-ready");
    };
  }, [isSocketOnline, isJudge, socket, onShowMessage, t]);

  useEffect(() => {
    // socket called when judge select the winner card
    // TODO: users should manage with id not username
    socket?.on("winner-card", (resp: string) => {
      onShowMessage(`winner ${resp}`, false, "winner");
      setPlayers((state) =>
        state.map((player) =>
          player.username === resp
            ? { ...player, numberOfWins: player.numberOfWins + 1 }
            : player
        )
      );
    });

    return () => {
      socket?.off("winner-card");
    };
  }, [isSocketOnline, isJudge, socket, onShowError, onShowMessage]);

  useEffect(() => {
    // socket called when judge select the winner card
    socket?.on("next-round", (resp: { judge: Judge }) => {
      setJudge(resp.judge);
      setWaitingForJudge(false);
      setPlayerCards([]);
      onShowMessage(t("starting_next_round"));
      setGame((state: any) => ({
        ...state,
        round: state.round + 1,
      }));
    });

    return () => {
      socket?.off("next-round");
    };
  }, [isSocketOnline, onShowError, onShowMessage, socket, t]);

  useEffect(() => {
    socket?.on(
      "end-game",
      ({ winner, players }: { winner?: string; players: Player[] }) => {
        onCloseAllToasts();
        setGame({
          isEnded: true,
          winner: winner,
          config: "",
          round: 0,
          players,
        });
      }
    );

    return () => {
      socket?.off("end-game");
    };
  }, [onShowError, socket]);

  useEffect(() => {
    socket?.on("new-card", (resp: { card: Card }) => {
      if (resp.card) {
        setCardToSelect((state) => [...state, resp.card]);
      }
    });

    return () => {
      socket?.off("new-card");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("finish-game", () => {
      goToHome();
    });

    return () => {
      socket?.off("finish-game");
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
    finishGame,
  };
};
