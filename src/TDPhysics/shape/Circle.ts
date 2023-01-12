import {Polygon, Shape} from "./Shape";
import {Vector} from '../Vector';

export class Circle extends Shape {
  radius: number = 5;

  constructor(radius?: number) {
    super();

    this.radius = radius || 5;
  }

  public momentOfInertia(mass: number) {
    return 2 * mass * (this.radius ** 2) / 5;
  };

  public draw(context:CanvasRenderingContext2D) {
    context.beginPath();
    context.ellipse(0, 0, this.radius, this.radius, 0, 0, Math.PI * 2);
    context.stroke();
    context.closePath();
  }

  public getPoly(position: Vector, orientation: number): Polygon {
    const res = new Polygon();

    // const points: Vector[] = [];
    // points[0] = new Vector(-this.width / 2, this.height / 2);
    // points[1] = new Vector(this.width / 2, this.height / 2);
    // points[2] = new Vector(this.width / 2, -this.height / 2);
    // points[3] = new Vector(-this.width / 2, -this.height / 2);
    //
    // // Rotate
    // const sin = Math.sin(orientation);
    // const cos = Math.cos(orientation);
    //
    // points.forEach(p => {
    //   const x = p.x * cos - p.y * sin;
    //   const y = p.x * sin + p.y * cos;
    //
    //   p.x = x;
    //   p.y = y;
    // });
    //
    // // Translate
    // points.forEach(p => {
    //   p.x = p.x + position.x;
    //   p.y = p.y + position.y;
    // });
    //
    // res.lines.push(new Line(points[0], points[1]));
    // res.lines.push(new Line(points[1], points[2]));
    // res.lines.push(new Line(points[2], points[3]));
    // res.lines.push(new Line(points[3], points[0]));

    return res;
  };

  public getVertices(pos: Vector, axis: Vector): Vector[] {
    return [
      pos.add(axis.unit().mult(-this.radius)),
      pos.add(axis.unit().mult(this.radius))
    ];
  };
}