import type { IPoint, Location, PointStatus } from "battleship-types";
import { EPointStatus } from "../enum/EPointStatus";

class Point implements IPoint {
  public location: Location;
  public status: PointStatus;

  constructor(x: number, y: number) {
    this.location = { x, y };
    this.status = EPointStatus.Empty;
  }

  public updateStatus(status: PointStatus): void {
    this.status = status;
  }
}

export default Point;
