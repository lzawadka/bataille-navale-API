import { IBoard } from "./board";
import { IPlayer } from "./player";
import { IPoint } from "./point";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  received: (player: IPlayer) => void;
  errorMessage: (message: string) => void;
  updateOpponentBoard: (board: IBoard, player: IPlayer) => void;
  endGame: (player: IPlayer) => void;
  startGame: (isFull: boolean) => void;
  isPlayerReadyToPlayToClient: (isReady: boolean) => void;
  isGameReadyToStart: (isReady: boolean) => void;
}
  
export interface ClientToServerEvents {
  hello: () => void;
  customEvent: (player: IPlayer) => void;
  joinGame: (roomId: string, callBack: Function) => void;
  createGame: (gameId: string, callBack: Function) => void;
  updateBoard: (gameId: string, board: IBoard, player: IPlayer) => void;
  endGame: (gameId: string, player: IPlayer) => void;
  isPlayerReadyToPlay: (gameId: string, playerName: string, isReady: boolean) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}