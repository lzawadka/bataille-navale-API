
import { IBoard } from "./board";
import { ITurn } from "./game";
import { PointStatus } from "./point";
import { IBaseShip, IShip } from "./ships";

export interface IPlayerInGame {
  player: IPlayer;
  board: IBoard;
  fleet: IShip[];
  allShipsDestroyed: boolean;
  guessedSpaces: Map<string, PointStatus>;
  placeShip(ship: IBaseShip, location: Location): void;
  receiveGuess(location: Location): PointStatus;
  makeGuess(location: Location, opponent: IPlayerInGame): ITurn;
}

export interface IPlayer {
    name: string;
    role: '' | "opponent" | "creator";
    isReadyToPlay: boolean;
}

