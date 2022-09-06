export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  received: (player: Player) => void;
  errorMessage: (message: string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  customEvent: (player: Player) => void;
  joinRoom: (roomId: string, callBack: Function) => void;
  createRoom: (roomId: string, callBack: Function) => void;
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
}

export interface CountRoom {
  clientCount: number;
  roomId: string;
}