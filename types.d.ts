export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  received: (player: Player) => void;
  errorMessage: (message: string) => void;
  updateOpponentBoard: (board: Board) => void;
  endGame: (player: Player) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  customEvent: (player: Player) => void;
  joinGame: (roomId: string, callBack: Function) => void;
  createGame: (callBack: Function) => void;
  updateBoard: (roomId: string, board: Board) => void;
  endGame: (player: Player) => void;

}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export interface Player {
  name: string;
  roomId: string;
  role: "opponent" | "creator";
}

export interface CountRoom {
  clientCount: number;
  roomId: string;
}

export enum EShip {
  Destroyer,
  Submarine,
  Cruiser,
  Battleship,
  Carrier
} 

export interface Ship {
  name: EShip;
  size: number;
  orientation: "vertical" | "horizontal";
  spaceOccupied: Point[];
  isSunk: boolean;
}

export interface Point {
  x: number,
  y: number,
  state: boolean
}

export interface Board {
  ship: Ship[],
  ocean: Point[],
  player: Player;
}