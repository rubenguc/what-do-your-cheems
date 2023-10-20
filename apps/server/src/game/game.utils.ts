import { SocketResponse } from './dto/gateway-dt';

interface SocketResponserProps<T> {
  message?: string;
  data?: T;
  error?: boolean;
}

export const handleSocketResponse = <T>({
  message = 'ok',
  data,
  error = false,
}: SocketResponserProps<T>): SocketResponse<T> => {
  return {
    message,
    data,
    error,
  };
};

interface GetTotalCardsToPlayersProps {
  rounds: number;
  players: number;
  cardsPerPlayer: number;
}

export const getTotalCardsToPlayers = ({
  rounds,
  players,
  cardsPerPlayer,
}: GetTotalCardsToPlayersProps) => {
  const totalJudgeCards = rounds;

  const totalPlayersCards = players * cardsPerPlayer + (players - 1) * rounds;

  return {
    totalJudgeCards,
    totalPlayersCards,
  };
};

export const dataToCards = (
  data: any[],
  origin: 'memes' | 'phrases',
): any[] => {
  let cards: any[] = [];

  if (origin === 'memes') {
    cards = data.map((m) => ({
      type: 'MEME',
      url: m.url,
      imageOrientation: m.imageOrientation,
    }));
  }

  if (origin === 'phrases') {
    cards = data.map((m) => ({
      type: 'PHRASE',
      content: m.phrase,
    }));
  }

  return cards;
};

interface FillCardsProps {
  totalPlayersCards: number;
  playerCards: any[];
}

export const fillCards = ({
  totalPlayersCards,
  playerCards,
}: FillCardsProps) => {
  let needRefill = false;
  const cardsLength = playerCards.length;
  let cards = [...playerCards];

  if (cardsLength >= totalPlayersCards) {
    return {
      filledCards: cards,
      needRefill,
    };
  }

  while (cards.length < totalPlayersCards) {
    const missingCards = totalPlayersCards - cards.length;
    const amountToFill =
      cards.length > missingCards ? missingCards : cards.length;

    const newCards = [...cards].splice(0, amountToFill);
    cards = [...cards, ...newCards];
  }
  needRefill = true;
  return {
    filledCards: cards,
    needRefill,
  };
};
