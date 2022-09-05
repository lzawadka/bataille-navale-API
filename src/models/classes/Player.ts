import type {
  IBaseShip,
  IBoard,
  IPlayer,
  IPoint,
  IShip,
  ITurn,
  Location,
  PointStatus,
} from "battleship-types";
import { EShipType } from "../enums/EShipType";
import Ship from "./Ship";

class Player implements IPlayer {
  public name: string = "mabite";
  public board: IBoard | undefined;
  public fleet: IShip[] = [
    new Ship(EShipType.Destroyer),
    new Ship(EShipType.Submarine),
    new Ship(EShipType.Cruiser),
    new Ship(EShipType.Battleship),
    new Ship(EShipType.Carrier),
  ];
  allShipsDestroyed: boolean = false;
  guessedSpaces: Map<string, PointStatus> = new Map();

  placeShip(ship: IBaseShip, location: Location): void {
    throw new Error("Method not implemented.");
  }
  receiveGuess(location: Location): PointStatus {
    throw new Error("Method not implemented.");
  }
  makeGuess(location: Location, opponent: IPlayer): ITurn {
    throw new Error("Method not implemented.");
  }
}

export default Player;
