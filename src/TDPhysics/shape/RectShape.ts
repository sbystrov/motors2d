import {Line, Polygon, Shape} from "./Shape";
import {Vector} from '../Vector';

export class RectShape extends Shape {
  width: number = 5;
  height: number = 5;

  constructor(width?: number, height?: number) {
    super();

    this.width = width || 5;
    this.height = height || 5;
  }

  public momentOfInertia(mass: number) {
    return mass * (this.width * this.height) / 6;
  };

  public draw(context:CanvasRenderingContext2D) {
    context.beginPath();
    context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.stroke();
    context.closePath();
  }

  public getPoly(position: Vector, orientation: number): Polygon {
    const res = new Polygon();

    const points: Vector[] = [];
    points[0] = new Vector(-this.width / 2, this.height / 2);
    points[1] = new Vector(this.width / 2, this.height / 2);
    points[2] = new Vector(this.width / 2, -this.height / 2);
    points[3] = new Vector(-this.width / 2, -this.height / 2);

    // Rotate
    const sin = Math.sin(orientation);
    const cos = Math.cos(orientation);

    points.forEach(p => {
      const x = p.x * cos - p.y * sin;
      const y = p.x * sin + p.y * cos;

      p.x = x;
      p.y = y;
    });

    // Translate
    points.forEach(p => {
      p.x = p.x + position.x;
      p.y = p.y + position.y;
    });

    res.lines.push(new Line(points[0], points[1]));
    res.lines.push(new Line(points[1], points[2]));
    res.lines.push(new Line(points[2], points[3]));
    res.lines.push(new Line(points[3], points[0]));

    return res;
  };

  public getVertices(pos: Vector, axis: Vector): Vector[] {
    throw new Error("Method not implemented.");
  }
}