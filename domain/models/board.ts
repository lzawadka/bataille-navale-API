import { IPoint } from "./point";
import { IShip } from "./ships";

/**
 * Board
 */
export interface IBoard {
  ocean: IPoint[][];
  clearBoard(): void;
  getPoint(location: Location): IPoint;
  checkShipPlacement(ship: IShip, startLocation: Location): boolean;
}
