import {RigidObject} from "./RigidObject";
import {Vector} from "../utils/Vector";
import {RectShape} from "./shape/RectShape";

export class Collision {
  obj1: RigidObject;
  obj2: RigidObject;
  direction: Vector;
}

const rectIntersect = (x1, y1, w1, h1, x2, y2, w2, h2) => {
  // Check x and y for overlap
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}

export const detectCollision = (obj1: RigidObject, obj2: RigidObject): Vector => {
  const shape1 = obj1.shape as RectShape;
  const shape2 = obj1.shape as RectShape;

  if (rectIntersect(
    obj1.state.position.x - shape1.width / 2,
    obj1.state.position.y - shape1.height / 2,
    shape1.width,
    shape1.height,
    obj2.state.position.x - shape2.width / 2,
    obj2.state.position.y - shape2.height / 2,
    shape2.width,
    shape2.height
  )) {
    const vector = obj2.state.position.subtract(obj1.state.position);
    vector.normalize();
    return vector;
  }

  return null;
}