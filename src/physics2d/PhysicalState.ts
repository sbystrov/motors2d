import {Vector} from "../utils/Vector";

export class PhysicalState {
  position: Vector = new Vector(0,0);
  orientation: number = 0;
  velocity: Vector = new Vector(0,0);
  angularVelocity: number = 0;
}