export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  received: (player: Player) => void;
  errorMessage: (message: string) => void;
  updateOpponentBoard: (point: Point) => void;
  endGame: (player: Player) => void;
  startGame: (isFull: boolean) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  customEvent: (player: Player) => void;
  joinGame: (roomId: string, callBack: Function) => void;
  createGame: (gameId: string, callBack: Function) => void;
  updateBoard: (gameId: string, point: Point) => void;
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
}

export interface ShipOnMap {
  ship: Ship;
  orientation: "vertical" | "horizontal";
  spaceOccupied: Point[];
}

export interface Point {
  x: number,
  y: number,
  status: "touch" | "notTouch" | "etc"
}

export interface Board {
  ships: Ship[],
  opponentBoard: Point[],
  player: Player;
}