export interface Config {
  totalRounds: number;
  gameMode: string;
}

export interface ReceiveCard {
  username: string;
  card: Card;
}

export interface Judge {
  card: any;
  username: string;
  receivedCards: ReceiveCard[];
}

export interface Player {
  username: string;
  numberOfWins: number;
  cards: Card[];
  socketId: string;
}

export interface Room {
  roomCreator: string;
  config: Config;
  round: number;
  playerCards: Card[];
  judgeCards: Card[];
  judge: Judge;
  winner: string;
  players: Player[];
  isStarted: boolean;
}

export interface PhraseCard {
  type: 'PHRASE';
  content: string;
}

export interface MemeCard {
  type: 'MEME';
  url: string;
  imageOrientation: string;
}

export type Card = PhraseCard | MemeCard;
