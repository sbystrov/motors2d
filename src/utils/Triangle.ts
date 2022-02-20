import {Vector} from "./Vector";

export class Triangle {
  p0: Vector;
  p1: Vector;
  p2: Vector;

  constructor(p0: Vector, p1: Vector, p2: Vector) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
  }

  public contains(p: Vector) {
    const { p0, p1, p2 } = this;
    const A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    const sign = A < 0 ? -1 : 1;
    const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
  }
}