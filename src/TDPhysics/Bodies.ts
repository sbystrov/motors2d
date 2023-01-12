import { RigidBody } from './RigidBody';
import {RectShape} from './shape/RectShape';
import {Circle} from './shape/Circle';
import {Vector} from './Vector';

export class Bodies {
  static rectangle = (centerX: number, centerY: number, width: number, height: number): RigidBody => {
    const shape = new RectShape(width, height);
    const res = new RigidBody(shape);
    res.position = new Vector(centerX, centerY);

    return res;
  }

  static circle = (centerX: number, centerY: number, radius: number): RigidBody => {
    const shape = new Circle(radius);
    const res = new RigidBody(shape);
    res.position = new Vector(centerX, centerY);

    return res;
  }
}