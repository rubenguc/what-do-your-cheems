import { useState, useEffect } from 'react';
import { useSocketContext, useToast } from '../common';
import useStore from '../../store';
// import {
//   SocketResponse,
//   GetRoomInfoResponse,
// } from "../../interfaces/socketResponses-interfaces";
import { useNavigate } from 'react-router-dom';
// import { Card, MemeCard, PhraseCard } from "interfaces/room-interfaces";

export const useRoom = () => {
  // store
  const user = useStore((state) => state.user);
  const clear = useStore((state) => state.clear);

  // hooks
  const navigate = useNavigate();
  const { isSocketOnline, socket } = useSocketContext();
  const { showErrorToast, showSuccessToast } = useToast();

  // state

  // cards to play
  const [cardsToSelect, setCardToSelect] = useState<any[]>([]);
  const [judge, setJudge] = useState<any>({
    username: '',
    card: {},
  });
  const [players, setPlayers] = useState<
    { username: string; numberOfWins: number }[]
  >([]);
  const [game, setGame] = useState<any>({
    isEnded: false,
    config: {},
    winner: '',
    round: 0,
    roomCreator: '',
  });
  const [waitingForJudge, setWaitingForJudge] = useState(false);

  // card to select to win
  const [playerCards, setPlayerCards] = useState<any[]>([]);

  const isJudge = judge.username === user.username;

  const isRoomCreator = game.roomCreator === user.username;

  const setCard = (card: any) => {
    // TODO: fix types
    const data = {
      ...user,
      card,
    };

    const socketMethod = isJudge ? 'set-winner-card' : 'set-card';

    socket?.emit(socketMethod, data, (resp: any) => {
      if (!isJudge)
        setCardToSelect((state) =>
          state.filter((c) => {
            if (c.type === 'MEME') {
              return c.url !== (card as any).url;
            }

            if (c.type === 'PHRASE') {
              return c.content !== (card as any).content;
            }
          })
        );
    });
  };

  const goToHome = () => {
    clear();
    navigate('/');
  };

  const finishGame = () => {
    if (!isRoomCreator) return;
    const data = {
      roomCode: user.roomCode,
      username: user.username,
    };

    socket?.emit('creator-finish-game', data, (resp: any) => {
      if (resp.error) showErrorToast(resp.message);
    });
  };

  useEffect(() => {
    if (!user.roomCode) return;
    socket?.emit('get-room-info', user, (resp: any) => {
      const {
        cardsToSelect,
        judge,
        players,
        playerCards,
        waitingForJudge,
        round,
        config,
        roomCreator,
      } = resp.data;

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
      setGame((state: any) => ({
        ...state,
        round,
        config,
        roomCreator,
      }));
    });

    return () => {
      socket?.off('get-room-info');
    };
  }, [isSocketOnline, user]);

  useEffect(() => {
    socket?.on('player-set-card', (resp: any) => {
      showSuccessToast(`${resp} set a card`);
    });

    return () => {
      socket?.off('player-set-card');
    };
  }, [isSocketOnline]);

  useEffect(() => {
    socket?.on('select-judge-card', (resp: any) => {
      if (isJudge)
        setPlayerCards(
          resp.map((c) => ({
            ...c.card,
            username: c.username,
          }))
        );
    });

    return () => {
      socket?.off('select-judge-card');
    };
  }, [isSocketOnline, isJudge]);

  useEffect(() => {
    // socket called when all players (except de judge) set a card
    socket?.on('all-players-ready', (resp: any) => {
      setWaitingForJudge(true);
      showSuccessToast(`now, judge will select the winner card`);
    });

    return () => {
      socket?.off('all-players-ready');
    };
  }, [isSocketOnline, isJudge]);

  useEffect(() => {
    // socket called when judge select the winner card
    socket?.on('winner-card', (resp: any) => {
      showSuccessToast(`winner ${resp}`);
      setPlayers((state) =>
        state.map((player) =>
          player.username === resp
            ? { ...player, numberOfWins: player.numberOfWins + 1 }
            : player
        )
      );
    });

    return () => {
      socket?.off('winner-card');
    };
  }, [isSocketOnline, isJudge]);

  useEffect(() => {
    // socket called when judge select the winner card
    socket?.on('next-round', (resp: any) => {
      setJudge(resp.judge);
      setWaitingForJudge(false);
      setPlayerCards([]);
      showSuccessToast(`starting next round..`);
      setGame((state) => ({
        ...state,
        round: state.round + 1,
      }));
    });

    return () => {
      socket?.off('next-round');
    };
  }, [isSocketOnline]);

  useEffect(() => {
    socket?.on('end-game', (resp: any) => {
      showSuccessToast(`End game, winner: ${resp}`);
      setGame({
        isEnded: true,
        winner: resp,
        config: '',
        round: 0,
      });
    });

    return () => {
      socket?.off('end-game');
    };
  }, [socket]);

  useEffect(() => {
    socket?.on('new-card', (resp: { card: string }) => {
      if (resp.card) {
        setCardToSelect((state: any) => [...state, resp.card]);
      }
    });

    return () => {
      socket?.off('new-card');
    };
  }, [socket]);

  useEffect(() => {
    socket?.on('finish-game', () => {
      goToHome();
    });

    return () => {
      socket?.off('finish-game');
    };
  }, [socket]);

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
