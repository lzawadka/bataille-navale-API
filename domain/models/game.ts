import { IBoard } from './board';
import { IPlayer } from './player';
import { PointStatus } from './point';


/**
 * Game
 */
export interface ITurn {
  id: number;
  playerName: string;
  guess: Location;
  result: PointStatus;
}

export enum EAppStep {
  Intro,
  Placing,
  Guessing,
  Ending,
  HighScores,
}

export interface IGame {
  playerBoard: IBoard;
  opponentBoard: IBoard;
  player: IPlayer;
  opponent: IPlayer;
  turns: ITurn[];
  winner: IPlayer | null;
  play(): void;
  addTurn(turn: ITurn): ITurn[];
  declareWinner(player: IPlayer): void;
}

export interface Game {
    clientCount: number;
    gameId: string;
    playerReady?: number;
}


