import { IPoint } from './point';

/**
 * Ships
 */
export type ShipType =
  | 'Destroyer'
  | 'Submarine'
  | 'Cruiser'
  | 'Battleship'
  | 'Carrier';

export type ShipOrientation = 'horizontal' | 'vertical';

export interface IBaseShip {
  name: string;
  orientation: ShipOrientation;
}

export interface IShip extends IBaseShip {
  type: ShipType;
  spacesOccupied: IPoint[];
  size: number;
  isSunk(): boolean;
  sink(): void;
}

export type ShipData = {
  name: string;
  size: number;
  orientation: 'horizontal' | 'vertical';
};
