import {RigidObject} from "./RigidObject";
import {Vector} from "../utils/Vector";
import {RectShape} from "./shape/RectShape";

export class Collision {
  obj1: RigidObject;
  obj2: RigidObject;
  position: Vector;
  direction: Vector;
}

// const rectIntersect = (x1, y1, w1, h1, x2, y2, w2, h2) => {
//   // Check x and y for overlap
//   if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
//     return false;
//   }
//   return true;
// }

// LINE/LINE
const lineLine = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): Vector => {

  // calculate the direction of the lines
  const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    // optionally, draw a circle where the lines meet
    const intersectionX = x1 + (uA * (x2-x1));
    const intersectionY = y1 + (uA * (y2-y1));
    // fill(255,0,0);
    // noStroke();
    // ellipse(intersectionX, intersectionY, 20, 20);

    return new Vector(intersectionX, intersectionY);
  }
  return null;
}

export const detectCollision = (obj0: RigidObject, obj1: RigidObject): Vector => {
  if (obj0.shape instanceof RectShape && obj1.shape instanceof RectShape) {
    const poly0 = obj0.shape.getPoly(obj0.position, obj0.orientation);
    const poly1 = obj1.shape.getPoly(obj1.position, obj1.orientation);

    const collisionPoints: Vector[] = [];
    for (let i = 0; i < poly0.lines.length; i++) {
      const l0 = poly0.lines[i];

      for (let j = 0; j < poly1.lines.length; j++) {
        const l1 = poly1.lines[j];
        const collision = lineLine(l0.x0, l0.y0, l0.x1, l0.y1, l1.x0, l1.y0, l1.x1, l1.y1);
        if (collision) {
          collisionPoints.push(collision);
        }
      }
    }

    if (collisionPoints.length > 0) {
      let resX = 0;
      let resY = 0;
      collisionPoints.forEach(p => {
        resX += p.x;
        resY += p.y;
      });

      return new Vector(resX / collisionPoints.length, resY / collisionPoints.length);
    }
  }

  return null;
}