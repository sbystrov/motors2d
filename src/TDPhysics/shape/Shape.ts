import {Vector} from '../Vector';

export abstract class Shape {
  pos: Vector;

  public abstract draw(context: CanvasRenderingContext2D): void;
  public abstract getPoly(position: Vector, orientation: number): Polygon;
  public abstract momentOfInertia(mass: number): number;

  public abstract getVertices(pos: Vector, axis: Vector): Vector[];
}

export class Line {
  x0: number;
  y0: number;
  x1: number;
  y1: number;

  constructor(p0: Vector, p1: Vector) {
    this.x0 = p0.x;
    this.y0 = p0.y;
    this.x1 = p1.x;
    this.y1 = p1.y;
  }
}

export class Polygon {
  lines: Line[] = [];
}